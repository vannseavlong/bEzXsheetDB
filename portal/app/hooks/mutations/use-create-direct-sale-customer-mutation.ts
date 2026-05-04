import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';
import customQueryClient from '../use-custom-query-client';

type Props = {
  name: string;
  phone: string;
};

export default function useCreateDirectSaleCustomerMutation() {
  const apiFn = (payload: Props): Promise<string> => {
    return api.post(API_ENDPOINT.CREATE_DIRECT_SALE_CUSTOMER, payload);
  };

  const query = useMutation({
    mutationKey: [QUERY_KEY_ENUM.CREATE_DIRECT_SALE_CUSTOMER],
    mutationFn: apiFn,
    onSuccess: () =>
      customQueryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.CUSTOMER_TYPE_DIRECT_SALE] })
  });

  return query;
}
