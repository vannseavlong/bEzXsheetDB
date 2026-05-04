import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useRemoveUserFromCouponMutation() {
  const apiFn = (payload: { couponId?: string; userId: string }): Promise<Blob> => {
    return api.post(API_ENDPOINT.REMOVE_USER_FROM_COUPON, payload);
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.REMOVE_USER_FROM_COUPON],
    mutationFn: apiFn,
    onSuccess: () => {
      toast.success('Successfully');
    }
  });
}
