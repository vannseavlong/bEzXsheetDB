import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export default function useViewItemAddonQuery(
  groupId: string,
  options?: Omit<UseQueryOptions<ProductAddOnAttributes[]>, 'queryKey' | 'queryFn'>
) {
  const apiFn = (): Promise<ProductAddOnAttributes[]> => {
    return api.get(`${API_ENDPOINT.PRODUCT_ADDON_LIST}?groupId=${groupId}`);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.PRODUCT_ADDON_ITEM_LIST, groupId],
    queryFn: apiFn,
    ...options
  });

  return query;
}
