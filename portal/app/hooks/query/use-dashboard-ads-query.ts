import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

export default function useDashboardAdsQuery(dateRange: { from?: Date; to?: Date }) {
  const apiFn = (): Promise<{ [key: string]: AdsProp }> => {
    return api.get(API_ENDPOINT.ADS_DATA, {
      params: {
        startDate: dateRange.from?.toISOString(),
        endDate: dateRange.to?.toISOString()
      }
    });
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.ADS_DATA, dateRange],
    queryFn: apiFn
  });

  return query;
}
