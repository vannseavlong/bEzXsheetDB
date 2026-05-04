import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import customQueryClient from '../use-custom-query-client';

const VITE_MINI_APP_BASE_URL = import.meta.env.VITE_MINI_APP_BASE_URL;

type Props = {
  data: PushNotificationAttributes[];
  pagination: PaginationProps;
};

export default function useCancelOrderMutation() {
  const apiFn = (payload: { bulkOrderId: string; paymentMethod: string }): Promise<Props> => {
    return api.post(API_ENDPOINT.CANCEL_ORDER.replace('{id}', payload.bulkOrderId), undefined, {
      baseURL:
        payload.paymentMethod === 'aba_mini_app' ? `${VITE_MINI_APP_BASE_URL}/api/admin` : undefined
    });
  };

  const query = useMutation({
    mutationKey: [QUERY_KEY_ENUM.CANCEL_ORDER],
    mutationFn: apiFn,
    onSuccess: () => {
      toast.success('Cancelled with Refunded');
      customQueryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ENUM.ORDERS]
      });
      customQueryClient.invalidateQueries({
        queryKey: [QUERY_KEY_ENUM.ORDER_DETAIL]
      });
      // navigate(-1);
    }
  });

  return query;
}
