import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

export function useProductsByCategoryIdQuery(categoryId: string) {
  const queryFn = (): Promise<ProductAttributes[]> => {
    const url = API_ENDPOINT.PRODUCT_DETAIL_BY_CATEGORY_ID.replaceAll('{id}', categoryId);
    return api.get(url);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.PRODUCT_DETAIL_BY_CATEGORY_ID, categoryId],
    queryFn,
    enabled: !!categoryId && categoryId !== 'OTHER'
  });

  return query;
}

export function useProductOptionByProductIdQuery(productId?: string) {
  const queryFn = (): Promise<ProductOptionAttributes[]> => {
    const url = API_ENDPOINT.PRODUCT_OPTION_BY_PRODUCT_ID.replaceAll('{id}', productId || '');
    return api.get(url);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.PRODUCT_OPTION_BY_PRODUCT_ID, productId],
    queryFn,
    enabled: !!productId
  });

  return query;
}
