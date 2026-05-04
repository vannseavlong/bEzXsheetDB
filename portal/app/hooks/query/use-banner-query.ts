import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export default function useBannerQuery(type?: string, status?: string, searchText?: string) {
  const apiFn = (): Promise<BannerProps[]> => {
    const params: { type?: string; status?: string; searchText?: string } = {};
    if (type) {
      params.type = type;
    }
    if (status) {
      params.status = status;
    }
    if (searchText) {
      params.searchText = searchText;
    }
    return api.get(API_ENDPOINT.BANNERS, { params });
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.BANNERS, type, status, searchText],
    queryFn: apiFn,
    placeholderData: keepPreviousData,
    select: (data) => [...data].sort((a, b) => a.sort - b.sort)
  });

  return query;
}
