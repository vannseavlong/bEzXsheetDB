import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';

type Props = {
  contactDate?: string;
  description?: string;
  status?: string;
  categoryId?: string;
};
export function useUpdateCustomerServiceMutation(userId: string) {
  const apiFn = (payload: Props): Promise<string> => {
    return api.post(API_ENDPOINT.UPDATE_CUSTOMER_SERVICE, {
      ...payload,
      userId
    });
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.UPDATE_CUSTOMER_SERVICE],
    mutationFn: apiFn,
    onSuccess: () => {
      // toast.success('Created successfully');
      // navigate(-1);
    }
  });
}
