import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { CONSTANTS } from '@/constants/constants';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

type Props = {
  data: CustomerAttributes[];
  pagination: PaginationProps;
};

export default function useAnnouncementUsersQuery(id: string, currentPage: number) {
  const apiFn = (): Promise<Props> => {
    return api.get(API_ENDPOINT.ANNOUNCEMENT_USERS.replace('{id}', id), {
      params: {
        page: currentPage + 1,
        limit: CONSTANTS.LIMIT_PER_PAGE
      }
    });
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.ANNOUNCEMENT_USERS, id, currentPage],
    queryFn: apiFn,
    enabled: id !== 'new'
  });

  return query;
}
