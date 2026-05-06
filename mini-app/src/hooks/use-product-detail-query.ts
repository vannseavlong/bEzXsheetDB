import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { ProductAttributes } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export default function useProductDetailQuery(id?: string) {
  const apiFn = (): Promise<ProductAttributes[]> => {
    return api.get(`${API_ENDPOINT.PRODUCT}/${id}/options`);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.PRODUCT, id],
    queryFn: apiFn,
    enabled: !!id
  });

  return query;
}
