import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { ProductAddonAttributes } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export default function useProductAddonItemQuery(categoryId?: string, parentId?: string) {
  const apiFn = async (): Promise<ProductAddonAttributes[]> => {
    const res = await api.get(
      `${API_ENDPOINT.PRODUCT_ADDON}/${categoryId}/product-add-on/${parentId}/items`
    );

    if (Array.isArray(res)) {
      return res;
    }
    if (Array.isArray(res.data)) {
      return res.data;
    }

    return [];
  };

  return useQuery<ProductAddonAttributes[]>({
    queryKey: [QUERY_KEY_ENUM.PRODUCT_ADDON_ITEM, categoryId, parentId],
    queryFn: apiFn,
    enabled: !!categoryId && !!parentId
  });
}
