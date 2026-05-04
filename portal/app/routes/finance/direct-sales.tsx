import * as React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import useTableState from '@/hooks/use-table-state';
import TablePagination from '@/components/common/table-pagination';
// import useDataTableConfig from '@/hooks/use-data-table-config';
import TableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import useListDirectSaleQuery from '@/hooks/query/use-list-direct-sale-query';
import { directColumns } from '@/components/data-table/direct-sale-columns';
import DirectSaleHeader from '@/components/data-table/direct-sale-header';

import { ACTIONS, MODULES } from '@/lib/permission';
import useDataTableApi from '@/hooks/use-data-table-api';

export const handle = {
  module: MODULES.FINANCE_DIRECT_SALES,
  action: ACTIONS.VIEW
};

export default function DirectSales() {
  const initialDateRange = {
    // from: moment().startOf('month').toDate(),
    // to: moment().toDate()
    from: undefined,
    to: undefined
  };
  const tableState = useTableState(initialDateRange);
  const {
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    isCalendarOpen,
    setIsCalendarOpen,
    pagination
  } = tableState;
  const [searchValue, setSearchValue] = React.useState('');

  const { data, isPending } = useListDirectSaleQuery({
    statusFilter: 'all',
    paymentStatusFilter: undefined,
    currentPage: pagination.pageIndex,
    searchText: searchValue,
    dateRange
  });

  const table = useDataTableApi({
    data: data?.data ?? [],
    columns: directColumns,
    tableState,
    pageCount: data?.pagination.totalPages ?? 1
  });

  // const table = useDataTableConfig(data?.data ?? [], directColumns, tableState);

  // Optimized status filter effect with debouncing
  // React.useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     const statusColumn = table.getColumn('status');
  //     if (statusColumn) {
  //       statusColumn.setFilterValue(statusFilter === 'all' ? undefined : statusFilter);
  //     }
  //   }, 100); // Small debounce to prevent excessive filtering

  //   return () => clearTimeout(timeoutId);
  // }, [statusFilter, table]);

  const props = {
    table,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    isCalendarOpen,
    setIsCalendarOpen,
    initialDateRange
  };

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <DirectSaleHeader search={searchValue} setSearch={setSearchValue} {...props} />
        <div className="flex min-h-0 overflow-hidden">
          <Table className="min-w-full">
            <TableHeader table={table} />
            <TableBody>
              <TableRows isLoading={isPending} columns={directColumns} table={table} />
            </TableBody>
          </Table>
        </div>
      </div>
      <TablePagination table={table} />
    </div>
  );
}
