import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';

export function useAddCleanerDetailMutation(
  onError?: (
    error: Error,
    variables: {
      bulkOrderId: string;
      cleanerId: string;
    },
    context: unknown
  ) => unknown
) {
  const apiFn = (payload: { bulkOrderId: string; cleanerId: string }): Promise<string> => {
    return api.post(API_ENDPOINT.ASSIGN_CLEANER, {
      ...payload
    });
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.ADD_CLEANER_DETAIL],
    mutationFn: apiFn,
    onError
  });
}
