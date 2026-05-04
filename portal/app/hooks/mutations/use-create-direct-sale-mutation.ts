import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';
import customQueryClient from '../use-custom-query-client';

export default function useCreateDirectSaleMutation(bulkOrderId?: string) {
  const apiFn = (payload: FormData): Promise<string> => {
    return api.post(
      bulkOrderId
        ? API_ENDPOINT.UPDATE_DIRECT_SALE.replace('{id}', bulkOrderId)
        : API_ENDPOINT.CREATE_DIRECT_ORDER,
      payload,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
  };

  const query = useMutation({
    mutationKey: [QUERY_KEY_ENUM.CREATE_DIRECT_ORDER, bulkOrderId],
    mutationFn: apiFn,
    onSuccess: () => {
      customQueryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.ORDERS] });
      customQueryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.ORDER_DETAIL] });
    }
  });

  return query;
}
