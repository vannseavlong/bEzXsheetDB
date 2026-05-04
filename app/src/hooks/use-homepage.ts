import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { CategoryListResponse } from '@/types/api';

import { useQuery } from '@tanstack/react-query';

export default function useHomePageQuery() {
  const apiFn = (): Promise<CategoryListResponse> => {
    return api.get(API_ENDPOINT.NOTE);
  };

  return useQuery({
    queryKey: [QUERY_KEY_ENUM.NOTE],
    queryFn: apiFn
  });
}
