import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

type Props = {
  data: OtpAttributes[];
  pagination: PaginationProps;
};

export default function useOTPQuery(status?: string) {
  const apiFn = (): Promise<Props> => {
    let params = {};
    if (status) {
      params = {
        ...params,
        status
      };
    }
    return api.get(API_ENDPOINT.OTP, {
      params
    });
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.OTP],
    queryFn: apiFn
  });

  return query;
}
