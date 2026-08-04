import axios from "axios";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "./tokenRegistry";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

const AUTH_URLS = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  "/auth/logout",
];

let isRefreshing = false;
let refreshSubscribers = [];
const unauthorizedHandlers = [];

export const registerUnauthorizedHandler = (handler) => {
  unauthorizedHandlers.push(handler);
};

const notifyUnauthorized = () => {
  clearAccessToken();
  unauthorizedHandlers.forEach((handler) => handler());
};

const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const onRefreshFailed = () => {
  refreshSubscribers = [];
};

const refreshAccessToken = async () => {
  const envelope = await api.post("/auth/refresh-token");
  const token = envelope.data?.accessToken;
  if (token) {
    setAccessToken(token);
  }
  return token;
};

const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback);
};

const normalizeError = (error) => {
  const status = error.response?.status;
  const message =
    error.response?.data?.message ||
    (error.code === "ECONNABORTED" ? "Request timed out" : error.message) ||
    "Something went wrong";
  const errors = error.response?.data?.errors || [];
  const apiError = new Error(message);
  apiError.status = status;
  apiError.errors = errors;
  apiError.response = error.response;
  return apiError;
};

const isAuthEndpoint = (url) => AUTH_URLS.some((path) => url?.includes(path));

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            originalRequest._retry = true;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const token = await refreshAccessToken();
        onRefreshed(token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        onRefreshFailed();
        notifyUnauthorized();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

export default api;
