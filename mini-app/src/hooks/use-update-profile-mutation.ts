import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { updateProfileApi } from '@/api/api';
import useAuthStore from '@/hooks/store/use-auth-store';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';

// Persists profile edits (name/phone/email) to the customers sheet and reissues the
// token, so subsequent authenticated requests (e.g. order/create, which reads
// customer_phone off the JWT claim) see the update rather than a stale/empty value.
export function useUpdateProfileMutation() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.PROFILE, 'update'],
    mutationFn: (payload: UpdateProfileRequest) => updateProfileApi(payload),
    onSuccess: (response) => {
      Cookies.set('token', response.token, { expires: 30 });
      setUser(response.user);
    }
  });
}
