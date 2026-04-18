import axios from "axios";
import { toast } from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_BASE || "https://chaibackened12.onrender.com/api/v1";

export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

let refreshPromise = null;

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;
    const hasAccessToken = Boolean(localStorage.getItem("accessToken"));
    const isRefreshCall = originalRequest?.url?.includes("/users/refreshToken");

    if (status === 401 && !originalRequest?._retry && hasAccessToken && !isRefreshCall) {
      originalRequest._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = http.post("/users/refreshToken").finally(() => {
            refreshPromise = null;
          });
        }
        const refreshResponse = await refreshPromise;
        const nextToken = refreshResponse?.data?.data?.accessToken;
        if (nextToken) {
          localStorage.setItem("accessToken", nextToken);
          originalRequest.headers.Authorization = `Bearer ${nextToken}`;
          return http(originalRequest);
        }
      } catch {
        localStorage.removeItem("accessToken");
      }
    }

    const message =
      error?.response?.data?.message || error?.message || "Request failed";
    if (status >= 500) {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);
