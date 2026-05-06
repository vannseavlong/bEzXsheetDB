import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

export default function useViewGroupAddonQuery(assignable?: boolean) {
  const apiFn = (): Promise<ProductAddOnGroupListAttributes[]> => {
    return api.get(API_ENDPOINT.PRODUCT_ADDON_GROUP_LIST, {
      params: {
        assignable
      }
    });
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.PRODUCT_ADDON_GROUP_LIST, assignable],
    queryFn: apiFn
  });

  return query;
}
