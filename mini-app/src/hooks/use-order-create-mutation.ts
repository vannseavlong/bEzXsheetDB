import { useMutation } from '@tanstack/react-query';
import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { OrderCreateRequest, OrderCreateResponse } from '@/types/api';

export function useOrderCreateMutation() {
  const mutationFn = async (payload: OrderCreateRequest): Promise<OrderCreateResponse> => {
    return api.post(API_ENDPOINT.ORDER_CREATE, payload);
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.ORDER, 'orderCreate'],
    mutationFn
  });
}
