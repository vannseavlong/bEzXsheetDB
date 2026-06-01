import type { ColumnDef } from '@tanstack/react-table'
import { TableBody, TableCell, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

interface TableRowSkeletonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<any>[]
}

export function TableRowSkeleton({ columns }: TableRowSkeletonProps) {
  return (
    <TableBody>
      {Array.from({ length: 5 }).map((_, rowIdx) => (
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
