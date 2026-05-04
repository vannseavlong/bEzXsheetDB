import * as React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import useTableState from '@/hooks/use-table-state';
import TablePagination from '@/components/common/table-pagination';
import TableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import { useCouponQuery } from '@/hooks/query/use-coupon-query';
import CouponHeader from '@/components/data-table/coupon-header';
import { couponColumns } from '@/components/data-table/coupon-columns';
import { ACTIONS, MODULES } from '@/lib/permission';
import useDataTableApi from '@/hooks/use-data-table-api';

export const handle = {
  module: MODULES.MARKETING_COUPON,
  action: ACTIONS.VIEW
};

export default function Coupon() {
  const [searchValue, setSearchValue] = React.useState('');
  const tableState = useTableState();
  const { pagination, columnFilters } = tableState;
  const { data, isPending } = useCouponQuery({
    columnFilters: columnFilters,
    currentPage: pagination.pageIndex,
    searchText: searchValue
  });

  const table = useDataTableApi({
    data: data?.data ?? [],
    columns: couponColumns,
    tableState,
    pageCount: data?.pagination.totalPages ?? 1
  });

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <CouponHeader
          search={searchValue}
          setSearch={(v) => {
            table.resetPagination();
            setSearchValue(v);
          }}
          table={table}
        />
        <div className="flex min-h-0 overflow-hidden">
          <Table className="min-w-full">
            <TableHeader table={table} />
            <TableBody>
              <TableRows isLoading={isPending} columns={couponColumns} table={table} />
            </TableBody>
          </Table>
        </div>
      </div>
      <TablePagination table={table} />
    </div>
  );
}
