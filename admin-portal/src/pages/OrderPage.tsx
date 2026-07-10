import { useNavigate, useSearchParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useTableState } from '@/hooks/use-table-state'
import { useOrders } from '@/api/orders'
import { OrderList } from '@/pages/order/OrderList'
import { OrderDetail } from '@/pages/order/OrderDetail'

export default function OrderPage() {
  const navigate = useNavigate()
  const {
    statusFilter, setStatusFilter,
    search, setSearch,
    dateRange, setDateRange,
    pagination, setPagination,
  } = useTableState()

  const [searchParams, setSearchParams] = useSearchParams()
  const selectedId = searchParams.get('bulkOrderId') ?? ''

  const setSelectedId = (bulkOrderId: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (bulkOrderId) next.set('bulkOrderId', bulkOrderId)
      else next.delete('bulkOrderId')
      return next
    }, { replace: true })
  }

  const { data: result, isLoading } = useOrders({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search,
    status: statusFilter === 'all' ? undefined : statusFilter,
    dateFrom: dateRange.from ? dateRange.from.toISOString() : undefined,
    dateTo: dateRange.to ? dateRange.to.toISOString() : undefined,
  })

  const orders = result?.data ?? []

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div
        className={cn(
          'w-full md:w-[380px] border-r flex-col h-full shrink-0',
          selectedId ? 'hidden md:flex' : 'flex'
        )}
      >
        <div className="flex items-center gap-3 h-16 px-4 border-b shrink-0">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold">Order Management</h1>
        </div>
        <OrderList
          orders={orders}
          isLoading={isLoading}
          selectedId={selectedId}
          onSelect={setSelectedId}
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          page={pagination.pageIndex + 1}
          totalPages={result?.meta.totalPages ?? 1}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, pageIndex: page - 1 }))}
        />
      </div>

      <div className={cn('flex-1 min-w-0 flex-col h-full', selectedId ? 'flex' : 'hidden md:flex')}>
        <OrderDetail bulkOrderId={selectedId} onBack={() => setSelectedId('')} />
      </div>
    </div>
  )
}
