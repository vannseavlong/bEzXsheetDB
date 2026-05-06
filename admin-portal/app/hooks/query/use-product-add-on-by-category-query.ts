import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

export default function useProductAddOnByCategoryQuery(categoryId?: string, enabled = true) {
  const queryFn = (): Promise<ProductAddOnAttributes[]> => {
    const url = API_ENDPOINT.PRODUCT_ADD_ON_BY_CATEGORY_ID.replaceAll(
      '{categoryId}',
      categoryId || ''
    );
    return api.get(url);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.PRODUCT_ADD_ON_BY_CATEGORY_ID, categoryId],
    queryFn,
    enabled: enabled && !!categoryId
  });

  return query;
}
