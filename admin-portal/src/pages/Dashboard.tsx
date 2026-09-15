import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
import { ClipboardList, Clock, Users, Package, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody } from '@/components/ui/table'
import { DataTableHeader } from '@/components/data-table/DataTableHeader'
import { TableRows } from '@/components/data-table/TableRows'
import { TableRowSkeleton } from '@/components/data-table/TableRowSkeleton'
import { OverviewCard } from '@/components/shared/OverviewCard'
import { OrdersTrendChart } from '@/components/dashboard/OrdersTrendChart'
import { OrderStatusBreakdown } from '@/components/dashboard/OrderStatusBreakdown'
import { UpcomingOrdersCard } from '@/components/dashboard/UpcomingOrdersCard'
import { DateRangeFilter } from '@/components/dashboard/DateRangeFilter'
import {
  DATE_RANGE_PRESETS,
  buildTrendBuckets,
  getDateRangeForPreset,
  type DateRangePreset,
} from '@/lib/dashboard-date-ranges'
import { dashboardOrderColumns } from '@/components/data-table/columns/DashboardOrderColumns'
import { activityLogColumns } from '@/components/data-table/columns/ActivityLogColumns'
import { useOrders } from '@/api/orders'
import { useCleaners } from '@/api/cleaners'
import { useItems } from '@/api/items'
import { useActivityLogs } from '@/api/activity-log'
import { usePermission } from '@/hooks/use-permission'
import { ACTIONS, MODULES } from '@/lib/permission-registry'
import type { OrderStatus } from '@/types'

const RECENT_LIMIT = 5
// Backend has no analytics/aggregate endpoint, so the trend chart, status
// breakdown, and upcoming-orders widget below are all computed client-side
// from one recent-orders sample (capped at the API's max page size) rather
// than the whole table — fine for this thesis dataset's size.
const TREND_SAMPLE_LIMIT = 100

