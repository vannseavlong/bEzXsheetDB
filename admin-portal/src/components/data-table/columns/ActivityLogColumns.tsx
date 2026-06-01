import { format, parseISO } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { ActivityLog } from '@/types'

const METHOD_VARIANTS: Record<string, 'success' | 'info' | 'warning' | 'destructive'> = {
  GET: 'success',
  POST: 'info',
  PUT: 'warning',
  PATCH: 'warning',
  DELETE: 'destructive',
}

export const activityLogColumns: ColumnDef<ActivityLog>[] = [
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'Date / Time',
    cell: ({ row }) => {
      try {
        return (
          <span className="text-sm whitespace-nowrap">
            {format(parseISO(row.original.createdAt), 'dd MMM yyyy, HH:mm')}
          </span>
        )
      } catch {
        return <span className="text-sm">{row.original.createdAt}</span>
      }
    },
  },
  {
    accessorKey: 'user',
    header: 'User',
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.user.username}
      </span>
    ),
  },
  {
    accessorKey: 'reqMethod',
    header: 'Action',
    cell: ({ row }) => {
      const method = row.original.reqMethod
      return (
        <Badge variant={(METHOD_VARIANTS[method] ?? 'default') as any} className="text-xs font-mono">
          {method}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'module',
    header: 'Module',
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.original.module}</span>
    ),
  },
  {
    accessorKey: 'detail',
    header: 'Detail',
    cell: ({ row }) => {
      const detail = row.original.detail
      const truncated = detail.length > 60 ? detail.slice(0, 60) + '…' : detail
      if (detail.length <= 60) {
        return <span className="text-sm text-muted-foreground">{detail}</span>
      }
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm text-muted-foreground cursor-default">{truncated}</span>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-xs">{detail}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
  },
]
