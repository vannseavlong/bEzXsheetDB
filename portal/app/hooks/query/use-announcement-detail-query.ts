import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

export default function useAnnouncementDetailQuery(id: string) {
  const apiFn = (): Promise<PushNotificationAttributes> => {
    return api.get(API_ENDPOINT.DETAIL_ANNOUNCEMENT.replace('{id}', id));
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.ANNOUNCEMENT_DETAIL, id],
    queryFn: apiFn,
    enabled: id !== 'new'
  });

  return query;
}
