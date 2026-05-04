import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';
import type { ProductDetailResponse } from '@/types/api';

export default function useProductDetailQuery(id?: string) {
  const apiFn = async (): Promise<ProductDetailResponse> => {
    const result: ProductDetailResponse = await api.get(
      `${API_ENDPOINT.PRODUCT_DETAIL}/${id}/detail`
    );
    return result;
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.PRODUCT, 'detail', id],
    queryFn: apiFn,
    enabled: !!id
  });

  return query;
}
