//

import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

export default function useGa4DailyMatricQuery(dateRange?: { from?: Date; to?: Date }) {
  const queryFn = (): Promise<Ga4DailyMatricProps> => {
    return api.get(API_ENDPOINT.DAILY_EVENT_MATRIC, {
      params: {
        startDate: dateRange?.from?.toISOString(),
        endDate: dateRange?.to?.toISOString()
      }
    });
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.DAILY_EVENT_MATRIC, dateRange],
    queryFn
  });

  return query;
}
