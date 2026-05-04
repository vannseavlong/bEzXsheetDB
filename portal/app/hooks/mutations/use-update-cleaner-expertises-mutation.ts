import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';

export function useUpdateCleanerExpertisesMutation(id: string) {
  const apiFn = (cleanerExpertiseIds: string[]): Promise<string> => {
    return api.put(API_ENDPOINT.UPDATE_CLEANER_EXPERTISE.replace('{id}', id), {
      cleanerExpertiseIds
    });
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.UPDATE_CLEANER_EXPERTISE, id],
    mutationFn: apiFn,
    onSuccess: () => {}
  });
}
