import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { ServiceCategory } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export default function useServiceDetailQuery(id?: string) {
  const apiFn = async (): Promise<ServiceCategory[]> => {
    return api.get(`${API_ENDPOINT.CATEGORY_LIST}/${id}/product/list`);
  };

  return useQuery({
    queryKey: [QUERY_KEY_ENUM.CATEGORY_LIST, id],
    queryFn: apiFn,
    enabled: !!id
  });
}
