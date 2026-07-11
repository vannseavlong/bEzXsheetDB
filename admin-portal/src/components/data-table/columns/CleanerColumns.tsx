import type { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Pen } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import type { Cleaner } from '@/types'

interface CleanerColumnsOptions {
  onDelete?: (id: string) => void
  canUpdate?: boolean
  canDelete?: boolean
}

export const cleanerColumns = ({ onDelete, canUpdate = false, canDelete = false }: CleanerColumnsOptions = {}): ColumnDef<Cleaner>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-gray-100 border flex items-center justify-center text-xs text-gray-500 font-medium">
          {row.original.name?.charAt(0) ?? '?'}
        </div>
        <span className="font-medium text-sm">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    cell: ({ row }) => <span className="text-sm">{row.original.gender}</span>,
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.role === 'LEADER' ? 'Leader' : 'Member'}
      </span>
    ),
  },
  {
    accessorKey: 'cleanerWeeklyOffs',
    header: 'Weekly Offs',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.cleanerWeeklyOffs?.join(', ') || '-'}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    filterFn: (row, _id, value) => row.getValue('status') === value,
    cell: ({ row }) => (
      <Badge variant={row.original.status ? 'approve' : 'reject'}>
        {row.original.status ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
  {
    accessorKey: 'expertises',
    header: 'Expertise',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1 max-w-[200px]">
        {row.original.expertises?.slice(0, 2).map((e) => (
          <Badge key={e} variant="secondary" className="text-xs">
            {e}
          </Badge>
        ))}
        {(row.original.expertises?.length ?? 0) > 2 && (
          <Badge variant="outline" className="text-xs">
            +{row.original.expertises!.length - 2}
          </Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'joinedDate',
    header: 'Joined Date',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.joinedDate
          ? new Date(row.original.joinedDate).toLocaleDateString('en-GB')
          : '-'}
      </span>
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
                <NavLink to={`/cleaner/${row.original.id}`} className="flex items-center gap-2 text-blue-600">
                  <Pen className="h-3 w-3" />
                  Edit
                </NavLink>
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
      )
    },
  },
]
