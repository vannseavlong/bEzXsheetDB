import { useMutation } from '@tanstack/react-query';
import { registerApi } from '@/api/api';

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (payload: RegisterRequest): Promise<AuthResponseProps> => registerApi(payload)
  });
}
