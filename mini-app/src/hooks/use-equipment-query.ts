import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { EquipmentAttributes } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export default function useEquipmentQuery(categoryId?: string) {
  const apiFn = async (): Promise<EquipmentAttributes[]> => {
    console.log('Fetching equipment for categoryId:', categoryId);
    return api.get(`${API_ENDPOINT.EQUIPMENT}/${categoryId}/equipments`);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.EQUIPMENT, categoryId],
    queryFn: apiFn,
    enabled: !!categoryId,
    retry: 2, // Retry failed requests
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // console.log('Equipment query result:', {
  //   categoryId,
  //   isEnabled: !!categoryId,
  //   isLoading: query.isLoading,
  //   isError: query.isError,
  //   dataLength: query.data?.length || 0,
  //   actualData: query.data,
  //   error: query.error?.message || query.error
  // });

  return query;
}
