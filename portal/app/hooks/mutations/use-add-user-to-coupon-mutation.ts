import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useAddUserToCouponMutation() {
  const apiFn = (payload: {
    couponId: string;
    users: {
      userId: string;
      qty: string;
    }[];
  }): Promise<Blob> => {
    return api.post(API_ENDPOINT.ADD_USER_TO_COUPON, payload);
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.ADD_USER_TO_COUPON],
    mutationFn: apiFn,
    onSuccess: () => {
      toast.success('Successfully');
    }
  });
}
