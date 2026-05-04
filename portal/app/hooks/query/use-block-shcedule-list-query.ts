import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

export default function useBlockedScheduleQuery() {
  const apiFn = (): Promise<BlockedScheduleAttributes[]> => {
    return api.get(API_ENDPOINT.BLOCKED_SCHEDULE, {
      // params: {
      //   page: currentPage + 1,
      //   limit: CONSTANTS.LIMIT_PER_PAGE,
      //   searchText,
      //   startDate: dateRange?.from?.toISOString(),
      //   endDate: dateRange?.to?.toISOString()
      // }
    });
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.BLOCKED_SCHEDULE],
    queryFn: apiFn
  });

  return query;
}
