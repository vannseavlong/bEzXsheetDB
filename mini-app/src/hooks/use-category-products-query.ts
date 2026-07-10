import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { CategoryProduct } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export default function useCategoryProductsQuery(categoryId?: string) {
  const apiFn = (): Promise<CategoryProduct[]> => {
    return api.get(API_ENDPOINT.CATEGORY_PRODUCTS(categoryId ?? ''));
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.CATEGORY_PRODUCTS, categoryId],
    queryFn: apiFn,
    enabled: !!categoryId
  });

  return query;
}
