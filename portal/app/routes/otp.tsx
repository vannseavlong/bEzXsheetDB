import * as React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import useTableState from '@/hooks/use-table-state';
import TablePagination from '@/components/common/table-pagination';
import useDataTableConfig from '@/hooks/use-data-table-config';
import TableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import useOTPQuery from '@/hooks/query/use-otp-query';
import { otpColumns } from '@/components/data-table/otp-columns';
import { ACTIONS, MODULES } from '@/lib/permission';

export const handle = {
  module: MODULES.MARKETING_OTP,
  action: ACTIONS.VIEW
};

export default function OTP() {
  const tableState = useTableState();
  const { data, isPending } = useOTPQuery();

  console.log({ data });
  const table = useDataTableConfig(data?.data || [], otpColumns, tableState);

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <div className="flex min-h-0 overflow-hidden">
          <Table className="min-w-full">
            <TableHeader table={table} />
            <TableBody>
              <TableRows isLoading={isPending} columns={otpColumns} table={table} />
            </TableBody>
          </Table>
        </div>
      </div>
      <TablePagination table={table} />
    </div>
  );
}
