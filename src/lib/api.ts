import axios from "axios";
import { notification } from "antd";
import type { InternalAxiosRequestConfig } from "axios";

interface ApiErrorPayload {
  detail?: string;
  message?: string;
  error?: string;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "/",
  withCredentials: true,
});

export function getErrorMessage(error: unknown): string {
  const fallback = "Something went wrong. Please try again.";

  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    const data = error.response?.data;

    if (data?.detail) return data.detail;
    if (data?.message) return data.message;
    if (data?.error) return data.error;

    return error.response?.statusText || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function showError(error: unknown, title = "Error") {
  notification.error({
    message: title,
    description: getErrorMessage(error),
    placement: "topRight",
  });
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    showError(error);
    return Promise.reject(error);
  }
);

export default api;