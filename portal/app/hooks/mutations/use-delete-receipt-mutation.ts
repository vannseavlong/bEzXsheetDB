import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import customQueryClient from '../use-custom-query-client';

export function useDeleteReceiptMutation() {
  const apiFn = ({ id }: { id: string }): Promise<{ message: string }> =>
    api.delete(API_ENDPOINT.DELETE_RECEIPT.replace('{id}', id), {});

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.DELETE_RECEIPT],
    mutationFn: apiFn,
    onSuccess: (res) => {
      toast.success(res?.message);
      customQueryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.ORDER_DETAIL] });
    }
  });
}
