import { flexRender, type Table, type ColumnDef } from '@tanstack/react-table'
import { TableCell, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface TableRowsProps<TData> {
  table: Table<TData>
  columns: ColumnDef<TData>[]
  isLoading?: boolean
}

export function TableRows<TData>({
  table,
  columns,
  isLoading = false,
}: TableRowsProps<TData>) {
  if (isLoading) {
    return (
      <>
        {Array.from({ length: 6 }).map((_, rowIdx) => (
          <TableRow key={rowIdx}>
            {Array.from({ length: columns.length }).map((_, colIdx) => (
              <TableCell key={colIdx} className={cn(colIdx === 0 && 'pl-4', 'h-12')}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </>
    )
  }

  const rows = table.getRowModel().rows

  if (rows.length === 0) {
    return (
      <TableRow>
        <TableCell
          colSpan={columns.length}
          className="h-24 text-center text-muted-foreground"
        >
          No results.
        </TableCell>
      </TableRow>
    )
  }

  return (
    <>
      {rows.map((row) => (
        <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
      ))}
    </>
  )
}
