import { Table, TableBody } from '@/components/ui/table';
import DataTableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import TablePagination from '@/components/common/table-pagination';
import useDataTableApi from '@/hooks/use-data-table-api';
import useTableState from '@/hooks/use-table-state';
import { initialDateRange } from '@/constants/constants';
import { announcementCouponColumns } from '@/components/data-table/announcement-coupon-column';
import useAnnouncementCouponsQuery from '@/hooks/query/use-announcement-coupons-query';
import { useState } from 'react';
import AnnouncementCouponHeader from '@/components/data-table/announcement-coupon-header';

export default function AnnouncementCoupon() {
  const [searchValue, setSearchValue] = useState('');

  const tableState = useTableState(initialDateRange);
  const { dateRange, setDateRange, isCalendarOpen, setIsCalendarOpen, pagination } = tableState;

  const {
    data: announcementCoupons,
    isPending: isPendingAU,
    isFetching: isFetchingAU
  } = useAnnouncementCouponsQuery({
    currentPage: pagination.pageIndex,
    searchText: searchValue,
    dateRange
  });
  // console.log('announcementDetail: ', announcementDetail);
  // console.log('announcementUsers: ', announcementUsers);

  const table = useDataTableApi({
    data: announcementCoupons?.data ?? [],
    columns: announcementCouponColumns,
    tableState,
    pageCount: announcementCoupons?.pagination.totalPages ?? -1
  });

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <AnnouncementCouponHeader
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
            <DataTableHeader table={table} />
            <TableBody>
              <TableRows
                isLoading={isPendingAU || isFetchingAU}
                columns={announcementCouponColumns}
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
