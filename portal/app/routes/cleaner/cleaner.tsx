import * as React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import useTableState from '@/hooks/use-table-state';
import TablePagination from '@/components/common/table-pagination';
import useDataTableConfig from '@/hooks/use-data-table-config';
import TableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import CleanerHeader from '@/components/data-table/cleaner-header';
import { useCleanersQuery } from '@/hooks/query/use-cleaners-query';
import { cleanerColumns } from '@/components/data-table/cleaner-columns';
import { ACTIONS, MODULES } from '@/lib/permission';

export const handle = {
  module: MODULES.CLEANER,
  action: ACTIONS.VIEW
};

export default function Cleaner() {
  const tableState = useTableState(undefined, 'active');
  const { data, isPending } = useCleanersQuery();

  const table = useDataTableConfig(data || [], cleanerColumns, tableState);

  const { statusFilter, setStatusFilter } = tableState;

  // Optimized status filter effect with debouncing
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      const statusColumn = table.getColumn('status');
      if (statusColumn) {
        switch (statusFilter) {
          case 'all':
            statusColumn.setFilterValue(undefined);
            break;

          case 'active':
            statusColumn.setFilterValue(true);
            break;

          case 'inactive':
            statusColumn.setFilterValue(false);
            break;

          default:
            break;
        }
      }
    }, 100); // Small debounce to prevent excessive filtering

    return () => clearTimeout(timeoutId);
  }, [statusFilter, table]);

  const headerProps = {
    table,
    statusFilter,
    setStatusFilter
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-88px)] lg:h-[calc(100vh-88px)] overflow-y-auto p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-[300px] lg:min-h-0">
        <CleanerHeader {...headerProps} />
        <div className="flex min-h-0 overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader table={table} />
            <TableBody>
              <TableRows isLoading={isPending} columns={cleanerColumns} table={table} />
            </TableBody>
          </Table>
        </div>
      </div>
      <TablePagination table={table} />
    </div>
  );
}
