import type { Table } from '@tanstack/react-table'
import { PaginationBar } from '@/components/shared/PaginationBar'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1
  const totalPages = table.getPageCount()

  return (
    <PaginationBar
      page={currentPage}
      totalPages={totalPages}
      onPageChange={(page) => table.setPageIndex(page - 1)}
    />
  )
}
