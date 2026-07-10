import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { PopularService } from '@/types/api';

import { useQuery } from '@tanstack/react-query';

export default function useHomePageQuery() {
  const apiFn = (): Promise<PopularService[]> => {
    return api.get(API_ENDPOINT.HOMEPAGE);
  };

  return useQuery({
    queryKey: [QUERY_KEY_ENUM.NOTE],
    queryFn: apiFn
  });
}
