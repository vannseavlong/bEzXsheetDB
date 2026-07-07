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
import type { ProductOption } from '@/types'

const TYPE_LABELS: Record<string, string> = {
  SINGLE_CHOICE: 'Single Choice',
  MULTI_CHOICE: 'Multi Choice',
  TOGGLE: 'Toggle',
}

const TYPE_VARIANTS: Record<string, 'confirm' | 'purple' | 'secondary'> = {
  SINGLE_CHOICE: 'confirm',
  MULTI_CHOICE: 'purple',
  TOGGLE: 'secondary',
}

interface ProductOptionColumnsOptions {
  onDelete?: (id: string) => void
  canUpdate?: boolean
  canDelete?: boolean
}

export const productOptionColumns = ({
  onDelete,
  canUpdate = false,
  canDelete = false,
}: ProductOptionColumnsOptions = {}): ColumnDef<ProductOption>[] => [
    {
      accessorKey: 'nameEn',
      header: 'Name',
      cell: ({ row }) => (
        <span className="text-sm font-medium">{row.original.nameEn}</span>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        const type = row.original.type
        return (
          <Badge variant={(TYPE_VARIANTS[type] ?? 'default') as any}>
            {TYPE_LABELS[type] ?? type}
          </Badge>
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
                    <NavLink to={`/product-option/${row.original.id}`}>Edit</NavLink>
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
