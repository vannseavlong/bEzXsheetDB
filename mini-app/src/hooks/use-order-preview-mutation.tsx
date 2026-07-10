import { useMutation } from '@tanstack/react-query';
import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { OrderPreviewRequest, OrderPreviewResponse } from '@/types/api';

export function useOrderPreviewMutation() {
  const mutationFn = async (payload: OrderPreviewRequest): Promise<OrderPreviewResponse> => {
    return api.post(API_ENDPOINT.ORDER_PREVIEW, payload);
  };
  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.ORDER, 'orderPreview'],
    mutationFn
  });
}
