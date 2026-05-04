import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

type Props = {
  totalUserRegistered: TrendProps;
  totalActiveUserCount: TrendProps;
  totalInactive: TrendProps;
  totalOrderCount: TrendProps;
  totalNotInterested: TrendProps;
  totalInterestedButNotNow: TrendProps;
  totalNoAnswer: TrendProps;
  totalExistingCustomer: TrendProps;
  overviewChart: OverviewChartProps;
  genderResult: LabelValueProps[];
  ageGroup: LabelValueProps[];
  referralSource: LabelValueProps[];
  preferService: LabelValueProps[];
  serviceBreakdown: LabelValueProps[];
  categoriesPreferred: LabelValueProps[];
  servicesBreakdown: ServiceBreakdownProps[];
  couponUsageBreakdown: CouponUsageBreakdownProps[];
};

export function useMarketingOverviewQuery(dateType: string) {
  const apiFn = (): Promise<Props> => {
    const params = {
      dateType
    };

    return api.get(API_ENDPOINT.MARKETING_OVERVIEW, {
      params
    });
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.MARKETING_OVERVIEW, dateType],
    queryFn: apiFn
  });

  return query;
}

export function useMarketingOverviewAllQuery() {
  const apiFn = (): Promise<{
    usersActiveCount?: string;
    usersInActiveCount?: string;
    totalGuestMode?: string;
    totalAccountDeleted?: string;
  }> => {
    return api.get(API_ENDPOINT.MARKETING_OVERVIEW_ALL);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.MARKETING_OVERVIEW_ALL],
    queryFn: apiFn
  });

  return query;
}
