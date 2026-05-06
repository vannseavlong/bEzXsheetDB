import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableCell, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Grip } from 'lucide-react';
import { flexRender, useReactTable, type ColumnDef, type Row } from '@tanstack/react-table';
import TableRowSkeleton from './table-row-skeleton';

type Props<T> = {
  table: ReturnType<typeof useReactTable<T>>;
  columns: ColumnDef<T>[];
  isLoading?: boolean;
};

export default function SortableRows<T extends { id: string | number }>({
  table,
  columns,
  isLoading
}: Props<T>) {
  if (isLoading) return <TableRowSkeleton columns={columns} />;

  return table.getRowModel().rows?.length ? (
    table.getRowModel().rows.map((row) => <Item key={row.original.id} row={row} />)
  ) : (
    <TableRow>
      <TableCell colSpan={columns.length + 1} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  );
}

function Item<T extends { id: string | number }>({ row }: { row: Row<T> }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.original.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <TableRow ref={setNodeRef} style={style} className={isDragging ? 'relative z-50' : ''}>
      <TableCell className="w-12">
        <Button
          variant="ghost"
          size="sm"
          className="cursor-grab active:cursor-grabbing p-1 h-8 w-8"
          {...attributes}
          {...listeners}
        >
          <Grip className="h-4 w-4" />
        </Button>
      </TableCell>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
