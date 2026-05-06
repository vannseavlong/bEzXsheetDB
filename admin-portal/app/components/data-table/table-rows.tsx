import { flexRender, type ColumnDef, type useReactTable } from '@tanstack/react-table';
import { TableCell, TableRow } from '../ui/table';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import TableRowSkeleton from './table-row-skeleton';

type Props<T> = {
  table: ReturnType<typeof useReactTable<T>>;
  columns: ColumnDef<T>[];
  isLoading?: boolean;
};

export default function TableRows<T>({ table, columns, isLoading }: Props<T>) {
  const { t } = useTranslation();

  const rows = table.getRowModel().rows;

  if (isLoading) return <TableRowSkeleton columns={columns} />;

  if (!rows?.length) {
    return (
      <TableRow>
        <TableCell colSpan={columns.length} className="h-24 text-center">
          {t('noResults')}
        </TableCell>
      </TableRow>
    );
  }
  return (
    <>
      {rows.map((row) => (
        <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
          {row.getVisibleCells().map((cell, idx) => {
            const isSticky = cell.column.columnDef.meta?.isSticky;
            const className = cell.column.columnDef.meta?.className;
            return (
              <TableCell
                key={cell.id}
                className={clsx(
                  idx === 0 && 'pl-4',
                  'h-12',
                  isSticky ? 'sticky z-1 bg-background' : '',
                  className
                )}
                style={{
                  width: cell.column.columnDef.meta?.width || 'auto',
                  minWidth: cell.column.columnDef.meta?.width || 'auto',
                  right: isSticky ? `${cell.column.columnDef.meta?.stickyRight}px` : 'auto',
                  left: isSticky ? `${cell.column.columnDef.meta?.stickyLeft}px` : 'auto'
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </>
  );
}
