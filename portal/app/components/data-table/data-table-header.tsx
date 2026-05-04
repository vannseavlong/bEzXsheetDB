import { flexRender, type useReactTable } from '@tanstack/react-table';
import { TableHead, TableHeader as TableHeaderComponent, TableRow } from '../ui/table';
import clsx from 'clsx';

type Props<T> = {
  table: ReturnType<typeof useReactTable<T>>;
  isDraggable?: boolean;
};

export default function DataTableHeader<T>({ table, isDraggable }: Props<T>) {
  // const rows = table.getRowModel().rows;
  // if (!rows?.length) return null;
  return (
    <TableHeaderComponent className="sticky top-0 bg-gray-100 z-20">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {isDraggable && <TableHead className="w-12" />}
          {headerGroup.headers.map((header, idx) => {
            const isSticky = header.column.columnDef.meta?.isSticky;
            const className = header.column?.columnDef?.meta?.className;

            return (
              <TableHead
                key={header.id}
                className={clsx(
                  idx === 0 && 'pl-4',
                  isSticky ? 'sticky bg-muted top-0 z-10' : '',
                  className
                )}
                style={{
                  width: header.column.columnDef.meta?.width || 'auto',
                  minWidth: header.column.columnDef.meta?.width || '120px',
                  right: isSticky ? `${header.column.columnDef.meta?.stickyRight}px` : 'auto',
                  left: isSticky ? `${header.column.columnDef.meta?.stickyLeft}px` : 'auto'
                }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeaderComponent>
  );
}
