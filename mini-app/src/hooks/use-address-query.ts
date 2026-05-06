import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { AddressAttributes } from '@/types/api';
import { useQuery } from '@tanstack/react-query';

export default function useAddressQuery() {
  const apiFn = (): Promise<AddressAttributes[]> => {
    return api.get(API_ENDPOINT.ADDRESS_LIST);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.ADDRESS_LIST],
    queryFn: apiFn
  });

  return query;
}
