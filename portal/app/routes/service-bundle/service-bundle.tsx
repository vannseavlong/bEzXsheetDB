import * as React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import useTableState from '@/hooks/use-table-state';
import { serviceBundleData } from '@/constants/data-dummy';
import TablePagination from '@/components/common/table-pagination';
import useDataTableConfig from '@/hooks/use-data-table-config';
import TableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import ServiceBundleHeader from '@/components/data-table/service-bundle-header'; // Fixed import path
import { serviceBundleColumns } from '@/components/data-table/service-bundle-columns';

export default function ServiceBundle() {
  const tableState = useTableState();
  const table = useDataTableConfig(serviceBundleData, serviceBundleColumns, tableState);
  const { statusFilter, setStatusFilter } = tableState;

  // Optimized status filter effect with debouncing
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      const statusColumn = table.getColumn('status');
      if (statusColumn) {
        statusColumn.setFilterValue(statusFilter === 'all' ? undefined : statusFilter);
      }
    }, 100); // Small debounce to prevent excessive filtering

    return () => clearTimeout(timeoutId);
  }, [statusFilter, table]);

  // Remove unused props from headerProps
  const headerProps = {
    table,
    statusFilter,
    setStatusFilter
  };

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <ServiceBundleHeader {...headerProps} />
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <Table className="min-w-full">
            <TableHeader table={table} />
            <TableBody>
              <TableRows columns={serviceBundleColumns} table={table} />
            </TableBody>
          </Table>
        </div>
      </div>
      <TablePagination table={table} />
    </div>
  );
}
