import { useState } from 'react';
import numeral from 'numeral';
import DashboardKpi from './dashboard-kpi';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import DashboardOverviewTable from './dashboard-overview-table';

import useDashboardAdsQuery from '@/hooks/query/use-dashboard-ads-query';
import { useMemo } from 'react';
import useGa4DailyMatricQuery from '@/hooks/query/use-ga4-daily-matric-query';

export default function AdsDataContent({ dateRange }: { dateRange: { from?: Date; to?: Date } }) {
  const [tab, setTab] = useState('overview');
  const { data, isLoading } = useDashboardAdsQuery(dateRange);
  const { data: dailyMatricData, isPending: dailyMatricPending } =
    useGa4DailyMatricQuery(dateRange);
  const dataSummary = useMemo(() => {
    const summary: AdsSummaryProps = {
      reach: 0,
      clicks: 0,
      appInstalls: 0,
      conversions: 0,
      spend: 0,
      cpc: 0,
      cac: 0,
      roas: 0
    };
    if (data) {
      const keys = Object.keys(data);
      keys.forEach((key) => {
        if (data[key]) {
          const s = data[key].summary || ({} as Partial<AdsSummaryProps>);
          summary.reach += s.reach || 0;
          summary.clicks += s.clicks || 0;
          summary.appInstalls += s.appInstalls || 0;
          summary.conversions += s.conversions || 0;
          summary.spend += s.spend || 0;
          summary.cpc += s.cpc || 0;
          summary.cac += s.cac || 0;
        }
      });

      summary.cac = numeral(summary.cac).divide(keys.length).value() || 0;
      summary.roas = numeral(dailyMatricData?.adsTotalRevenue).divide(summary.spend).value() || 0;
    }

    return summary;
  }, [dailyMatricData?.adsTotalRevenue, data]);

  return (
    <div className="relative flex flex-col gap-4">
      <DashboardKpi
        isLoading={isLoading}
        data={{
          reach: {
            count: `${numeral(dataSummary.reach).format('0,0')}`
          },
          clicks: {
            count: `${numeral(dataSummary.clicks).format('0,0')}`
          },
          conversions: {
            count: `${numeral(dataSummary.conversions).format('0,0')}`
          },
          appInstalls: {
            count: `${numeral(dataSummary.appInstalls).format('0,0')}`
          },
          totalCost: {
            count: `$${numeral(dataSummary.spend).format('0,0')}`
          },
          costPerClick: {
            count: `$${numeral(dataSummary.cpc).format('0,0')}`
          },
          costPerConversion: {
            count: `$${numeral(dataSummary.cac).format('0,0')}`
          },
          revenue: {
            count: `$${numeral(dailyMatricData?.adsTotalRevenue).format('0,0')}`,
            isLoading: dailyMatricPending
          },
          roas: {
            count: `$${numeral(dataSummary.roas).format('0,0')}`,
            isLoading: dailyMatricPending
          }
        }}
        kpiData={[
          {
            label: 'Reach',
            value: 'reach'
          },
          {
            label: 'Clicks',
            value: 'clicks'
          },
          {
            label: 'Conversions',
            value: 'conversions'
          },
          {
            label: 'App Installs',
            value: 'appInstalls'
          },
          {
            label: 'Total Cost',
            value: 'totalCost'
          },
          {
            label: 'Cost Per Click (CPC)',
            value: 'costPerClick'
          },
          {
            label: 'Cost Per Conversion (CAC)',
            value: 'costPerConversion'
          },
          {
            label: 'Revenue',
            value: 'revenue'
          },
          {
            label: 'ROAS',
            value: 'roas'
          }
        ]}
      />
      <Card className="border">
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="gap-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="facebook">Facebook</TabsTrigger>
              <TabsTrigger value="instagram">Instagram</TabsTrigger>
              <TabsTrigger value="Tiktok">Tiktok</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <DashboardOverviewTable
                data={(data?.facebook.daily || [])
                  .concat(data?.tiktok.daily || [])
                  .concat(data?.instagram.daily || [])}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="facebook">
              <DashboardOverviewTable data={data?.facebook.daily || []} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="Tiktok">
              <DashboardOverviewTable data={data?.tiktok.daily || []} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="instagram">
              <DashboardOverviewTable data={data?.instagram.daily || []} isLoading={isLoading} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
