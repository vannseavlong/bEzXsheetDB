import { useMutation } from '@tanstack/react-query';
import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';

export type OrderSummaryResponse = {
  amount: number;
  amountDisplay: string;
  addOnAmount: number;
  addOnAmountDisplay: string;
  discount: number;
  discountDisplay: string;
  totalAmount: number;
  totalAmountDisplay: string;
  serviceFee: number;
  serviceFeeDisplay: string;
  transportFee: number;
  transportFeeDisplay: string;
  vatFee: number;
  vatFeeDisplay: string;
  totalPayableAmount: number;
  totalPayableAmountDisplay: string;
};
export type OrderSummaryPayload = {
  productOption: { id: number; qty: number };
  productAddOns?: { id: number; qty: number }[];
  pairOptions?: { id: number; qty: number }[];
};
export function useOrderSummaryMutation() {
  const mutationFn = async (payload: OrderSummaryPayload): Promise<OrderSummaryResponse> => {
    const response = await api.post(`${API_ENDPOINT.ORDER}/bulk/preview/summary`, payload);
    return response.data.data; // extract the "data" field from API
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.ORDER_SUMMARY, 'orderSummary'],
    mutationFn
  });
}
