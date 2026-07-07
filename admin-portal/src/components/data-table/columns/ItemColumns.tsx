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
import type { Item } from '@/types'

interface ItemColumnsOptions {
  onDelete?: (id: string) => void
  canUpdate?: boolean
  canDelete?: boolean
}

export const itemColumns = ({
  onDelete,
  canUpdate = false,
  canDelete = false,
}: ItemColumnsOptions = {}): ColumnDef<Item>[] => [
  {
    accessorKey: 'nameEn',
    header: 'Name',
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.original.nameEn}</span>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.category}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    filterFn: (row, id, value) => row.getValue(id) === value,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'sortOrder',
    header: 'Sort Order',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.sortOrder}</span>
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      if (!canUpdate && !canDelete) return null
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canUpdate && (
                <DropdownMenuItem asChild>
                  <NavLink to={`/item/${row.original.id}`}>Edit</NavLink>
                </DropdownMenuItem>
              )}
              {canDelete && (
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => onDelete?.(row.original.id)}
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
