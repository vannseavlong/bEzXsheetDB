import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function useAddTopupMutation(id?: string) {
  const navigate = useNavigate();

  const apiFn = (payload: { userId: number; amount: number; remark: string }): Promise<string> => {
    return api.post(API_ENDPOINT.CREATE_TOPUP, {
      ...payload
    });
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.CREATE_TOPUP, id],
    mutationFn: apiFn,
    onSuccess: () => {
      toast.success('Topup successfully');
      navigate(-1);
    }
  });
}
