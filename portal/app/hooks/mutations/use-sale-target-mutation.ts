import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useSaleTargetMutation() {
  const apiFn = (saleTarget: string): Promise<{ saleTarget: string }> => {
    return api.put(API_ENDPOINT.SALE_TARGET, {
      saleTarget
    });
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.SALE_TARGET],
    mutationFn: apiFn,
    onSuccess: () => {
      toast.success('successfully');
    }
  });
}
