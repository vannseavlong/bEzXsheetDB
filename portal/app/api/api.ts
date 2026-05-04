import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { API_ENDPOINT } from './endpoint';

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

if (!VITE_BASE_URL) {
  throw new Error('VITE_BASE_URL is not defined in environment variables.');
}
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}[];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const api = axios.create({
  baseURL: `${VITE_BASE_URL}/api/admin`,
  timeout: 120000, // 2 minutes
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    const isLoginRequest = config.url?.includes('/login');
    if (!token && !isLoginRequest) {
      Cookies.remove('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }

      return Promise.reject(new axios.Cancel('Redirected to login: No auth token'));
    }

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
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    const status = error.response?.status || 0;
    const isUnauthorized = status === 401;
    const isLogin = originalRequest.url?.includes('/login');

    if (isUnauthorized && !originalRequest._retry && !isLogin) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              if (originalRequest.headers)
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject
          });
        });
      }

      isRefreshing = true;

      try {
        const newToken = await refreshToken();

        if (!newToken) {
          Cookies.remove('token');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        }
        processQueue(null, newToken);

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    toast.error((error.response?.data as { message?: string })?.message || 'Something went wrong!');

    return Promise.reject(error);
  }
);

// === Export API functions ===
export const loginApi = (username: string, password: string): Promise<LoginResponseProps> =>
  api.post(API_ENDPOINT.LOGIN, { username, password });
export const meApi = (): Promise<{
  userInfo: UserResponseProps & { userId: number };
  permissions: Permission[];
}> => {
  return api.get(API_ENDPOINT.PROFILE);
};
export const refreshToken = async (): Promise<string | null> => {
  try {
    const token = Cookies.get('token');
    if (!token) return null;

    const response = await axios.post(`${VITE_BASE_URL}/api/admin/auth/refresh`, {
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

type ApiInstance = {
  get<T>(url: string, config?: unknown): Promise<T>;
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig<unknown>): Promise<T>;
  put<T>(url: string, data?: unknown, config?: unknown): Promise<T>;
  delete<T>(url: string, config?: unknown): Promise<T>;
};

export default api as ApiInstance;
