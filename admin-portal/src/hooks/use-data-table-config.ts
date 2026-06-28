import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type TableOptions,
} from '@tanstack/react-table'
import type { TableStateReturn } from './use-table-state'

export interface ServerListOptions {
  /** Total page count reported by the backend (`meta.totalPages`). Switches the table to manual pagination/filtering. */
  pageCount: number
}

export function useDataTableConfig<TData>(
  data: TData[],
  columns: ColumnDef<TData>[],
  tableState: TableStateReturn,
  server?: ServerListOptions
) {
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
    setPagination,
  } = tableState

  const isManual = !!server

  const options: TableOptions<TData> = {
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: isManual ? undefined : getFilteredRowModel(),
    getPaginationRowModel: isManual ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: isManual,
    manualFiltering: isManual,
    pageCount: isManual ? server.pageCount : Math.ceil(data.length / pagination.pageSize),
  }

  return useReactTable(options)
}
