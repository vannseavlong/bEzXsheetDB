import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

export default function useAnnouncementPageUrlQuery(type: string) {
  const apiFn = (): Promise<PageUrl[]> => {
    return api.get(API_ENDPOINT.ANNOUNCEMENT_PAGE_URLS, { params: { type } });
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.ANNOUNCEMENT_PAGE_URLS, type],
    queryFn: apiFn
  });

  return query;
}
