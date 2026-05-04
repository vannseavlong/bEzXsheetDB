import OverviewAge from '@/components/common/overview/overview-age';
import OverviewChart from '@/components/common/overview/overview-chart';
import OverviewGender from '@/components/common/overview/overview-gender';
import OverviewKpi from '@/components/common/overview/overview-kpi';
import OverviewPreferService from '@/components/common/overview/overview-prefer-service';
import OverviewReferralSource from '@/components/common/overview/overview-referral-source';
import OverviewServiceBreakdown from '@/components/common/overview/overview-service-breakdown';
import OverviewCouponUsageCard from '@/components/common/overview/overview-coupon-usage-card';
import { useState } from 'react';
import {
  useMarketingOverviewAllQuery,
  useMarketingOverviewQuery
} from '@/hooks/query/use-marketing-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export default function Overview() {
  const [dateType, setDateType] = useState<string>('YESTERDAY');
  const { data, isPending } = useMarketingOverviewQuery(dateType);
  const { data: allData, isPending: allPending } = useMarketingOverviewAllQuery();

  return (
    <div className="p-5 pt-0 flex gap-6 flex-col">
      <OverviewKpi
        isLoading={allPending}
        data={[
          {
            label: 'Total Active User',
            value: 'usersActiveCount'
          },
          {
            label: 'Total Inactive User',
            value: 'usersInActiveCount'
          },
          {
            label: 'Total Guest Mode',
            value: 'totalGuestMode'
          },
          {
            label: 'Total Account Deleted',
            value: 'totalAccountDeleted'
          }
        ]}
        payload={{
          usersActiveCount: { count: allData?.usersActiveCount || '0' },
          usersInActiveCount: { count: allData?.usersInActiveCount || '0' },
          totalGuestMode: { count: allData?.totalGuestMode || '0' },
          totalAccountDeleted: { count: allData?.totalAccountDeleted || '0' }
        }}
        itemsPerPage={4}
      />
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-end gap-4 py-2 bg-white">
        <Select value={dateType} onValueChange={setDateType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODAY">Today</SelectItem>
            <SelectItem value="YESTERDAY">Yesterday</SelectItem>
            <SelectItem value="LAST_7_DAYS">Last 7 Days</SelectItem>
            <SelectItem value="THIS_MONTH">This Month</SelectItem>
            <SelectItem value="LAST_MONTH">Last Month</SelectItem>
            <SelectItem value="LAST_90_DAYS">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
        {/* <Button size="sm" onClick={() => {}}>
          Export
          <IconAssets.Export />
        </Button> */}
      </div>
      <OverviewKpi
        itemsPerPage={4}
        isLoading={isPending}
        data={[
          {
            label: 'Registered Users',
            value: 'userCount'
          },
          {
            label: `Order Count`,
            value: 'orderCount'
          },
          { label: 'Not Interested', value: 'notInterestedCount' },
          {
            label: 'Interested But Not Now',
            value: 'interestedButNotNowCount'
          },
          {
            label: 'No Answer',
            value: 'noAnswerCount'
          },
          {
            label: 'Existing Customer',
            value: 'existingCustomerCount'
          }
        ]}
        payload={{
          userCount: data?.totalUserRegistered,
          orderCount: data?.totalOrderCount,
          notInterestedCount: data?.totalNotInterested,
          interestedButNotNowCount: data?.totalInterestedButNotNow,
          noAnswerCount: data?.totalNoAnswer,
          existingCustomerCount: data?.totalExistingCustomer
        }}
      />
      <OverviewChart data={data?.overviewChart} dateType={dateType} isLoading={isPending} />
      <div className="flex gap-6 h-[240px] overflow-x-auto">
        <OverviewGender data={data?.genderResult || []} isLoading={isPending} />
        <OverviewAge data={data?.ageGroup || []} isLoading={isPending} />
      </div>
      <div className="flex gap-6 overflow-x-auto">
        <OverviewReferralSource data={data?.referralSource || []} />
        <OverviewPreferService data={data?.categoriesPreferred || []} />
        <OverviewServiceBreakdown data={data?.servicesBreakdown || []} />
      </div>
      <OverviewCouponUsageCard data={data?.couponUsageBreakdown || []} isLoading={isPending} />
    </div>
  );
}
