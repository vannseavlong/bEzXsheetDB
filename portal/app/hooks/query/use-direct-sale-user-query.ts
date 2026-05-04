import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import customQueryClient from '../use-custom-query-client';

export function useDirectSaleUserQuery() {
  const apiFn = (): Promise<{ users: UserAttributes[]; resellers: UserAttributes[] }> => {
    return api.get(API_ENDPOINT.DIRECT_SALE_USERS);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.DIRECT_SALE_USERS],
    queryFn: apiFn
  });

  return query;
}

export function useDirectSaleUsersAddressQuery({ userId }: { userId: string }) {
  const apiFn = (): Promise<AddressAttributes[]> => {
    return api.get(API_ENDPOINT.DIRECT_SALE_USERS_ADDRESS, {
      params: { userId }
    });
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.DIRECT_SALE_USERS_ADDRESS, userId],
    queryFn: apiFn,
    enabled: !!userId
  });

  return query;
}

export function useAddDirectSaleUsersAddressMutation() {
  const apiFn = (payload: {
    id?: string;
    address: string;
    addressDetail: string;
    latitude: string;
    longitude: string;
    userId: string;
  }): Promise<string> => {
    return api.post(API_ENDPOINT.ADD_DIRECT_SALE_USERS_ADDRESS, {
      ...payload
    });
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.ADD_DIRECT_SALE_USERS_ADDRESS],
    mutationFn: apiFn,
    onSuccess: () => {
      toast.success('Created successfully');
      customQueryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.DIRECT_SALE_USERS_ADDRESS] });
    }
  });
}

export function useExpendMapShortLinkMutation() {
  const apiFn = (payload: { shortUrl: string }): Promise<string> => {
    return api.post(API_ENDPOINT.EXPEND_SHORT_LINK, {
      ...payload
    });
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.DIRECT_SALE_USERS_ADDRESS],
    mutationFn: apiFn
  });
}
