import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';
type Props = {
  total: string;
  tables: DashboardNewUserProps[];
};

export default function useTotalDownloadQuery({
  type,
  dateRange
}: {
  type?: 'android' | 'ios';
  dateRange: { from?: Date; to?: Date };
}) {
  const apiFn = (): Promise<Props> => {
    return api.get(API_ENDPOINT.DASHBOARD_TOTAL_DOWNLOAD, {
      params: type
        ? {
            type,
            startDate: dateRange?.from?.toISOString(),
            endDate: dateRange?.to?.toISOString()
          }
        : {
            startDate: dateRange?.from?.toISOString(),
            endDate: dateRange?.to?.toISOString()
          }
    });
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.DASHBOARD_TOTAL_DOWNLOAD, type, dateRange],
    queryFn: apiFn
  });

  return query;
}
