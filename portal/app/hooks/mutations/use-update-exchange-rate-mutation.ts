import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';

type Props = {
  id: string;
  exchangeRate: string;
};
export function useUpdateExchangeRateMutation() {
  const apiFn = (payload: Props): Promise<string> => {
    return api.put(API_ENDPOINT.UPDATE_EXCHANGE_RATE.replace('{id}', payload.id), {
      exchangeRate: payload.exchangeRate
    });
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.UPDATE_EXCHANGE_RATE],
    mutationFn: apiFn,
    onSuccess: () => {
      // customQueryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.UPDATE_EXCHANGE_RATE] });
    }
  });
}
