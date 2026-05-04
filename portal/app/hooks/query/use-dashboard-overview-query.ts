import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

type CustomTrendProps = {
  isLoading?: boolean;
} & TrendProps;

type Props = {
  totalInstallOpen: CustomTrendProps;
  totalRegisteredUsers: CustomTrendProps;
  totalInactiveUsers: CustomTrendProps;
  totalActiveUsers: CustomTrendProps;
  charts: DashboardChartProps[];
  returningUsers: {
    android: string;
    ios: string;
  };
  saleTarget: string;
};

export default function useDashboardOverviewQuery(dateRange: { from?: Date; to?: Date }) {
  const apiFn = (): Promise<Props> => {
    return api.get(API_ENDPOINT.DASHBOARD_OVERVIEW, {
      params: {
        startDate: dateRange?.from?.toISOString(),
        endDate: dateRange?.to?.toISOString()
      }
    });
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.DASHBOARD_OVERVIEW, dateRange],
    queryFn: apiFn
  });

  return query;
}
