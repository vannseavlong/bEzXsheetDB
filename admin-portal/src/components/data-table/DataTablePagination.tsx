import type { Table } from '@tanstack/react-table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

function getPageNumbers(current: number, total: number, delta = 1): (number | '...')[] {
  const pages: (number | '...')[] = []
  const range: number[] = []

  for (let i = Math.max(0, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }

  if (range[0] > 0) {
    pages.push(0)
    if (range[0] > 1) pages.push('...')
  }

  pages.push(...range)

  if (range[range.length - 1] < total - 1) {
    if (range[range.length - 1] < total - 2) pages.push('...')
    pages.push(total - 1)
  }

  return pages
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex
  const totalPages = table.getPageCount()

  if (totalPages <= 1) return null

  const pageNumbers = getPageNumbers(currentPage, totalPages)

  return (
    <div className="py-1">
      <Pagination className="w-full">
        <PaginationContent className="w-full flex justify-end items-center">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => { e.preventDefault(); table.previousPage() }}
              className={!table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>

          {pageNumbers.map((page, idx) =>
            page === '...' ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <span className="px-2 text-muted-foreground">...</span>
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  className="size-7"
                  aria-current={page === currentPage ? 'page' : undefined}
                  onClick={(e) => { e.preventDefault(); table.setPageIndex(page) }}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => { e.preventDefault(); table.nextPage() }}
              className={!table.getCanNextPage() ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
