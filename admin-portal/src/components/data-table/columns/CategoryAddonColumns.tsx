import { NavLink } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { CategoryAddon } from '@/types'

interface CategoryAddonColumnsOptions {
  onDelete?: (id: string) => void
  canUpdate?: boolean
  canDelete?: boolean
}

export const categoryAddonColumns = ({
  onDelete,
  canUpdate = false,
  canDelete = false,
}: CategoryAddonColumnsOptions = {}): ColumnDef<CategoryAddon>[] => [
    {
      accessorKey: 'nameEn',
      header: 'Name',
      cell: ({ row }) => (
        <NavLink
          to={`/category-addon/${row.original.id}`}
          className="font-medium text-blue-600 hover:underline text-sm"
        >
          {row.original.nameEn}
        </NavLink>
      ),
    },
    {
      accessorKey: 'categories',
      header: 'Categories',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1.5">
          {row.original.categories.map((cat) => (
            <Badge key={cat} variant="secondary" className="text-xs">
              {cat}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'selection_type',
      header: 'Selection Type',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.selection_type}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      filterFn: (row, id, value) => row.getValue(id) === value,
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'isRequired',
      header: 'Required',
      filterFn: (row, id, value) => row.getValue(id) === value,
      cell: ({ row }) => (
        <StatusBadge status={row.original.isRequired} label={row.original.isRequired ? 'Yes' : 'No'} />
      ),
    },
    {
      accessorKey: 'badge_en',
      header: 'Badge',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.badge_en}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        if (!canUpdate && !canDelete) return null
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canUpdate && (
                <DropdownMenuItem asChild>
                  <NavLink to={`/category-addon/${row.original.id}`}>Edit</NavLink>
                </DropdownMenuItem>
              )}
              {canDelete && (
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => onDelete?.(row.original.id)}
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
