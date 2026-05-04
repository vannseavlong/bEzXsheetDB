import { overviewCouponUsageColumns } from '@/components/data-table/overview-coupon-usage-column';
import DataTableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody } from '@/components/ui/table';
import useDataTableApi from '@/hooks/use-data-table-api';
import useTableState from '@/hooks/use-table-state';

export default function OverviewCouponUsageCard({
  data,
  isLoading
}: {
  data: CouponUsageBreakdownProps[];
  isLoading?: boolean;
}) {
  const tableState = useTableState();

  const table = useDataTableApi({
    data: data || [],
    columns: overviewCouponUsageColumns,
    tableState
  });

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>Coupon Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="min-w-full">
          <DataTableHeader table={table} />
          <TableBody>
            <TableRows isLoading={isLoading} columns={overviewCouponUsageColumns} table={table} />
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
