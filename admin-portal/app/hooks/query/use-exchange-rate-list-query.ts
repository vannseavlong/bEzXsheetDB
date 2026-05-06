import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

type Props = {
  data: ExchangeRateListAttributes[];
  pagination: PaginationProps;
};

export default function useExchangeRateListQuery() {
  const apiFn = (): Promise<Props> => {
    return api.get(API_ENDPOINT.EXCHANGE_RATE_LIST);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.EXCHANGE_RATE_LIST],
    queryFn: apiFn
  });

  return query;
}
