import { useState } from 'react';
import { ACTIONS, MODULES } from '@/lib/permission';
import OverviewCard from '@/components/common/overview-card';
import DateRangePickerV2 from '@/components/common/date-range-picker-v2';
import { initialDateRange, OverviewDescription } from '@/constants/constants';
import useOverviewCustomerQuery from '@/hooks/query/use-overview-customer-query';

export const handle = {
  module: MODULES.MARKETING_CUSTOMER,
  action: ACTIONS.VIEW
};

const overviews: { label: string; value: string }[] = [
  {
    label: 'Total Registered Users',
    value: 'totalUserRegistered'
  },
  {
    label: 'New Registered Users',
    value: 'totalNewUserRegistered'
  },
  {
    label: 'Return Customer Rate',
    value: 'totalReturnCustomerRate'
  },
  {
    label: 'Avg. Order Revenue',
    value: 'totalAvgOrderRevenue'
  }
];

export default function Customer() {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>(initialDateRange);
  const [isOpen, setIsOpen] = useState(false);

  const { data } = useOverviewCustomerQuery({ dateRange });

  return (
    <div className="flex flex-col min-h-[calc(100vh-88px)] lg:h-[calc(100vh-88px)] overflow-y-auto p-4 pb-0">
      <div className="flex justify-end pb-4">
        <DateRangePickerV2
          initialDateRange={initialDateRange}
          dateRange={dateRange}
          setDateRange={setDateRange}
          isCalendarOpen={isOpen}
          setIsCalendarOpen={setIsOpen}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
        {overviews.map((kpi, index) => {
          const overview = (
            data
              ? data[kpi.value as keyof typeof data]
              : {
                  count: 0,
                  trend: 'none',
                  percentage: '0'
                }
          ) as TrendProps;
          return (
            <OverviewCard
              count={overview?.count}
              percentage={overview?.percentage}
              trend={overview?.trend}
              key={index}
              label={kpi.label}
              description={OverviewDescription[kpi.value as keyof typeof OverviewDescription]}
            />
          );
        })}
      </div>
    </div>
  );
}
