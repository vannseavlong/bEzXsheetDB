import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { CategoryAddon } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export default function useCategoryAddonsQuery(categoryId?: string) {
  const apiFn = (): Promise<CategoryAddon[]> => {
    return api.get(API_ENDPOINT.CATEGORY_ADDONS(categoryId ?? ''));
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.CATEGORY_ADDONS, categoryId],
    queryFn: apiFn,
    enabled: !!categoryId
  });

  return query;
}
