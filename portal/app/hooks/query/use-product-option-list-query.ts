import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

type ProductOptionListParams = {
  assignable?: boolean;
};

export default function useProductOptionListQuery(params: ProductOptionListParams = {}) {
  const { assignable } = params;

  const apiFn = (): Promise<ProductOptionAttributes[]> => {
    return api.get(API_ENDPOINT.PRODUCT_OPTION_LIST, {
      params: { assignable }
    });
  };

  return useQuery({
    queryKey: [QUERY_KEY_ENUM.PRODUCT_OPTION_LIST, assignable],
    queryFn: apiFn
  });
}
