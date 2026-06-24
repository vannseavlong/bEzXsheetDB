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

const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  operation: 'Operation',
  finance: 'Finance',
  marketing: 'Marketing',
}

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
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-sm">{row.original.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <span className="text-sm">{ROLE_LABELS[row.original.role] ?? row.original.role}</span>
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
