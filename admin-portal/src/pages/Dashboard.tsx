import { useMemo } from 'react'
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
import { dashboardOrderColumns } from '@/components/data-table/columns/DashboardOrderColumns'
import { activityLogColumns } from '@/components/data-table/columns/ActivityLogColumns'
import { useOrders } from '@/api/orders'
import { useCleaners } from '@/api/cleaners'
import { useItems } from '@/api/items'
import { useActivityLogs } from '@/api/activity-log'
import { usePermission } from '@/hooks/use-permission'
import { ACTIONS, MODULES } from '@/lib/permission-registry'

const RECENT_LIMIT = 5

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

  const orderRows = useMemo(() => recentOrders?.data ?? [], [recentOrders])
  const activityRows = useMemo(() => recentActivity?.data ?? [], [recentActivity])

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
              />
            )}
            {canViewOrders && (
              <OverviewCard
                title="Pending Orders"
                value={loadingPendingCount ? '—' : (pendingOrders?.meta.total ?? 0)}
                icon={Clock}
                description="Awaiting acceptance"
              />
            )}
            {canViewCleaners && (
              <OverviewCard
                title="Active Cleaners"
                value={loadingCleanerCount ? '—' : (activeCleaners?.meta.total ?? 0)}
                icon={Users}
                description="Available for assignment"
              />
            )}
            {canViewItems && (
              <OverviewCard
                title="Catalog Items"
                value={loadingItemCount ? '—' : (allItems?.meta.total ?? 0)}
                icon={Package}
                description="Active service items"
              />
            )}
          </div>

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
