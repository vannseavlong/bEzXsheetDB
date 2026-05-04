import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import customQueryClient from '../use-custom-query-client';

export type AddOrderAddOnItem = {
  id: string; // productAddOnId
  qty: number;
  orderId: string;
};

export type AddOrderAddOnPayload = {
  productAddOns: AddOrderAddOnItem[];
  imgUrl?: File | null;
};

export default function useAddOrderAddOnMutation() {
  const apiFn = ({ productAddOns, imgUrl }: AddOrderAddOnPayload) => {
    const formData = new FormData();
    productAddOns.forEach((item, idx) => {
      formData.append(`productAddOns[${idx}][orderId]`, item.orderId);
      formData.append(`productAddOns[${idx}][id]`, item.id);
      formData.append(`productAddOns[${idx}][qty]`, String(item.qty));
    });
    if (imgUrl) {
      formData.append('imgUrl', imgUrl);
    }
    return api.post<{ message?: string }>(API_ENDPOINT.ADD_ORDER_ADDON, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.ADD_ORDER_ADDON],
    mutationFn: apiFn,
    onSuccess: (res) => {
      toast.success(res?.message || 'Saved');
      customQueryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.ORDER_DETAIL] });
      customQueryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.ORDERS] });
    }
  });
}
