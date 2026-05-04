import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { ProductAddonAttributes } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export default function useProductAddonQuery(id?: string) {
  const apiFn = (): Promise<ProductAddonAttributes[]> => {
    return api.get(`${API_ENDPOINT.PRODUCT_ADDON_DETAIL}/${id}/product-add-on`);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.PRODUCT_ADDON_DETAIL, id],
    queryFn: apiFn,
    enabled: !!id
  });

  return query;
}
