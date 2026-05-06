import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { OrderListAttributes } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

type Props = {
  [key: string]: OrderListAttributes[];
};
export default function useOrderQuery() {
  const apiFn = (): Promise<Props> => {
    return api.get(`${API_ENDPOINT.ORDER_LIST}`);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.ORDER],
    queryFn: apiFn,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: 'always',
    placeholderData: (previousData) => previousData
  });

  return query;
}
