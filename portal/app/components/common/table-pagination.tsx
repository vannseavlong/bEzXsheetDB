import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext
} from '@/components/ui/pagination';
import type { Table } from '@tanstack/react-table';

type Props<TData> = {
  table: Table<TData>;
};

export default function TablePagination<TData>({ table }: Props<TData>) {
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;

  return (
    <div className="py-1">
      {/* <div className="text-muted-foreground flex-1 text-sm">
        {table.getFilteredSelectedRowModel().rows.length} of {table.getRowModel().rows.length}{' '}
        row(s) selected.
      </div> */}

      <Pagination className="w-full">
        <PaginationContent className="w-full flex justify-end items-center">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                table.previousPage();
              }}
              className={!table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>

          {/* Page numbers with ellipses */}
          {getPageNumbers(currentPage, pageCount).map((page, idx) =>
            page === '...' ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <span className="px-2">...</span>
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  className="size-7"
                  aria-current={page === currentPage ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    table.setPageIndex(page);
                  }}
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          {/* Next button */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                table.nextPage();
              }}
              className={!table.getCanNextPage() ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

const getPageNumbers = (current: number, total: number, delta = 1) => {
  const pages: (number | '...')[] = [];
  const range = [];

  for (let i = Math.max(0, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i);
  }

  if (range[0] > 0) {
    pages.push(0);
    if (range[0] > 1) pages.push('...');
  }

  pages.push(...range);

  if (range[range.length - 1] < total - 1) {
    if (range[range.length - 1] < total - 2) pages.push('...');
    pages.push(total - 1);
  }

  return pages;
};
