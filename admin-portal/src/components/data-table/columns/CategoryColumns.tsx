import { NavLink } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { toEmbeddableImageUrl } from '@/lib/drive-image'
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
  platformLabels?: Record<string, string>
}

export const categoryColumns = ({
  onDelete,
  platformLabels,
}: CategoryColumnsOptions = {}): ColumnDef<Category>[] => [
  {
    accessorKey: 'thumbnailUrl',
    header: 'Image',
    cell: ({ row }) => (
      <Avatar className="h-9 w-9 rounded-md">
        {row.original.thumbnailUrl ? (
          <AvatarImage src={toEmbeddableImageUrl(row.original.thumbnailUrl)} alt={row.original.nameEn} />
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
    id: 'platform',
    header: 'Platform',
    cell: ({ row }) => {
      const labels = row.original.platform.map(id => platformLabels?.[id] ?? id)
      return (
        <span className="text-sm text-muted-foreground">
          {labels.length > 0 ? labels.join(', ') : '-'}
        </span>
      )
    },
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
