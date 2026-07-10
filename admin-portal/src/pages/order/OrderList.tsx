import { PackageSearch } from 'lucide-react'
import { SearchBar } from '@/components/shared/SearchBar'
import { DateRangePicker } from '@/components/shared/DateRangePicker'
import { EmptyState } from '@/components/shared/EmptyState'
import { PaginationBar } from '@/components/shared/PaginationBar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { DateRange } from '@/hooks/use-table-state'
import type { OrderSummary } from '@/api/orders'
import { OrderCard } from './OrderCard'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

interface Props {
  orders: OrderSummary[]
  isLoading: boolean
  selectedId: string
  onSelect: (bulkOrderId: string) => void
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function OrderList({
  orders,
  isLoading,
  selectedId,
  onSelect,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateRange,
  onDateRangeChange,
  page,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex flex-col gap-2 p-3 border-b shrink-0">
        <SearchBar
          placeholder="Search by name, phone or order id…"
          value={search}
          onChange={onSearchChange}
        />
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="h-9 flex-1">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DateRangePicker
            from={dateRange.from}
            to={dateRange.to}
            onChange={(range) => onDateRangeChange(range)}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-1">
        {isLoading ? (
          Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="h-11 w-11 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : orders.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No orders found"
            description="Try adjusting your search or filters."
          />
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.bulkOrderId}
              order={order}
              isActive={order.bulkOrderId === selectedId}
              onClick={() => onSelect(order.bulkOrderId)}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="border-t shrink-0 px-3">
          <PaginationBar page={page} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  )
}
