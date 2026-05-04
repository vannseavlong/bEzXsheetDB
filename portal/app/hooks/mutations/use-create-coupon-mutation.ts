import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

type Props = {
  promoTextEn: string;
  promoTextKm: string;
  promoTextVi: string;
  promoTextTw: string;
  promoTextCn: string;
  maxRedeemAmount: number | undefined;
  maxRedeemPerPax: number | undefined;
  maxRedeemCount: number | undefined;
  maxRedeemCountPax: number | undefined;

  name: string;
  code: string;
  value: number;
  type: string;
  isNewUserOnly: boolean;
  users: {
    userId: number;
    qty: number;
  }[];
  targetUser: string;
  selectedProducts: number[];
  remark?: string;
  effectiveDate: string | undefined;
  expiredDate: string | undefined;
  transportFee: number;
  serviceFee: number;
};

export function useCreateCouponMutation(id?: string) {
  const navigate = useNavigate();

  const apiFn = (payload: Props): Promise<string> => {
    const tempPayload = {
      ...payload,
      selectedProducts: (payload.selectedProducts || []).map((item) => parseInt(`${item}`, 10))
    };
    if (id !== 'new') {
      return api.post(API_ENDPOINT.UPDATE_COUPON, {
        ...tempPayload,
        id,
        selectedProducts: (payload.selectedProducts || []).map((item) => parseInt(`${item}`, 10))
      });
    }

    return api.post(API_ENDPOINT.CREATE_COUPON, tempPayload);
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.CREATE_COUPON],
    mutationFn: apiFn,
    onSuccess: () => {
      toast.success('Created successfully');
      navigate(-1);
    }
  });
}
