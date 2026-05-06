import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

export default function useCategoryQuery() {
  const apiFn = (): Promise<CategoryAttributes[]> => {
    return api.get(API_ENDPOINT.CATEGORIES);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.CATEGORIES],
    queryFn: apiFn
  });

  return query;
}
