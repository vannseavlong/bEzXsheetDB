import { Table, TableBody } from '@/components/ui/table';
import useTableState from '@/hooks/use-table-state';
import TablePagination from '@/components/common/table-pagination';
import TableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import useDataTableApi from '@/hooks/use-data-table-api';
import { useState } from 'react';
import { ACTIONS, MODULES } from '@/lib/permission';
import { registeredCustomerColumns } from '@/components/data-table/registered-customer-column';
import useRegisteredCustomerQuery from '@/hooks/query/use-registered-customer-query';
import RegisterCustomerHeader from '@/components/data-table/registered-customer-header';
// import { initialDateRange } from '@/constants/constants';

export const handle = {
  module: MODULES.MARKETING_CUSTOMER,
  action: ACTIONS.VIEW
};

export default function RegisteredCustomer() {
  const [searchValue, setSearchValue] = useState<string>('');
  const tableState = useTableState();
  const { dateRange, setDateRange, isCalendarOpen, setIsCalendarOpen, pagination, columnFilters } =
    tableState;

  const { data, isPending, isFetching } = useRegisteredCustomerQuery({
    searchText: searchValue,
    currentPage: pagination.pageIndex,
    pageSize: pagination.pageSize,
    dateRange,
    columnFilters
  });
  const table = useDataTableApi({
    data: data?.data ?? [],
    columns: registeredCustomerColumns,
    tableState,
    pageCount: data?.pagination.totalPages ?? -1
  });

  return (
    <div className="flex flex-col min-h-[calc(100vh-88px)] lg:h-[calc(100vh-88px)] overflow-y-auto p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-[300px] lg:min-h-0">
        <RegisterCustomerHeader
          dateRange={dateRange}
          setDateRange={setDateRange}
          isCalendarOpen={isCalendarOpen}
          setIsCalendarOpen={setIsCalendarOpen}
          // initialDateRange={initialDateRange}
          search={searchValue}
          setSearch={setSearchValue}
          table={table}
        />
        <div className="flex min-h-0 overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader table={table} />
            <TableBody>
              <TableRows
                isLoading={isPending || isFetching}
                columns={registeredCustomerColumns}
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
