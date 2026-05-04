import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';
import type { OrderDetail, OrderDetailApiResponse } from '@/types/api';

export default function useOrderDetailQuery(bulkOrderId?: string) {
  const queryFn = async (): Promise<OrderDetail | null> => {
    if (!bulkOrderId) return null;

    const res: OrderDetailApiResponse = await api.get(
      `${API_ENDPOINT.ORDER_DETAIL}/${bulkOrderId}`
    );

    return res ?? null;
  };

  return useQuery<OrderDetail | null>({
    queryKey: [QUERY_KEY_ENUM.ORDER, bulkOrderId],
    queryFn,
    enabled: !!bulkOrderId
  });
}
