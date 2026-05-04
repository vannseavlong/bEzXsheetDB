import * as React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import useTableState from '@/hooks/use-table-state';
import TablePagination from '@/components/common/table-pagination';
import TableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import FinanceHeader from '@/components/data-table/finance-header'; // <-- updated header
import { financeColumns } from '@/components/data-table/finance-columns'; // <-- updated columns
import useOrderQuery from '@/hooks/query/use-order-query';
import useDataTableApi from '@/hooks/use-data-table-api';
import { ACTIONS, MODULES } from '@/lib/permission';

export const handle = {
  module: MODULES.FINANCE_ORDER,
  action: ACTIONS.VIEW
};

export default function FinanceOrders() {
  const initialDateRange = {
    // from: moment().startOf('month').toDate(),
    // to: moment().toDate()
    from: undefined,
    to: undefined
  };
  const [searchValue, setSearchValue] = React.useState('');
  const tableState = useTableState(initialDateRange);
  const { dateRange, setDateRange, isCalendarOpen, setIsCalendarOpen, pagination } = tableState;
  const { data: ordersData, isPending } = useOrderQuery({
    currentPage: pagination.pageIndex,
    dateRange,
    statusFilter: 'all',
    searchText: searchValue,
    paymentStatusFilter: 'PAID',
    isFinance: true
  });
  const table = useDataTableApi({
    data: ordersData?.data ?? [],
    columns: financeColumns,
    tableState,
    pageCount: ordersData?.pagination.totalPages ?? 1
  });

  const financeProps = {
    table,
    dateRange,
    setDateRange,
    isCalendarOpen,
    setIsCalendarOpen,
    initialDateRange
  };

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <FinanceHeader {...financeProps} search={searchValue} setSearch={setSearchValue} />

        <div className="flex min-h-0 overflow-hidden">
          <Table className="min-w-full">
            <TableHeader table={table} />
            <TableBody>
              <TableRows isLoading={isPending} columns={financeColumns} table={table} />
            </TableBody>
          </Table>
        </div>
      </div>
      <TablePagination table={table} />
    </div>
  );
}
