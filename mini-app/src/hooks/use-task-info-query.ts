import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { TaskInfo } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export default function useTaskInfoQuery(categoryId?: string, productId?: string) {
  const apiFn = (): Promise<TaskInfo[]> => {
    return api.get(API_ENDPOINT.CATEGORY_TASK_INFO(categoryId ?? ''), {
      params: productId ? { productId } : undefined
    });
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.TASK_INFO, categoryId, productId],
    queryFn: apiFn,
    enabled: !!categoryId
  });

  return query;
}
