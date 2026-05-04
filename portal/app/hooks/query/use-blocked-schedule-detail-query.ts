import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

export default function useBlockedScheduleDetailQuery(id?: string) {
  const apiFn = (): Promise<BlockedScheduleAttributes> => {
    return api.get(API_ENDPOINT.BLOCKED_SCHEDULE_DETAIL.replace('{id}', id || ''));
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.BLOCKED_SCHEDULE_DETAIL, id],
    queryFn: apiFn,
    enabled: id !== 'new'
  });

  return query;
}
