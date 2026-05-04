import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export default function useViewGroupAddonDetailQuery(
  id: string,
  options?: Omit<UseQueryOptions<ProductAddOnGroupDetailAttributes>, 'queryKey' | 'queryFn'>
) {
  const apiFn = (): Promise<ProductAddOnGroupDetailAttributes> => {
    const endpoint = API_ENDPOINT.PRODUCT_ADDON_GROUP_DETAIL.replace('{id}', id);
    return api.get(endpoint);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.PRODUCT_ADDON_GROUP_DETAIL, id],
    queryFn: apiFn,
    ...options
  });

  return query;
}
