import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { ServiceAddonAttributes } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export default function useServiceAddonQuery(categoryId?: string) {
  const apiFn = (): Promise<ServiceAddonAttributes[]> => {
    return api.get(`${API_ENDPOINT.PRODUCT_ADDON}/${categoryId}/product-add-on`);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.PRODUCT_ADDON, categoryId],
    queryFn: apiFn,
    enabled: !!categoryId
  });

  return query;
}
