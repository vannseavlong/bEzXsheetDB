import { useMutation } from '@tanstack/react-query';
import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { CouponResponse } from '@/types/api';

export function useCouponMutation() {
  const mutationFn = async (code: string): Promise<CouponResponse> => {
    return api.post(API_ENDPOINT.COUPON_VALIDATE, { code });
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.COUPON],
    mutationFn
  });
}

export default useCouponMutation;
