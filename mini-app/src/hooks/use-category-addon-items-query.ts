import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { CategoryAddonItem } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export default function useCategoryAddonItemsQuery(addonId?: string | null) {
  const apiFn = (): Promise<CategoryAddonItem[]> => {
    return api.get(API_ENDPOINT.CATEGORY_ADDON_ITEMS(addonId ?? ''));
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.CATEGORY_ADDON_ITEMS, addonId],
    queryFn: apiFn,
    enabled: !!addonId
  });

  return query;
}
