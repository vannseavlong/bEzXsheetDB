import { useMutation } from '@tanstack/react-query';
import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';

export function useLoginMutation() {
  const mutationFn = async (payload: LoginRequest): Promise<LoginResponseProps> => {
    return api.post(API_ENDPOINT.AUTO_LOGIN, payload);
  };

  return useMutation({
    mutationFn
  });
}
