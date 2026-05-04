import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { loginApi, logoutApi, meApi } from '@/api/api';
import type { SignInSchemaProps } from '@/lib/schema/signin-schema';
import { useNavigate } from 'react-router';
import useAuthStore from '@/store/auth-store';
import type { AxiosError } from 'axios';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { setUser, user } = useAuthStore((state) => state);
  const navigate = useNavigate();

  const { isLoading, isError, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const response = await meApi();

        const { userId, ...rest } = response.userInfo;
        console.log({ userId });
        setUser({ ...user, ...rest }, response.permissions);

        return response;
      } catch (err: unknown) {
        const axiosError = err as AxiosError;
        if (axiosError.response && axiosError.response.status === 401) {
          setUser(null, null);
          return null;
        }
        throw err;
      }
    }
  });

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async ({ username, password }: SignInSchemaProps) => {
      return await loginApi(username, password);
    },
    onSuccess: (data) => {
      // console.log(data);
      setUser(data.userInfo, data.permissions);
      Cookies.set('token', data.token, { expires: 30 });
      queryClient.invalidateQueries({
        queryKey: ['currentUser']
      });
      navigate('/');
    },
    onError: (err) => {
      console.error('Login mutation error:', err);
    }
  });

  const logoutMutation = useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => {
      return await logoutApi();
    },
    onSuccess: () => {
      setUser(null, null);
      queryClient.invalidateQueries({
        queryKey: ['currentUser']
      });
      queryClient.removeQueries({
        queryKey: ['currentUser']
      });
    },
    onError: (err) => {
      console.error('Logout mutation error:', err);

      setUser(null, null);
    }
  });

  return {
    user,
    isLoadingAuth: isLoading,
    authError: isError ? error.message : null,
    isLoggedIn: !!user,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    loginLoading: loginMutation.isPending,
    loginError: loginMutation.isError ? loginMutation.error?.message : null
  };
};
