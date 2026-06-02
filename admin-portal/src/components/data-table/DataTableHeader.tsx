import { flexRender, type Table } from '@tanstack/react-table'
import {
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface DataTableHeaderProps<TData> {
  table: Table<TData>
  isDraggable?: boolean
}

export function DataTableHeader<TData>({
  table,
  isDraggable = false,
}: DataTableHeaderProps<TData>) {
  return (
    <TableHeader className="sticky top-0 bg-gray-100 z-20">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {isDraggable && <TableHead className="w-12" />}
          {headerGroup.headers.map((header, idx) => {
            const meta = header.column.columnDef.meta as
              | { isSticky?: boolean; width?: number; stickyRight?: number; stickyLeft?: number; className?: string }
              | undefined

            return (
              <TableHead
                key={header.id}
                className={cn(
                  idx === 0 && !isDraggable && 'pl-4',
                  meta?.isSticky && 'sticky bg-muted top-0 z-10',
                  meta?.className,
                )}
                style={{
                  width: meta?.width || 'auto',
                  minWidth: meta?.width || '120px',
                  right: meta?.isSticky ? `${meta.stickyRight ?? 0}px` : undefined,
                  left: meta?.isSticky ? `${meta.stickyLeft ?? 0}px` : undefined,
                }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            )
          })}
        </TableRow>
      ))}
    </TableHeader>
  )
}
