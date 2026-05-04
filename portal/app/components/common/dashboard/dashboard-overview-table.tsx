import { Table, TableBody } from '@/components/ui/table';
import DataTableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import useTableState from '@/hooks/use-table-state';
import useDataTableApi from '@/hooks/use-data-table-api';
import { dashboardOverviewAdsColumns } from '@/components/data-table/dashboard-overview-ads-column-column';

export default function DashboardOverviewTable({
  data,
  isLoading
}: {
  data: AdsDailyProps[];
  isLoading?: boolean;
}) {
  const tableState = useTableState();
  const sortedData = data.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  const table = useDataTableApi({
    data: sortedData,
    columns: dashboardOverviewAdsColumns,
    tableState
  });

  return (
    <Table className="min-w-full">
      <DataTableHeader table={table} />
      <TableBody>
        <TableRows isLoading={isLoading} columns={dashboardOverviewAdsColumns} table={table} />
      </TableBody>
    </Table>
  );
}
