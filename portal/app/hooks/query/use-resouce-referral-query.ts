import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

export default function useResouceReferralQuery() {
  const apiFn = (): Promise<string[]> => {
    return api.get(API_ENDPOINT.RESOUCE_REFERRAL);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.RESOUCE_REFERRAL],
    queryFn: apiFn
  });

  return query;
}
