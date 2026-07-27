import type { ColumnDef } from '@tanstack/react-table'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDateSafe } from '@/lib/utils'
import type { OrderSummary } from '@/api/orders'

export const dashboardOrderColumns: ColumnDef<OrderSummary>[] = [
  {
    accessorKey: 'customerName',
    header: 'Customer',
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{row.original.customerName}</p>
        <p className="text-xs text-muted-foreground truncate">{row.original.customerPhone}</p>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Service',
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="text-sm truncate">{row.original.category}</p>
        <p className="text-xs text-muted-foreground truncate">{row.original.serviceType}</p>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment',
    cell: ({ row }) => <StatusBadge status={row.original.paymentStatus} />,
  },
  {
    accessorKey: 'totalPayableAmount',
    header: 'Amount',
    cell: ({ row }) => (
      <span className="text-sm font-medium whitespace-nowrap">
        ${row.original.totalPayableAmount.toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {formatDateSafe(row.original.createdAt, 'dd MMM yyyy, HH:mm')}
      </span>
    ),
  },
]
