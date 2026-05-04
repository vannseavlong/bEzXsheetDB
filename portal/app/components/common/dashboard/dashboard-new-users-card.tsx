import { dashboardNewUserColumns } from '@/components/data-table/dashboard-new-user-column';
import DataTableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody } from '@/components/ui/table';
import useDataTableApi from '@/hooks/use-data-table-api';
import useTableState from '@/hooks/use-table-state';
import { useEffect, useState } from 'react';

import moment from 'moment';

export default function DashboardNewUsersCard({
  data,
  isLoading,
  dailyMatricData,
  dateRange
}: {
  data: DashboardNewUserProps[];
  isLoading?: boolean;
  dailyMatricData?: Ga4DailyMatricProps;
  dateRange: { from?: Date; to?: Date };
}) {
  const tableState = useTableState();

  const [finalData, setFinalData] = useState<DashboardNewUserProps[]>([]);
  console.log({ dateRange });
  useEffect(() => {
    if (!dateRange?.from || !dateRange?.to) return;
    const result: DashboardNewUserProps[] = [];
    const startDate = moment(dateRange.from);
    const endDate = moment(dateRange.to);

    for (let m = startDate; m.isSameOrBefore(endDate); m.add(1, 'days')) {
      const dateStr = m.format('YYYY-MM-DD');
      const dayData = data?.find((d) => d.date === dateStr);
      const dailyMatric = dailyMatricData?.data?.find((daily) => daily.date === dateStr);
      const order = dailyMatricData?.order?.find((daily) => daily.date === dateStr);

      result.push({
        ...dayData,
        id: dayData?.id || dateStr,
        date: dateStr,
        iOS: dayData?.iOS || '0',
        android: dayData?.android || '0',
        iosInstallOpen: dailyMatric?.iosActiveUsers || '0',
        androidInstallOpen: dailyMatric?.androidActiveUsers || '0',
        totalInstallOpen: dailyMatric?.totalInstallOpen || '0',
        totalRegisteredUsers: dailyMatric?.totalRegisteredUsers || '0',
        activeUsers: dailyMatric?.activeUsers || '0',
        totalInactiveUsers: dailyMatric?.totalInactiveUsers || '0',
        count: order?.count || '0',
        revenue: `$${order?.revenue ? order?.revenue.toFixed(2) : '0.00'}`
      });
    }
    setFinalData(result);
  }, [dailyMatricData, data, dateRange]);

  const table = useDataTableApi({
    data: finalData,
    columns: dashboardNewUserColumns,
    tableState
  });

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>New Users</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="min-w-full">
          <DataTableHeader table={table} />
          <TableBody>
            <TableRows isLoading={isLoading} columns={dashboardNewUserColumns} table={table} />
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
