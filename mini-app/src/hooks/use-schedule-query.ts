import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { ScheduleApiResponse } from '@/types/api';

interface ScheduleQueryParams {
  serviceId?: number;
}
import { useQuery } from '@tanstack/react-query';

export default function useScheduleQuery(params?: ScheduleQueryParams) {
  const apiFn = (): Promise<ScheduleApiResponse> => {
    return api.get(API_ENDPOINT.SCHEDULE, { params });
  };

  return useQuery({
    queryKey: [QUERY_KEY_ENUM.SCHEDULE, params],
    queryFn: apiFn
  });
}
