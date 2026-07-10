import { useQuery, useQueryClient } from '@tanstack/react-query';
import { meApi } from '@/api/api';
import useAuthStore from '@/hooks/store/use-auth-store';
import type { AxiosError } from 'axios';
import Cookies from 'js-cookie';

export const useAuth = () => {
  const { setUser, user } = useAuthStore((state) => state);
  const queryClient = useQueryClient();

  const token = Cookies.get('token');

  const { isLoading, error } = useQuery({
    enabled: Boolean(token && !user),
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const response = await meApi({ skipErrorHandler: true });
        Cookies.set('token', response.token, { expires: 30 });
        setUser(response.user);
        return response.user;
      } catch (err: unknown) {
        const axiosError = err as AxiosError;
        if (axiosError.response && axiosError.response.status === 401) {
          Cookies.remove('token');
          setUser(null);
          return null;
        }
        throw err;
      }
    }
  });

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    queryClient.removeQueries({ queryKey: ['currentUser'] });
  };

  return {
    user,
    isLoadingAuth: Boolean(token) && isLoading,
    authError: error?.message,
    isLoggedIn: !!user,
    logout
  };
};
