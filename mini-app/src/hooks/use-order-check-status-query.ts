import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { OrderStatusResponse } from '@/types/order-create';

interface UseOrderStatusMutationOptions {
  /** Called when payment is confirmed as PAID (state 5000) */
  onSuccess?: (data?: OrderStatusResponse) => void;
  /** Called when payment is still in-processing (state 3000) or shouldRetry=true */
  onPending?: (data?: OrderStatusResponse) => void;
  onFailed?: (data?: OrderStatusResponse) => void;
  onError?: (error: AxiosError) => void;
}

export function useOrderStatusMutation({
  onSuccess,
  onPending,
  onFailed,
  onError
}: UseOrderStatusMutationOptions) {
  const mutationFn = async (payload: {
    bulkOrderId: string;
    tranId: string;
  }): Promise<OrderStatusResponse> => {
    return api.get(
      API_ENDPOINT.ORDER_STATUS.replace(':bulkOrderId', payload.bulkOrderId).replace(
        ':tranId',
        payload.tranId
      ),
      { skipErrorHandler: true }
    );
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.ORDER, 'orderStatus'],
    mutationFn,
    onSuccess(data) {
      console.log('checkOrderStatus onSuccess: ', data);

      // Prefer explicit ABA state code; fall back to paymentStatus string
      const isPaid = data.state === 5000 || data.paymentStatus === 'PAID';
      const isInProcessing =
        data.state === 3000 || data.shouldRetry === true || data.paymentStatus === 'PENDING';

      if (isPaid) {
        onSuccess?.(data);
      } else if (isInProcessing) {
        onPending?.(data);
      } else {
        // Declined (1000), Not Found (2002), FAILED, and any other terminal state
        console.warn('Payment in non-retryable terminal state:', data.state, data.paymentStatus);
        onFailed?.(data);
      }
    },
    onError(error) {
      console.error('checkOrderStatus HTTP error:', error);
      // Only forward genuine AxiosErrors; log and swallow anything else unexpected
      if (error instanceof AxiosError) {
        onError?.(error);
      } else {
        console.error('Unexpected non-Axios error in checkOrderStatus:', error);
      }
    }
  });
}
