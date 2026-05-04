import * as React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import useTableState from '@/hooks/use-table-state';
import TablePagination from '@/components/common/table-pagination';
import TableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import { pushNotificationColumns } from '@/components/data-table/push-notification-column';
import PushNotificationHeader from '@/components/data-table/push-notification-header';
import useAnnouncementQuery from '@/hooks/query/use-announcement-query';
import useDataTableApi from '@/hooks/use-data-table-api';
import { ACTIONS, MODULES } from '@/lib/permission';

export const handle = {
  module: MODULES.MARKETING_NOTIFICATION,
  action: ACTIONS.VIEW
};

export default function PushNotification() {
  const initialDateRange = {
    // from: moment().startOf('month').toDate(),
    // to: moment().toDate()
    from: undefined,
    to: undefined
  };
  const [searchValue, setSearchValue] = React.useState('');
  const tableState = useTableState(initialDateRange);
  const {
    dateRange,
    setDateRange,
    isCalendarOpen,
    setIsCalendarOpen,
    pagination,
    statusFilter,
    setStatusFilter
  } = tableState;
  const { data, isPending } = useAnnouncementQuery({
    currentPage: pagination.pageIndex,
    searchText: searchValue,
    dateRange
  });
  const table = useDataTableApi({
    data: data?.data ?? [],
    columns: pushNotificationColumns,
    tableState,
    pageCount: data?.pagination.totalPages ?? 1
  });

  const headerProps = {
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    isCalendarOpen,
    setIsCalendarOpen,
    search: searchValue,
    setSearch: setSearchValue
  };

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <PushNotificationHeader {...headerProps} />
        <div className="flex min-h-0 overflow-hidden">
          <Table className="min-w-full">
            <TableHeader table={table} />
            <TableBody>
              <TableRows isLoading={isPending} columns={pushNotificationColumns} table={table} />
            </TableBody>
          </Table>
        </div>
      </div>
      <TablePagination table={table} />
    </div>
  );
}
