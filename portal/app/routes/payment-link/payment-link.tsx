import { Table, TableBody } from '@/components/ui/table';
import useTableState from '@/hooks/use-table-state';
import TablePagination from '@/components/common/table-pagination';
import TableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import usePaymentLinkQuery from '@/hooks/query/use-payment-link-query';
import PaymentLinkHeader from '@/components/data-table/payment-link-header';
import { paymentLinkColumns } from '@/components/data-table/payment-link-columns';
import { ACTIONS, MODULES } from '@/lib/permission';
import { useState } from 'react';
import useDataTableApi from '@/hooks/use-data-table-api';

export const handle = {
  module: MODULES.MARKETING_PAYMENT_LINK,
  action: ACTIONS.VIEW
};

export default function PaymentLink() {
  const initialDateRange = {
    // from: moment().startOf('month').toDate(),
    // to: moment().toDate()
    from: undefined,
    to: undefined
  };
  const [searchValue, setSearchValue] = useState('');
  const tableState = useTableState(initialDateRange);
  const { dateRange, setDateRange, isCalendarOpen, setIsCalendarOpen, pagination } = tableState;
  // const tableState = useTableState(initialDateRange);
  // const { mutate } = useAddCleanerDetailMutation();
  const { data, isPending } = usePaymentLinkQuery({
    currentPage: pagination.pageIndex,
    searchText: searchValue,
    dateRange
  });

  const table = useDataTableApi({
    data: data?.data ?? [],
    columns: paymentLinkColumns,
    tableState,
    pageCount: data?.pagination.totalPages ?? 1
  });

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <PaymentLinkHeader
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
              <TableRows isLoading={isPending} columns={paymentLinkColumns} table={table} />
            </TableBody>
          </Table>
        </div>
      </div>
      <TablePagination table={table} />
    </div>
  );
}
