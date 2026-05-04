import type { ColumnDef } from '@tanstack/react-table';
import { Skeleton } from '../ui/skeleton';
import { TableCell, TableRow } from '../ui/table';

type Props<T> = {
  columns: ColumnDef<T>[];
  length?: number;
};
export default function TableRowSkeleton<T>({ columns, length = 4 }: Props<T>) {
  return Array.from({ length }).map((_, index) => (
    <TableRow key={index}>
      {columns.map((_, colIndex) => (
        <TableCell key={colIndex} className="py-4">
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));
}
