import { NavLink } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { Category } from '@/types'

interface CategoryColumnsOptions {
  onDelete?: (id: string) => void
}

export const categoryColumns = ({
  onDelete,
}: CategoryColumnsOptions = {}): ColumnDef<Category>[] => [
  {
    accessorKey: 'thumbnailUrl',
    header: 'Image',
    cell: ({ row }) => (
      <Avatar className="h-9 w-9 rounded-md">
        {row.original.thumbnailUrl ? (
          <AvatarImage src={row.original.thumbnailUrl} alt={row.original.nameEn} />
        ) : null}
        <AvatarFallback className="rounded-md text-xs">-</AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: 'nameEn',
    header: 'Name',
    cell: ({ row }) => (
      <NavLink
        to={`/category/${row.original.id}`}
        className="font-medium text-blue-600 hover:underline text-sm"
      >
        {row.original.nameEn}
      </NavLink>
    ),
  },
  {
    id: 'platforms',
    header: 'Platforms',
    cell: () => (
      <span className="text-sm text-muted-foreground">App, Mini App</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    filterFn: (row, id, value) => row.getValue(id) === value,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: 'date',
    header: 'Date',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        Sort #{row.original.sort}
      </span>
    ),
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
            <NavLink to={`/category/${row.original.id}`}>Edit</NavLink>
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
