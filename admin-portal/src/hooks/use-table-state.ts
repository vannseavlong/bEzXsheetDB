import { useState } from 'react'
import type {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  PaginationState,
} from '@tanstack/react-table'

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

export function useTableState(): TableStateReturn {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [statusFilter, setStatusFilterRaw] = useState<string>('all')
  const [search, setSearchRaw] = useState<string>('')
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null })
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  })

  // Changing a filter mid-pagination should jump back to page 1 — otherwise a
  // narrower result set can leave the table on a page that no longer exists.
  const setStatusFilter: TableStateReturn['setStatusFilter'] = (value) => {
    setPagination((p) => ({ ...p, pageIndex: 0 }))
    setStatusFilterRaw(value)
  }
  const setSearch: TableStateReturn['setSearch'] = (value) => {
    setPagination((p) => ({ ...p, pageIndex: 0 }))
    setSearchRaw(value)
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
