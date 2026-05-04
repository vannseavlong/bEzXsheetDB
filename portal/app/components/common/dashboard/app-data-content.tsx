import useTotalDownloadQuery from '@/hooks/query/use-total-download-query';
import DashboardKpi from './dashboard-kpi';
import useDashboardOverviewQuery from '@/hooks/query/use-dashboard-overview-query';
import { UserGrowthChart } from './dashboard-chart';
import useUpcomingOrderQuery from '@/hooks/query/use-upcoming-order-query';
import DashboardReturningChart from './dashboard-returning-chart';
import DashboardSaleTargetChart from './dashboard-sale-target-chart';
import DashboardUpcomingCard from './dashboard-upcoming-card';
import DashboardNewUsersCard from './dashboard-new-users-card';
import useGa4DailyMatricQuery from '@/hooks/query/use-ga4-daily-matric-query';
import numeral from 'numeral';

type Props = {
  dateRange: { from?: Date; to?: Date };
};

export default function AppDataContent({ dateRange }: Props) {
  const { data, isPending } = useTotalDownloadQuery({ dateRange });

  const { data: overviewData, isPending: overviewPending } = useDashboardOverviewQuery(dateRange);
  const { data: upcomingOrderData, isPending: upcomingOrderPending } = useUpcomingOrderQuery();
  const { data: dailyMatricData, isPending: dailyMatricPending } =
    useGa4DailyMatricQuery(dateRange);

  return (
    <div className="space-y-6">
      <DashboardKpi
        isLoading={overviewPending}
        data={{
          downloadCount: {
            count: numeral(data?.total).format('0,0'),
            trend: 'none',
            percentage: '0',
            isLoading: isPending
          },
          totalInstallOpen: {
            count: numeral(overviewData?.totalInstallOpen?.count).format('0,0'),
            prevCount: numeral(overviewData?.totalInstallOpen?.prevCount).format('0,0'),
            trend: overviewData?.totalInstallOpen?.trend || 'none',
            percentage: overviewData?.totalInstallOpen?.percentage || '0'
          },
          totalRegisteredUsers: {
            count: numeral(overviewData?.totalRegisteredUsers?.count).format('0,0'),
            prevCount: numeral(overviewData?.totalRegisteredUsers?.prevCount).format('0,0'),
            trend: overviewData?.totalRegisteredUsers?.trend || 'none',
            percentage: overviewData?.totalRegisteredUsers?.percentage || '0'
          },
          totalActiveUsers: {
            count: numeral(overviewData?.totalActiveUsers?.count).format('0,0'),
            prevCount: numeral(overviewData?.totalActiveUsers?.prevCount).format('0,0'),
            trend: overviewData?.totalActiveUsers?.trend || 'none',
            percentage: overviewData?.totalActiveUsers?.percentage || '0'
          },
          totalInactiveUsers: {
            count: numeral(overviewData?.totalInactiveUsers?.count).format('0,0'),
            prevCount: numeral(overviewData?.totalInactiveUsers?.prevCount).format('0,0'),
            trend: overviewData?.totalInactiveUsers?.trend || 'none',
            percentage: overviewData?.totalInactiveUsers?.percentage || '0'
          }
        }}
        kpiData={[
          {
            label: 'Total Downloads',
            value: 'downloadCount'
          },
          {
            label: 'Install & Open',
            value: 'totalInstallOpen'
          },
          {
            label: 'Registered Users',
            value: 'totalRegisteredUsers'
          },
          {
            label: 'Active Users',
            value: 'totalActiveUsers'
          },
          { label: 'Inactive Users', value: 'totalInactiveUsers' }
        ]}
      />
      <UserGrowthChart data={overviewData?.charts || []} isLoading={overviewPending} />
      <div className="w-full overflow-x-auto">
        <div className="flex gap-6 flex-nowrap">
          <div className="min-w-[320px] shrink-0">
            <DashboardReturningChart
              isLoading={overviewPending}
              returnUser={overviewData?.returningUsers || { android: '0', ios: '0' }}
            />
          </div>

          <div className="flex-1 min-w-[320px]">
            <DashboardUpcomingCard
              data={upcomingOrderData?.data || []}
              isLoading={upcomingOrderPending}
            />
          </div>

          <div className="min-w-[280px] shrink-0">
            <DashboardSaleTargetChart
              dataAmount={{
                totalOrder: dailyMatricData?.appSales || '0',
                totalDirectSale: dailyMatricData?.directSales || '0',
                totalCoupon: dailyMatricData?.coupons || '0'
              }}
              defaultValue={overviewData?.saleTarget || '0'}
              isLoading={overviewPending || dailyMatricPending}
            />
          </div>
        </div>
      </div>
      <DashboardNewUsersCard
        dateRange={dateRange}
        isLoading={isPending || dailyMatricPending}
        data={data?.tables || []}
        dailyMatricData={dailyMatricData}
      />
    </div>
  );
}
