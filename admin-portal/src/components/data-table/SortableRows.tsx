import { flexRender, type Table, type ColumnDef } from '@tanstack/react-table'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SortableRowsProps<TData extends { id: string }> {
  table: Table<TData>
  columns: ColumnDef<TData>[]
  isLoading?: boolean
}

interface SortableRowProps<TData extends { id: string }> {
  row: ReturnType<Table<TData>['getRowModel']>['rows'][number]
}

function SortableRow<TData extends { id: string }>({ row }: SortableRowProps<TData>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: row.original.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <TableRow ref={setNodeRef} style={style} data-state={row.getIsSelected() && 'selected'}>
      <TableCell className="w-12 h-12 py-0 px-2">
        <Button
          variant="ghost"
          size="sm"
          className="cursor-grab p-1 h-auto"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </Button>
      </TableCell>
      {row.getVisibleCells().map((cell, idx) => {
        const meta = cell.column.columnDef.meta as
          | { isSticky?: boolean; width?: number; stickyRight?: number; stickyLeft?: number; className?: string }
          | undefined

        return (
          <TableCell
            key={cell.id}
            className={cn(
              idx === 0 && 'pl-4',
              'h-12 py-0',
              meta?.isSticky && 'sticky z-[1] bg-background',
              meta?.className,
            )}
            style={{
              width: meta?.width || 'auto',
              minWidth: meta?.width || 'auto',
              right: meta?.isSticky ? `${meta.stickyRight ?? 0}px` : undefined,
              left: meta?.isSticky ? `${meta.stickyLeft ?? 0}px` : undefined,
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

export function SortableRows<TData extends { id: string }>({
  table,
  columns,
  isLoading = false,
}: SortableRowsProps<TData>) {
  if (isLoading) {
    return (
      <TableBody>
        {Array.from({ length: 6 }).map((_, rowIdx) => (
          <TableRow key={rowIdx}>
            <TableCell className="w-12 h-12 py-0 px-2">
              <Skeleton className="h-4 w-6" />
            </TableCell>
            {Array.from({ length: columns.length }).map((_, colIdx) => (
              <TableCell key={colIdx} className={cn(colIdx === 0 && 'pl-4', 'h-12 py-0')}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    )
  }

  const rows = table.getRowModel().rows

  if (rows.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell
            colSpan={columns.length + 1}
            className="h-24 text-center text-muted-foreground"
          >
            No results.
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {rows.map((row) => (
        <SortableRow key={row.id} row={row} />
      ))}
    </TableBody>
  )
}
