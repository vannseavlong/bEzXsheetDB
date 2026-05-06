import type useTableState from './use-table-state';
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef
} from '@tanstack/react-table';

export default function useDataTableApi<T>({
  data,
  columns,
  tableState,
  pageCount = 1
}: {
  data: T[];
  columns: ColumnDef<T>[];
  tableState: ReturnType<typeof useTableState>;
  pageCount?: number;
}) {
  const {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    pagination,
    setPagination
  } = tableState;

  const table = useReactTable<T>({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination
    },
    initialState: {
      pagination
    },
    manualPagination: true,
    manualSorting: true,
    pageCount,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination
  });

  return table;
}
