import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export default function useBannerDetailQuery(
  id: number,
  options?: Omit<
    UseQueryOptions<BannerProps, Error, BannerProps, [string, number]>,
    'queryKey' | 'queryFn'
  >
) {
  const apiFn = (): Promise<BannerProps> => {
    const endpoint = API_ENDPOINT.BANNER_DETAIL.replace('{id}', id.toString());
    return api.get(endpoint);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.BANNER_DETAIL, id],
    queryFn: apiFn,
    ...options
  });

  return query;
}
