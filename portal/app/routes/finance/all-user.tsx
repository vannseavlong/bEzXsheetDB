import { Table, TableBody } from '@/components/ui/table';
import useTableState from '@/hooks/use-table-state';
import TablePagination from '@/components/common/table-pagination';
import TableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import useDataTableApi from '@/hooks/use-data-table-api';
import { useState } from 'react';
import { ACTIONS, MODULES } from '@/lib/permission';
import { initialDateRange } from '@/constants/constants';
import useCustomerQuery from '@/hooks/query/use-customer-query';
import { allUserColumns } from '@/components/data-table/all-user-column';
import AllUserHeader from '@/components/data-table/all-user-header';

export const handle = {
  module: MODULES.MARKETING_CUSTOMER,
  action: ACTIONS.VIEW
};

export default function AllUser() {
  const [searchValue, setSearchValue] = useState<string>('');
  const tableState = useTableState(initialDateRange);
  const { dateRange, setDateRange, isCalendarOpen, setIsCalendarOpen, pagination, columnFilters } =
    tableState;

  if (columnFilters.length === 0) {
    columnFilters.push({ id: 'userStatus', value: 'ALL' });
  }

  const { data, isPending, isFetching } = useCustomerQuery({
    searchText: searchValue,
    currentPage: pagination.pageIndex,
    pageSize: pagination.pageSize,
    dateRange,
    columnFilters
  });
  const table = useDataTableApi({
    data: data?.data ?? [],
    columns: allUserColumns,
    tableState,
    pageCount: data?.pagination.totalPages ?? -1
  });

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <AllUserHeader
          dateRange={dateRange}
          setDateRange={setDateRange}
          isCalendarOpen={isCalendarOpen}
          setIsCalendarOpen={setIsCalendarOpen}
          initialDateRange={initialDateRange}
          search={searchValue}
          setSearch={setSearchValue}
          table={table}
        />
        <div className="flex min-h-0 overflow-hidden">
          <Table className="min-w-full">
            <TableHeader table={table} />
            <TableBody>
              <TableRows
                isLoading={isPending || isFetching}
                columns={allUserColumns}
                table={table}
              />
            </TableBody>
          </Table>
        </div>
      </div>
      <TablePagination table={table} />
    </div>
  );
}
