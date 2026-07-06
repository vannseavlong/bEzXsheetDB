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
import type { DbAdminUser } from '@/api/users'

interface UserColumnsOptions {
  onEdit?: (user: DbAdminUser) => void
  onToggleStatus?: (user: DbAdminUser) => void
}

export const userColumns = ({ onEdit, onToggleStatus }: UserColumnsOptions = {}): ColumnDef<DbAdminUser>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    filterFn: (row, _id, value) => {
      const q = String(value).toLowerCase()
      return (
        row.original.name.toLowerCase().includes(q) ||
        row.original.email.toLowerCase().includes(q)
      )
    },
    cell: ({ row }) => <p className="font-medium text-sm">{row.original.name}</p>,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <p className="text-sm text-muted-foreground">{row.original.email}</p>,
  },
  {
    accessorKey: 'role_id',
    header: 'Role',
    cell: ({ row }) => (
      <span className="text-sm">{row.original.role_name ?? 'Unknown'}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    filterFn: (row, id, value) => row.getValue(id) === value,
    cell: ({ row }) => <StatusBadge status={row.original.status === 'active'} />,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const user = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(user)}>Edit</DropdownMenuItem>
            <DropdownMenuItem
              className={user.status === 'active' ? 'text-red-600' : 'text-green-600'}
              onClick={() => onToggleStatus?.(user)}
            >
              {user.status === 'active' ? 'Deactivate' : 'Activate'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
