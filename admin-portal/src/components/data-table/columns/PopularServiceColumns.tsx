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
import type { PopularService } from '@/types'

interface PopularServiceColumnsOptions {
  onDelete?: (id: string) => void
}

export const popularServiceColumns = ({
  onDelete,
}: PopularServiceColumnsOptions = {}): ColumnDef<PopularService>[] => [
  {
    accessorKey: 'imageUrl',
    header: 'Image',
    cell: ({ row }) => (
      <Avatar className="h-9 w-9 rounded-md">
        {row.original.imageUrl ? (
          <AvatarImage src={row.original.imageUrl} alt={row.original.nameEn} />
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
        to={`/popular-service/${row.original.id}`}
        className="font-medium text-blue-600 hover:underline text-sm"
      >
        {row.original.nameEn}
      </NavLink>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    filterFn: (row, id, value) => row.getValue(id) === value,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: 'displayOrder',
    header: 'Order',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.displayOrder}</span>
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
            <NavLink to={`/popular-service/${row.original.id}`}>Edit</NavLink>
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
