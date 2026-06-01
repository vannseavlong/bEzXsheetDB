import { flexRender, type Table, type ColumnDef } from '@tanstack/react-table'
import { TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

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
      <TableBody>
        {Array.from({ length: 6 }).map((_, rowIdx) => (
          <TableRow key={rowIdx} className="h-12">
            {Array.from({ length: columns.length }).map((_, colIdx) => (
              <TableCell key={colIdx}>
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
            colSpan={columns.length}
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
        <TableRow key={row.id} className="h-12">
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  )
}
