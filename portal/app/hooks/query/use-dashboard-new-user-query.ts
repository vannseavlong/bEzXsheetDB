import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

type Props = {
  data: DashboardNewUserProps[];
};

export default function useDashboardNewUserQuery(dateRange: { from?: Date; to?: Date }) {
  const apiFn = (): Promise<Props> => {
    return api.get(API_ENDPOINT.DASHBOARD_NEW_USER, {
      params: { startDate: dateRange?.from?.toISOString(), endDate: dateRange?.to?.toISOString() }
    });
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.DASHBOARD_NEW_USER, dateRange],
    queryFn: apiFn
  });

  return query;
}
