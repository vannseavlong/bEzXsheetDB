import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

type Props = {
  data: UpcomingOrderProps[];
};

export default function useUpcomingOrderQuery() {
  const queryFn = (): Promise<Props> => {
    return api.get(API_ENDPOINT.UPCOMING_ORDER);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.UPCOMING_ORDER],
    queryFn
  });

  return query;
}
