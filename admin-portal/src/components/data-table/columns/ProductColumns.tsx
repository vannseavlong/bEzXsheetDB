import { NavLink } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { mockCategories } from '@/data/categories'
import type { Product } from '@/types'

// Build category lookup map
const categoryMap: Record<string, string> = {}
;(mockCategories as Array<{ id: string; nameEn: string }>).forEach((c) => {
  categoryMap[c.id] = c.nameEn
})

interface ProductColumnsOptions {
  onDelete?: (id: string) => void
}

export const productColumns = ({
  onDelete,
}: ProductColumnsOptions = {}): ColumnDef<Product>[] => [
  {
    accessorKey: 'nameEn',
    header: 'Name',
    cell: ({ row }) => (
      <NavLink
        to={`/product/${row.original.id}`}
        className="font-medium text-blue-600 hover:underline text-sm"
      >
        {row.original.nameEn}
      </NavLink>
    ),
  },
  {
    id: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {categoryMap[row.original.categoryId] ?? row.original.categoryId}
      </span>
    ),
  },
  {
    accessorKey: 'basePrice',
    header: 'Price',
    cell: ({ row }) => (
      <span className="text-sm font-medium">${row.original.basePrice.toFixed(2)}</span>
    ),
  },
  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.duration} {row.original.duration === 1 ? 'hr' : 'hrs'}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    filterFn: (row, id, value) => row.getValue(id) === value,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <NavLink to={`/product/${row.original.id}`}>Edit</NavLink>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600"
            onClick={() => onDelete?.(row.original.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]
