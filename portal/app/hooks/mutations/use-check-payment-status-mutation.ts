import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';
import customQueryClient from '../use-custom-query-client';

export function useCheckPaymentStatusMutation() {
  const apiFn = (payload: { tranId: string; id: string }): Promise<string> => {
    return api.get(API_ENDPOINT.CHECK_PAYMENT_STATUS, {
      params: payload
    });
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.CHECK_PAYMENT_STATUS],
    mutationFn: apiFn,
    onSuccess: () => {
      customQueryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.PAYMENT_LINK] });
    }
  });
}
