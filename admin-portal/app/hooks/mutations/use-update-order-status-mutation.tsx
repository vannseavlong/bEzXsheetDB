import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

const VITE_MINI_APP_BASE_URL = import.meta.env.VITE_MINI_APP_BASE_URL;

export function useUpdateOrderStatusMutation() {
  const apiFn = ({
    bulkOrderId,
    status,
    paymentMethod
  }: {
    bulkOrderId?: string;
    status?: 'ACCEPTED' | 'COMPLETED';
    paymentMethod: string;
  }): Promise<{ message: string }> =>
    api.put(
      API_ENDPOINT.UPDATE_ORDER_STATUS,
      {
        status,
        bulkOrderId
      },
      {
        baseURL:
          paymentMethod === 'aba_mini_app' ? `${VITE_MINI_APP_BASE_URL}/api/admin` : undefined
      }
    );

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.UPDATE_ORDER],
    mutationFn: apiFn,
    onSuccess: (res) => {
      toast.error(res?.message);
    }
  });
}
