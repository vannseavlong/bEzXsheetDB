import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface PaginationBarProps {
  /** 1-indexed current page */
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

function getPageNumbers(current: number, total: number, delta = 1): (number | '...')[] {
  const pages: (number | '...')[] = []
  const range: number[] = []

  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    range.push(i)
  }

  if (range[0] > 1) {
    pages.push(1)
    if (range[0] > 2) pages.push('...')
  }

  pages.push(...range)

  if (range[range.length - 1] < total) {
    if (range[range.length - 1] < total - 1) pages.push('...')
    pages.push(total)
  }

  return pages
}

export function PaginationBar({ page, totalPages, onPageChange }: PaginationBarProps) {
  if (totalPages <= 1) return null

  const pageNumbers = getPageNumbers(page, totalPages)

  return (
    <div className="py-1">
      <Pagination className="w-full">
        <PaginationContent className="w-full flex justify-end items-center">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => { e.preventDefault(); if (page > 1) onPageChange(page - 1) }}
              className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>

          {pageNumbers.map((p, idx) =>
            p === '...' ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <span className="px-2 text-muted-foreground">...</span>
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  isActive={p === page}
                  className="size-7"
                  aria-current={p === page ? 'page' : undefined}
                  onClick={(e) => { e.preventDefault(); onPageChange(p) }}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => { e.preventDefault(); if (page < totalPages) onPageChange(page + 1) }}
              className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
