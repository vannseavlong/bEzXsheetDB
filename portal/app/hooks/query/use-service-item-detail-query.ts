import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

export default function useServiceItemDetailQuery(id?: string) {
  const apiFn = (): Promise<ServiceItemAttributes> => {
    return api.get(API_ENDPOINT.SERVICE_ITEM_DETAIL.replace('{id}', id || ''));
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.SERVICE_ITEM_DETAIL, id],
    queryFn: apiFn,
    enabled: id !== 'new'
  });

  return query;
}
