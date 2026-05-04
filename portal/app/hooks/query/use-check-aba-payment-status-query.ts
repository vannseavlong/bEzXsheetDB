import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

export default function useCheckABAPaymentQuery({ tranId }: { tranId?: string }) {
  const apiFn = (): Promise<{
    data: ABAPaymentCheckProps;
    status: { code: string; message: string; tran_id: string };
  }> => {
    return api.get(API_ENDPOINT.ABA_PAYMENT_STATUS, {
      params: {
        tranId
      }
    });
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.ABA_PAYMENT_STATUS, tranId],
    queryFn: apiFn,
    enabled: false
  });

  return query;
}