export default function Dashboard() {
  const { hasPermission } = usePermission()
  const canViewOrders = hasPermission(MODULES.ORDER, ACTIONS.VIEW)
  const canViewCleaners = hasPermission(MODULES.CLEANER, ACTIONS.VIEW)
  const canViewItems = hasPermission(MODULES.SETUP_ITEM, ACTIONS.VIEW)
  const canViewActivity = hasPermission(MODULES.ACTIVITY_LOG, ACTIONS.VIEW)

  const { data: allOrders, isLoading: loadingOrderCount } = useOrders({ limit: 1 }, { enabled: canViewOrders })
  const { data: pendingOrders, isLoading: loadingPendingCount } = useOrders(
    { limit: 1, status: 'PENDING' },
    { enabled: canViewOrders }
  )
  const { data: activeCleaners, isLoading: loadingCleanerCount } = useCleaners(
    { limit: 1, status: true },
    { enabled: canViewCleaners }
  )
  const { data: allItems, isLoading: loadingItemCount } = useItems({ limit: 1 }, { enabled: canViewItems })

  const { data: recentOrders, isLoading: loadingRecentOrders } = useOrders(
    { limit: RECENT_LIMIT },
    { enabled: canViewOrders }
  )
  const { data: recentActivity, isLoading: loadingRecentActivity } = useActivityLogs(
    { limit: RECENT_LIMIT },
    { enabled: canViewActivity }
  )
  const { data: trendOrders, isLoading: loadingTrend } = useOrders(
    { limit: TREND_SAMPLE_LIMIT },
    { enabled: canViewOrders }
  )

  const orderRows = useMemo(() => recentOrders?.data ?? [], [recentOrders])
  const activityRows = useMemo(() => recentActivity?.data ?? [], [recentActivity])

  const [dateRangePreset, setDateRangePreset] = useState<DateRangePreset>('this_month')
  const rangeLabel = DATE_RANGE_PRESETS.find((p) => p.value === dateRangePreset)?.label.toLowerCase() ?? ''

  const trendRows = trendOrders?.data ?? []
  const { from, to } = useMemo(() => getDateRangeForPreset(dateRangePreset), [dateRangePreset])
  const rowsInRange = useMemo(
    () =>
      trendRows.filter((order) => {
        if (!order.createdAt) return false
        const created = new Date(order.createdAt)
        if (from && created < from) return false
        if (to && created > to) return false
        return true
      }),
    [trendRows, from, to]
  )

  const ordersTrend = useMemo(
    () => buildTrendBuckets(rowsInRange.map((o) => new Date(o.createdAt as string)), from, to),
    [rowsInRange, from, to]
  )
  const orderStatusCounts = useMemo(
    () =>
      rowsInRange.reduce<Partial<Record<OrderStatus, number>>>((acc, order) => {
        acc[order.status] = (acc[order.status] ?? 0) + 1
        return acc
      }, {}),
    [rowsInRange]
  )
  const upcomingOrders = useMemo(() => {
    const now = new Date()
    return trendRows
      .filter(
        (order) =>
          order.scheduleDate &&
          new Date(order.scheduleDate) >= now &&
          order.status !== 'CANCELLED' &&
          order.status !== 'COMPLETED'
      )
      .sort((a, b) => new Date(a.scheduleDate as string).getTime() - new Date(b.scheduleDate as string).getTime())
      .slice(0, 5)
  }, [trendRows])

  const ordersTable = useReactTable({
    data: orderRows,
    columns: dashboardOrderColumns,
    getCoreRowModel: getCoreRowModel(),
  })
  const activityTable = useReactTable({
    data: activityRows,
    columns: activityLogColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  const hasAnyWidget = canViewOrders || canViewCleaners || canViewItems || canViewActivity

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome to bEasy Admin Portal.</p>
      </div>

      {!hasAnyWidget ? (
        <p className="text-gray-500">No data to show for your current permissions.</p>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {canViewOrders && (
              <OverviewCard
                title="Total Orders"
                value={loadingOrderCount ? '—' : (allOrders?.meta.total ?? 0)}
                icon={ClipboardList}
                description="All bookings received"
                tone="blue"
              />
            )}
            {canViewOrders && (
              <OverviewCard
                title="Pending Orders"
                value={loadingPendingCount ? '—' : (pendingOrders?.meta.total ?? 0)}
                icon={Clock}
                description="Awaiting acceptance"
                tone="amber"
              />
            )}
            {canViewCleaners && (
              <OverviewCard
                title="Active Cleaners"
                value={loadingCleanerCount ? '—' : (activeCleaners?.meta.total ?? 0)}
                icon={Users}
                description="Available for assignment"
                tone="green"
              />
            )}
            {canViewItems && (
              <OverviewCard
                title="Catalog Items"
                value={loadingItemCount ? '—' : (allItems?.meta.total ?? 0)}
                icon={Package}
                description="Active service items"
                tone="purple"
              />
            )}
          </div>

          {canViewOrders && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Overview</h2>
                <DateRangeFilter value={dateRangePreset} onChange={setDateRangePreset} />
              </div>

              <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
                <div className="xl:col-span-2">
                  <OrdersTrendChart data={ordersTrend} isLoading={loadingTrend} rangeLabel={rangeLabel} />
                </div>
                <OrderStatusBreakdown counts={orderStatusCounts} isLoading={loadingTrend} />
                <UpcomingOrdersCard orders={upcomingOrders} isLoading={loadingTrend} />
              </div>
            </>
          )}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {canViewOrders && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle>Recent Orders</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <NavLink to="/order">
                      View all
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </NavLink>
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <DataTableHeader table={ordersTable} />
                    <TableBody>
                      {loadingRecentOrders && orderRows.length === 0 ? (
                        <TableRowSkeleton columns={dashboardOrderColumns} length={RECENT_LIMIT} />
                      ) : (
                        <TableRows table={ordersTable} columns={dashboardOrderColumns} />
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {canViewActivity && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <CardTitle>Recent Activity</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <NavLink to="/activity-log">
                      View all
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </NavLink>
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <DataTableHeader table={activityTable} />
                    <TableBody>
                      {loadingRecentActivity && activityRows.length === 0 ? (
                        <TableRowSkeleton columns={activityLogColumns} length={RECENT_LIMIT} />
                      ) : (
                        <TableRows table={activityTable} columns={activityLogColumns} />
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
