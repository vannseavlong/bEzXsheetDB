import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

type Props = {
  id: string;
  remark: string;
  lastContactDate: string;
  createdAt: string;
  customerService: {
    firstName: string;
    lastName: string;
  };
}[];
export function useLastContactDateQuery(userId: string) {
  const apiFn = (): Promise<Props> => {
    return api.get(`${API_ENDPOINT.CUSTOMER_LAST_CONTACT_DATE}${userId}`);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.CUSTOMER_LAST_CONTACT_DATE, userId],
    queryFn: apiFn
  });

  return query;
}
