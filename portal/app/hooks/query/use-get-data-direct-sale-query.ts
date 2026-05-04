//

import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

export default function useGetDataDirectSaleQuery() {
  const apiFn = (): Promise<{
    products: ProductAttributes[];
    productOptionV2: ProductOptionsAttributes[];
  }> => {
    return api.get(API_ENDPOINT.GET_DATA_DIRECT_SALE);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.GET_DATA_DIRECT_SALE],
    queryFn: apiFn
  });

  return query;
}
