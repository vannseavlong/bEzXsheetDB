// CUSRTOMER_RATING_DETAILS

import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export default function useCustomerRatingQuery({ userId }: { userId?: string }) {
  const apiFn = (): Promise<CustomerRatingProps[]> => {
    return api.get(API_ENDPOINT.CUSRTOMER_RATING_DETAILS.replace('{id}', userId || ''));
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.CUSRTOMER_RATING_DETAILS, userId],
    queryFn: apiFn,
    placeholderData: keepPreviousData,
    enabled: false
  });

  return query;
}
