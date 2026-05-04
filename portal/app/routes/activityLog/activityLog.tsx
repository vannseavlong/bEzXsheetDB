import * as React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import useTableState from '@/hooks/use-table-state';
import TablePagination from '@/components/common/table-pagination';
import TableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import ActivityLogHeader from '@/components/data-table/activity-log-header';
import { activityLogColumns } from '@/components/data-table/activity-log-columns';
import { ACTIONS, MODULES } from '@/lib/permission';
import useDataTableApi from '@/hooks/use-data-table-api';
import { useActivityLogQuery } from '@/hooks/query/use-activity-log-query';

export const handle = {
  module: MODULES.ACTIVITY_LOG,
  action: ACTIONS.VIEW
};

export default function ActivityLog() {
  const [searchValue, setSearchValue] = React.useState('');
  const tableState = useTableState();
  const { pagination, columnFilters } = tableState;
  const { data, isPending } = useActivityLogQuery({
    columnFilters: columnFilters,
    currentPage: pagination.pageIndex,
    searchText: searchValue
  });

  const table = useDataTableApi({
    data: data?.data ?? [],
    columns: activityLogColumns,
    tableState,
    pageCount: data?.pagination.totalPages ?? 1
  });

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <ActivityLogHeader
          search={searchValue}
          setSearch={(v) => {
            table.resetPagination();
            setSearchValue(v);
          }}
        />
        <div className="flex min-h-0 overflow-hidden">
          <Table className="min-w-full">
            <TableHeader table={table} />
            <TableBody>
              <TableRows isLoading={isPending} columns={activityLogColumns} table={table} />
            </TableBody>
          </Table>
        </div>
      </div>
      <TablePagination table={table} />
    </div>
  );
}
