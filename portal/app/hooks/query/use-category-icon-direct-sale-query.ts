import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

type Props = {
  id: string;
  nameEn: string;
  iconUrl: string;
};

export default function useCategoryIconDirectSaleQuery() {
  const apiFn = async () => {
    const response = await api.get<Props[]>(API_ENDPOINT.CATEGORIES_NAME);
    const result = (response || []).reduce(
      (acc, item) => {
        acc[item.nameEn] = item?.iconUrl;
        return acc;
      },
      {} as Record<string, string>
    );
    return result;
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.PRODUCT_DIRECT_SALE],
    queryFn: apiFn,
    placeholderData: keepPreviousData
  });

  return query;
}
