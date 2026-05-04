import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useCheckTopupPaymentStatusMutation() {
  const apiFn = (payload: { tranId: string; id: string }): Promise<string> => {
    return api.get(API_ENDPOINT.CHECK_TOPUP_PAYMENT_STATUS, payload);
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.CHECK_TOPUP_PAYMENT_STATUS],
    mutationFn: apiFn,
    onSuccess: () => {
      toast.success('Refreshed');
    }
  });
}
