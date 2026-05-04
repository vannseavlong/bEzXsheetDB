import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useUpdatePaymentStatusMutation(bulkOrderId: string) {
  const queryClient = useQueryClient();
  const apiFn = async ({
    image,
    status,
    paymentMethod
  }: {
    image?: File;
    status: string;
    paymentMethod?: string;
  }): Promise<Blob> => {
    const formData = new FormData();

    if (image) {
      formData.append('imgUrl', image);
    }
    formData.append('status', status);
    if (paymentMethod) {
      formData.append('paymentMethod', paymentMethod);
    }

    return api.post(API_ENDPOINT.MARK_AS_PAID.replace('{id}', bulkOrderId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.MARK_AS_PAID, bulkOrderId],
    mutationFn: apiFn,
    onSuccess: () => {
      toast.success('Successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.ORDER_DETAIL] });
    }
  });
}
