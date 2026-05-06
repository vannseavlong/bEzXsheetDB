import axios, { AxiosError, type AxiosResponse } from 'axios';
import Cookies from 'node_modules/@types/js-cookie';
import { toast } from 'sonner';
import { API_ENDPOINT } from './endpoint';

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

if (!VITE_BASE_URL) {
  throw new Error('VITE_BASE_URL is not defined in environment variables.');
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipErrorHandler?: boolean;
  }
}

const api = axios.create({
  baseURL: VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    // const isLoginRequest = config.url?.includes('/login');
    // if (!token && !isLoginRequest) {
    //   return Promise.reject(new axios.Cancel('Redirected to login: No auth token'));
    // }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.data) {
      response.data = response.data.data;
    }
    return response.data;
  },
  async (error: AxiosError) => {
    if (!error.config?.skipErrorHandler) {
      toast.error(
        (error.response?.data as { message?: string })?.message || 'Something went wrong!'
      );
    }

    return Promise.reject(error);
  }
);

// === Export API functions ===
export const loginApi = (
  username: string,
  password: string,
  config?: import('axios').AxiosRequestConfig
): Promise<LoginResponseProps> => api.post(API_ENDPOINT.LOGIN, { username, password }, config);

export const meApi = (config?: import('axios').AxiosRequestConfig): Promise<UserResponseProps> =>
  api.get(API_ENDPOINT.PROFILE, config);
export const refreshToken = async (): Promise<string | null> => {
  try {
    const token = Cookies.get('token');
    if (!token) return null;

    const response = await axios.post(`${VITE_BASE_URL}/auth/refresh`, {
      refreshToken: token
    });

    const newAccessToken = response.data?.accessToken;
    if (newAccessToken) {
      Cookies.set('token', newAccessToken);
      return newAccessToken;
    }

    return null;
  } catch (err) {
    console.error('Failed to refresh token', err);
    return null;
  }
};
export const logoutApi = (): Promise<AxiosResponse<{ message: string }>> =>
  api.post<{ message: string }>(API_ENDPOINT.LOGOUT);

export default api;
