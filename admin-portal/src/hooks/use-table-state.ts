import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  PaginationState,
  Updater,
} from '@tanstack/react-table'

const DEFAULT_PAGE_SIZE = 20

function resolveUpdater<T>(updater: Updater<T>, prev: T): T {
  return typeof updater === 'function' ? (updater as (prev: T) => T)(prev) : updater
}

export type DateRange = { from: Date | null; to: Date | null }

export interface TableStateReturn {
  sorting: SortingState
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>
  columnFilters: ColumnFiltersState
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
  columnVisibility: VisibilityState
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>
  rowSelection: RowSelectionState
  setRowSelection: React.Dispatch<React.SetStateAction<RowSelectionState>>
  statusFilter: string
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
  dateRange: DateRange
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>
  isCalendarOpen: boolean
  setIsCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>
  pagination: PaginationState
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
}

/**
 * statusFilter/search/pagination live in the URL (not useState) so that navigating to a
 * detail page and back restores the exact page/filter the user left — each list page
 * already owns its own route, so the query params never collide across pages.
 */
export function useTableState(): TableStateReturn {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null })
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false)

  const [searchParams, setSearchParams] = useSearchParams()

  const statusFilter = searchParams.get('status') ?? 'all'
  const search = searchParams.get('search') ?? ''
  const pagination: PaginationState = {
    pageIndex: Math.max(0, (parseInt(searchParams.get('page') ?? '1', 10) || 1) - 1),
    pageSize: parseInt(searchParams.get('pageSize') ?? '', 10) || DEFAULT_PAGE_SIZE,
  }

  function patchParams(patch: Record<string, string | undefined>) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      for (const [key, value] of Object.entries(patch)) {
        if (value === undefined) next.delete(key)
        else next.set(key, value)
      }
      return next
    }, { replace: true })
  }

  // Changing a filter mid-pagination should jump back to page 1 — otherwise a
  // narrower result set can leave the table on a page that no longer exists.
  const setStatusFilter: TableStateReturn['setStatusFilter'] = (updater) => {
    const next = resolveUpdater(updater, statusFilter)
    patchParams({ status: next === 'all' ? undefined : next, page: undefined })
  }
  const setSearch: TableStateReturn['setSearch'] = (updater) => {
    const next = resolveUpdater(updater, search)
    patchParams({ search: next || undefined, page: undefined })
  }
  const setPagination: TableStateReturn['setPagination'] = (updater) => {
    const next = resolveUpdater(updater, pagination)
    patchParams({
      page: next.pageIndex === 0 ? undefined : String(next.pageIndex + 1),
      pageSize: next.pageSize === DEFAULT_PAGE_SIZE ? undefined : String(next.pageSize),
    })
  }

  return {
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    dateRange,
    setDateRange,
    isCalendarOpen,
    setIsCalendarOpen,
    pagination,
    setPagination,
  }
}
