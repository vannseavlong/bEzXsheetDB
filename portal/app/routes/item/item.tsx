import * as React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import useTableState from '@/hooks/use-table-state';
import TablePagination from '@/components/common/table-pagination';
import useDataTableConfig from '@/hooks/use-data-table-config';
import TableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import useServiceItemsQuery from '@/hooks/query/use-service-item-query';
import ItemHeader from '@/components/data-table/item-header';
import { itemColumns } from '@/components/data-table/item-columns';
import { ACTIONS, MODULES } from '@/lib/permission';

export const handle = {
  module: MODULES.SETUP_ITEM,
  action: ACTIONS.VIEW
};

export default function Item() {
  const initialDateRange = {
    // from: moment().startOf('month').toDate(),
    // to: moment().toDate()
    from: undefined,
    to: undefined
  };
  const tableState = useTableState(initialDateRange);
  const { data, isPending } = useServiceItemsQuery();

  const table = useDataTableConfig(data || [], itemColumns, tableState);
  const { isCalendarOpen, setIsCalendarOpen, dateRange, setDateRange } = tableState;

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <ItemHeader
          initialDateRange={initialDateRange}
          table={table}
          isCalendarOpen={isCalendarOpen}
          setIsCalendarOpen={setIsCalendarOpen}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
        <div className="flex min-h-0 overflow-hidden">
          <Table className="min-w-full">
            <TableHeader table={table} />
            <TableBody>
              <TableRows isLoading={isPending} columns={itemColumns} table={table} />
            </TableBody>
          </Table>
        </div>
      </div>
      <TablePagination table={table} />
    </div>
  );
}
