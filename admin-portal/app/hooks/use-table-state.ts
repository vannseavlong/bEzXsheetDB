import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  Updater,
  VisibilityState
} from '@tanstack/react-table';
import React from 'react';
import { useSearchParams } from 'react-router';

export default function useTableState(
  initialDateRange?: { from?: Date; to?: Date },
  defaultStatus?: string
) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [statusFilter, setStatusFilter] = React.useState<string>(defaultStatus || 'all');
  const [dateRange, setDateRange] = React.useState<{ from?: Date; to?: Date }>(
    initialDateRange || {}
  );
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const pageIndex = Number(searchParams.get('page') || 1) - 1;
  // const pageSize = Number(searchParams.get('limit') || 30);

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize: 30
    }),
    [pageIndex]
  );

  const setPagination = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      const newPagination =
        typeof updaterOrValue === 'function'
          ? updaterOrValue({ pageIndex, pageSize: 30 })
          : updaterOrValue;

      setSearchParams((prev) => {
        prev.set('page', String(newPagination.pageIndex + 1));
        // prev.set('limit', String(newPagination.pageSize));
        return prev;
      });
    },
    [pageIndex, setSearchParams]
  );

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
    dateRange,
    setDateRange,
    isCalendarOpen,
    setIsCalendarOpen,
    pagination,
    setPagination
  };
}
