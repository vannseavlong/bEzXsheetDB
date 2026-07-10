import { useMutation } from '@tanstack/react-query';
import { loginApi } from '@/api/api';

export function useLoginMutation() {
  return useMutation({
    mutationFn: (payload: LoginRequest): Promise<AuthResponseProps> => loginApi(payload)
  });
}
