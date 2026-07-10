import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { EquipmentItem } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export default function useEquipmentQuery(categoryId?: string) {
  const apiFn = async (): Promise<EquipmentItem[]> => {
    return api.get(API_ENDPOINT.CATEGORY_ITEMS(categoryId ?? ''));
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.EQUIPMENT, categoryId],
    queryFn: apiFn,
    enabled: !!categoryId,
    retry: 2, // Retry failed requests
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  return query;
}
