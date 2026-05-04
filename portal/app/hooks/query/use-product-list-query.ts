import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

type ProductListParams = {
  assignable?: boolean;
  status?: boolean;
};

export default function useProductListQuery(params: ProductListParams = {}) {
  const { assignable, status } = params;

  const apiFn = (): Promise<ProductAttributes[]> => {
    return api.get(API_ENDPOINT.PRODUCT_LIST, {
      params: {
        assignable,
        status
      }
    });
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.PRODUCT_LIST, assignable, status],
    queryFn: apiFn
  });

  return query;
}
