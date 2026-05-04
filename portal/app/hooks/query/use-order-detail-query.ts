import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

export default function useOrderDetailQuery(bulkOrderId?: string) {
  const queryFn = (): Promise<OrderListAttributes | null> => {
    return api.get(`${API_ENDPOINT.ORDER_DETAIL}/${bulkOrderId}/detail`);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.ORDER_DETAIL, bulkOrderId],
    queryFn,
    enabled: !!bulkOrderId
  });

  return query;
}
