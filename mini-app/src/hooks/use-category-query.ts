import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { Category } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export default function useCategoryQuery() {
  const apiFn = (): Promise<Category[]> => {
    return api.get(API_ENDPOINT.CATEGORY_LIST, { skipErrorHandler: true });
  };
  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.CATEGORY_LIST],
    queryFn: apiFn,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    placeholderData: (previousData) => previousData
  });

  return query;
}
