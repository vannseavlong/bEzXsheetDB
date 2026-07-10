import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { ScheduleDay } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export default function useScheduleQuery() {
  const apiFn = (): Promise<ScheduleDay[]> => {
    return api.get(API_ENDPOINT.ORDER_SCHEDULE);
  };

  return useQuery({
    queryKey: [QUERY_KEY_ENUM.SCHEDULE],
    queryFn: apiFn
  });
}
