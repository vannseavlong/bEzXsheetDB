import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

export default function useCategoryNamesQuery(
  isIncludeProduct?: boolean,
  isIncludeOption?: boolean,
  status?: boolean | 'all'
) {
  const apiFn = async (): Promise<CategoryAttributes[]> => {
    const res = await api.get<CategoryAttributes[]>(API_ENDPOINT.CATEGORIES_NAME, {
      params: {
        isIncludeProduct,
        isIncludeOption,
        status
      }
    });
    return res.map((item) => ({
      ...item,
      id: String(item.id),
      products: item.products?.map((p) => ({
        ...p,
        id: String(p.id),
        productOptionV2s: p.productOptionV2s?.map((o) => ({
          ...o,
          id: String(o.id)
        }))
      }))
    }));
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.CATEGORIES_NAME, isIncludeProduct, isIncludeOption, status],
    queryFn: apiFn
  });

  return query;
}
