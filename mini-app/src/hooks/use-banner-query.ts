import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { Banner } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export default function useBannerQuery() {
  const apiFn = (): Promise<Banner[]> => {
    return api.get(API_ENDPOINT.BANNER_LIST);
  };

  return useQuery({
    queryKey: [QUERY_KEY_ENUM.BANNER],
    queryFn: apiFn
  });
}
