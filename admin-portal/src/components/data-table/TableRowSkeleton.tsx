import type { ColumnDef } from '@tanstack/react-table'
import { TableCell, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface TableRowSkeletonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<any>[]
  length?: number
}

export function TableRowSkeleton({ columns, length = 5 }: TableRowSkeletonProps) {
  return (
    <>
      {Array.from({ length }).map((_, rowIdx) => (
        <TableRow key={rowIdx}>
          {Array.from({ length: columns.length }).map((_, colIdx) => (
            <TableCell key={colIdx} className={cn(colIdx === 0 && 'pl-4', 'h-12 py-0')}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}
