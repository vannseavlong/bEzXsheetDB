import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { BannerAttributes } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export default function useBannerQuery() {
  const apiFn = (): Promise<BannerAttributes[]> => {
    return api.get(API_ENDPOINT.BANNER);
  };

  return useQuery({
    queryKey: [QUERY_KEY_ENUM.BANNER],
    queryFn: apiFn
  });
}
