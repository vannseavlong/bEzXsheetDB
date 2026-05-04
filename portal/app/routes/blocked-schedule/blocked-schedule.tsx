import { Table, TableBody } from '@/components/ui/table';
import useTableState from '@/hooks/use-table-state';
import TablePagination from '@/components/common/table-pagination';
import useDataTableConfig from '@/hooks/use-data-table-config';
import TableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import useBlockedScheduleQuery from '@/hooks/query/use-block-shcedule-list-query';
import { blockedScheduleColumns } from '@/components/data-table/blocked-schedule-columns';
import BlockedScheduleHeader from '@/components/data-table/block-schedule-header';
import { ACTIONS, MODULES } from '@/lib/permission';

export const handle = {
  module: MODULES.SETUP_SCHEDULE,
  action: ACTIONS.VIEW
};

export default function BlockSchedule() {
  const tableState = useTableState();
  const { data, isPending } = useBlockedScheduleQuery();

  console.log({ data });

  const table = useDataTableConfig(data || [], blockedScheduleColumns, tableState);
  const { isCalendarOpen, setIsCalendarOpen, dateRange, setDateRange } = tableState;

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <BlockedScheduleHeader
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
              <TableRows isLoading={isPending} columns={blockedScheduleColumns} table={table} />
            </TableBody>
          </Table>
        </div>
      </div>
      <TablePagination table={table} />
    </div>
  );
}
