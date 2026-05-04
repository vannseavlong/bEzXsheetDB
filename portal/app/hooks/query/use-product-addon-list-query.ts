import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

export default function useProductAddonListQuery() {
  const apiFn = (): Promise<ProductAddOnAttributes[]> => {
    return api.get(API_ENDPOINT.PRODUCT_ADDON_LIST);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.PRODUCT_ADDON_LIST],
    queryFn: apiFn
  });

  return query;
}
