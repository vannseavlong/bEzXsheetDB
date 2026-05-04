import * as React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import useTableState from '@/hooks/use-table-state';
import TablePagination from '@/components/common/table-pagination';
import useDataTableConfig from '@/hooks/use-data-table-config';
import TableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import ReferralHeader from '@/components/data-table/referral-header';
import { referralColumns } from '@/components/data-table/referral-columns';
import { referralDummy } from '@/constants/data-dummy';

export default function ReferralProgram() {
  const tableState = useTableState();
  const table = useDataTableConfig(referralDummy, referralColumns, tableState);
  const {
    statusFilter,
    dateRange,
    isCalendarOpen,
    setStatusFilter,
    setDateRange,
    setIsCalendarOpen
  } = tableState;

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

  const headerProps = {
    table,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    isCalendarOpen,
    setIsCalendarOpen
  };

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <ReferralHeader {...headerProps} />
        <div className="flex min-h-0 overflow-hidden">
          <Table className="min-w-full">
            <TableHeader table={table} />
            <TableBody>
              <TableRows columns={referralColumns} table={table} />
            </TableBody>
          </Table>
        </div>
      </div>
      <TablePagination table={table} />
    </div>
  );
}
