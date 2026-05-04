import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';
import customQueryClient from '../use-custom-query-client';

type Props = {
  userId: string;
  lastContactDate?: string;
  remark?: string;
};
export function useUpdateLastContactMutation() {
  const apiFn = (payload: Props): Promise<string> => {
    return api.post(API_ENDPOINT.CUSTOMER_LAST_CONTACT_DATE, {
      ...payload
    });
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.CUSTOMER_LAST_CONTACT_DATE],
    mutationFn: apiFn,
    onSuccess: () => {
      customQueryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.EXISTED_CUSTOMER] });
      // toast.success('Created successfully');
      // navigate(-1);
    }
  });
}
