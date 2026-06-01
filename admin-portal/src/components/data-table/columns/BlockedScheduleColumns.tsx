import { NavLink } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { BlockedSchedule } from '@/types'

interface BlockedScheduleColumnsOptions {
  onDelete?: (id: string) => void
}

export const blockedScheduleColumns = ({
  onDelete,
}: BlockedScheduleColumnsOptions = {}): ColumnDef<BlockedSchedule>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.original.name}</span>
    ),
  },
  {
    accessorKey: 'blockedDate',
    header: 'Date',
    cell: ({ row }) => {
      try {
        return (
          <span className="text-sm text-muted-foreground">
            {format(parseISO(row.original.blockedDate), 'dd MMM yyyy')}
          </span>
        )
      } catch {
        return <span className="text-sm text-muted-foreground">{row.original.blockedDate}</span>
      }
    },
  },
  {
    accessorKey: 'startTime',
    header: 'Start Time',
    cell: ({ row }) => (
      <span className="text-sm">{row.original.startTime}</span>
    ),
  },
  {
    accessorKey: 'endTime',
    header: 'End Time',
    cell: ({ row }) => (
      <span className="text-sm">{row.original.endTime}</span>
    ),
  },
  {
    id: 'cleaners',
    header: 'Cleaners',
    cell: ({ row }) => {
      const cleaners = row.original.cleanerDetails
      if (!cleaners?.length) return <span className="text-sm text-muted-foreground">—</span>
      const shown = cleaners.slice(0, 2).join(', ')
      const extra = cleaners.length - 2
      return (
        <span className="text-sm">
          {shown}
          {extra > 0 && <span className="text-muted-foreground"> +{extra} more</span>}
        </span>
      )
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <NavLink to={`/blocked-schedule/${row.original.id}`}>Edit</NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => onDelete?.(row.original.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
]
