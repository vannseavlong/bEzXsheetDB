import axios, { type AxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

const VITE_BASE_URL = import.meta.env.VITE_BASE_URL ?? 'http://localhost:3000';

const api = axios.create({
  baseURL: `${VITE_BASE_URL}/api/admin`,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => {
    if (response.data && response.data.data) {
      response.data = response.data.data;
    }
    return response.data;
  },
  (error) => {
    toast.error((error.response?.data as { message?: string })?.message ?? 'Something went wrong!');
    return Promise.reject(error);
  }
);

type ApiInstance = {
  get<T>(url: string, config?: unknown): Promise<T>;
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data?: unknown, config?: unknown): Promise<T>;
  delete<T>(url: string, config?: unknown): Promise<T>;
};

export default api as ApiInstance;
