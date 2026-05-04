import { useMutation } from '@tanstack/react-query';
import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { OrderPreviewResponse } from '@/types/api';
// import type { pairProducts } from '@/types/api';

// export type ProductOption = {
//   id: number;
//   qty: number;
// };

// export type AddOnOption = {
//   id: number;
//   qty: number;
// };

export type OrderPreviewRequest = {
  paymentMethod: 'CASH' | 'CARD' | string; // adjust if you have enum
  productOption: {
    id: number;

    qty: number;
  };
  productAddOns?: {
    id: number;
    qty: number;
  }[];
  pairOptions?: {
    id: number;
    qty: number;
  }[];
  scheduleStartDate: string; // e.g. "2025-05-28 20:00:00"
  note?: string;
  couponCode?: string;
};

// export type OrderPreviewResponse = {
//   pairProducts: pairProducts[];
//   customerFirstName: string;
//   customerLastName: string;
//   customerPhone: string;
//   customerEmail: string;
//   amount: string;
//   discount: string;
//   totalAmount: string;
//   serviceFee: string;
//   transportFee: string;
//   vatFee: string;
//   totalPayableAmount: string;
//   paymentMethod: string;
//   scheduleStartDate: string;
//   note: string;
// };

export function useOrderPreviewMutation() {
  const mutationFn = async (payload: OrderPreviewRequest): Promise<OrderPreviewResponse> => {
    return api.post(API_ENDPOINT.ORDER_PREVIEW, payload);
  };
  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.ORDER, 'orderPreview'],
    mutationFn
  });
}
