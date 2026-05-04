import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

export function useCleanersQuery(status?: 1 | 0) {
  const apiFn = (): Promise<CleanerAttributes[]> => {
    return api.get(API_ENDPOINT.CLEANERS, {
      params: {
        status
      }
    });
  };
  return useQuery({
    queryKey: [QUERY_KEY_ENUM.CLEANERS],
    queryFn: apiFn
  });
}

export function useCleanerDetailQuery(id?: string) {
  const apiFn = (): Promise<CleanerAttributes> => {
    return api.get(API_ENDPOINT.CLEANER_DETAIL.replaceAll('{id}', id || ''));
  };

  return useQuery({
    queryKey: [QUERY_KEY_ENUM.CLEANER_DETAIL, id],
    queryFn: apiFn,
    enabled: !!id && id !== 'new'
  });
}
