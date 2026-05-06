import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

export function useSelectedProductDetailQuery(id: string) {
  const apiFn = (): Promise<string[]> => {
    return api.get(API_ENDPOINT.GET_SELECTED_PRODUCT_DETAIL.replaceAll('{id}', id));
  };
  return useQuery({
    queryKey: [QUERY_KEY_ENUM.GET_SELECTED_PRODUCT_DETAIL, id],
    queryFn: apiFn,
    enabled: false
  });
}
