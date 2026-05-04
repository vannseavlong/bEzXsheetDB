import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function useAddPaymentLinkMutation(id?: string) {
  const navigate = useNavigate();

  const apiFn = (payload: {
    title: string;
    type: string;
    amount: number;
    userId?: number;
    customData: {
      couponId: number;
      qty: number;
    }[];
  }): Promise<string> => {
    return api.post(API_ENDPOINT.ADD_PAYMENT_LINK, {
      ...payload
    });
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.ADD_PAYMENT_LINK, id],
    mutationFn: apiFn,
    onSuccess: () => {
      toast.success('Created successfully');
      navigate(-1);
    }
  });
}
