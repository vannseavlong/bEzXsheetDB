import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export default function useProductDetailQuery(
  id: string | number,
  options?: Omit<UseQueryOptions<ProductDetailAttributes>, 'queryKey' | 'queryFn'>
) {
  const apiFn = (): Promise<ProductDetailAttributes> => {
    const endpoint = API_ENDPOINT.PRODUCT_DETAIL.replace('{id}', id.toString());
    return api.get<ProductDetailAttributes>(endpoint);
  };

  return useQuery({
    queryKey: [QUERY_KEY_ENUM.PRODUCT_DETAIL, id],
    queryFn: apiFn,
    ...options
  });
}
