import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export default function useViewCategoryQuery(
  id: string | number,
  options?: Omit<UseQueryOptions<CategoryDetailProps>, 'queryKey' | 'queryFn'>
) {
  const apiFn = (): Promise<CategoryDetailProps> => {
    const endpoint = API_ENDPOINT.CATEGORY_DETAIL.replace('{id}', id.toString());
    return api.get<CategoryDetailProps>(endpoint);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.CATEGORY_DETAIL, id],
    queryFn: apiFn,
    ...options
  });

  return query;
}
