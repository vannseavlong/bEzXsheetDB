import * as React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import useTableState from '@/hooks/use-table-state';
import TablePagination from '@/components/common/table-pagination';
import TableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import TopupHeader from '@/components/data-table/top-up-header';
import { topupColumns } from '@/components/data-table/topup-columns';
import useTopUpQuery from '@/hooks/query/use-topup-query';
import useDataTableApi from '@/hooks/use-data-table-api';
import { ACTIONS, MODULES } from '@/lib/permission';

export const handle = {
  module: MODULES.FINANCE_TOPUP,
  action: ACTIONS.VIEW
};

export default function Topup() {
  const initialDateRange = {
    // from: moment().startOf('month').toDate(),
    // to: moment().toDate()
    from: undefined,
    to: undefined
  };
  const [searchValue, setSearchValue] = React.useState('');
  const tableState = useTableState(initialDateRange);
  const { dateRange, setDateRange, isCalendarOpen, setIsCalendarOpen, pagination } = tableState;
  const { data, isPending } = useTopUpQuery({
    currentPage: pagination.pageIndex,
    type: 'TOPUP',
    searchText: searchValue,
    dateRange
  });
  const table = useDataTableApi({
    data: data?.data ?? [],
    columns: topupColumns,
    tableState,
    pageCount: data?.pagination.totalPages ?? 1
  });

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <TopupHeader
          dateRange={dateRange}
          setDateRange={setDateRange}
          isCalendarOpen={isCalendarOpen}
          setIsCalendarOpen={setIsCalendarOpen}
          initialDateRange={initialDateRange}
          search={searchValue}
          setSearch={setSearchValue}
        />
        <div className="flex min-h-0 overflow-hidden">
          <Table className="min-w-full">
            <TableHeader table={table} />
            <TableBody>
              <TableRows isLoading={isPending} columns={topupColumns} table={table} />
            </TableBody>
          </Table>
        </div>
      </div>
      <TablePagination table={table} />
    </div>
  );
}
