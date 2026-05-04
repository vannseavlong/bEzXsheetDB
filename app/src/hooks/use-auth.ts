import { useQuery } from '@tanstack/react-query';
import { meApi } from '@/api/api';
import useAuthStore from '@/hooks/store/use-auth-store';
import type { AxiosError } from 'axios';
import { useLoginMutation } from './use-login-mutation';
import { useEffect } from 'react';
import type { GetProfile } from '@/types/aba-bridge';
import * as pkg from 'web-bridge-gateway';
import Cookies from 'js-cookie';
import i18next from 'i18next';
const { callHandler } = pkg;

const ABA_LANG_TO_LOCALE: Record<string, string> = {
  en: 'en',
  km: 'km',
  kh: 'km',
  vi: 'vi',
  tw: 'tw',
  cn: 'cn',
  zh: 'zh'
};

export const useAuth = () => {
  const { setUser, user } = useAuthStore((state) => state);

  const { data: loginRes, mutate, error: errLogin, isPending } = useLoginMutation();

  useEffect(() => {
    // console.log('callHandler: ', callHandler('getProfile'));
    callHandler('getProfile')
      .then((data: GetProfile) => {
        console.log('getProfile data: ', data);
        const localeKey = ABA_LANG_TO_LOCALE[data.lang] || 'en';
        i18next.changeLanguage(localeKey);
        document.documentElement.lang = localeKey;

        mutate({
          username: data.phone,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          dob: data.dobFull,
          abaProfile: data
        });
      })
      .catch((err) => {
        console.log('catch: ', err);
        alert(err.message);
      })
      .finally(() => {
        console.log('finally');
      });
  }, [mutate]);

  useEffect(() => {
    if (loginRes) {
      Cookies.set('token', loginRes.token, { expires: 30 });
      setUser(loginRes.userInfo);
    }
  }, [setUser, loginRes]);

  const token = Cookies.get('token');

  const { isLoading, error } = useQuery({
    enabled: Boolean(token && !user),
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const response = await meApi({ skipErrorHandler: true });

        setUser({ ...user, ...response });

        return response;
      } catch (err: unknown) {
        const axiosError = err as AxiosError;
        if (axiosError.response && axiosError.response.status === 401) {
          setUser(null);
          return null;
        }
        throw err;
      }
    }
  });

  return {
    user,
    isLoadingAuth: isLoading || isPending,
    authError: errLogin?.message || error?.message,
    isLoggedIn: !!user
  };
};
