import axios, { AxiosError } from 'axios';
import { notification } from 'antd';

export const api = axios.create({
  baseURL:
    // Prefer BACKEND_URL if provided; fall back to API_URL or root
    (import.meta as any).env?.VITE_BACKEND_URL ||
    (import.meta as any).env?.VITE_API_URL ||
    '/',
  withCredentials: true,
});

export function getErrorMessage(error: unknown): string {
  const fallback = 'Something went wrong. Please try again.';

  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<any>;
    const data = err.response?.data;
    if (data) {
      if (typeof data.detail === 'string') return data.detail;
      if (typeof data.message === 'string') return data.message;
      if (typeof data.error === 'string') return data.error;
    }
    return err.response?.statusText || err.message || fallback;
  }

  if (typeof (error as any)?.message === 'string') {
    return (error as any).message as string;
  }

  return fallback;
}

export function showError(error: unknown, title = 'Error') {
  const description = getErrorMessage(error);
  notification.error({
    message: title,
    description,
    placement: 'topRight',
  });
}

// Attach Authorization header from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers = config.headers || {};
    if (!('Authorization' in config.headers)) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // Auto-show error notification using backend `{ detail: string }` shape
    showError(error);
    return Promise.reject(error);
  }
);

export default api;
