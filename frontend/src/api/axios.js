import axios from "axios";
import {
  getToken,
  getRefresh,
  setAccessToken,
  removeToken,
} from "../utils/token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Добавляем access токен ко всем запросам
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Refresh логика
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refresh = getRefresh();

        if (!refresh) {
          removeToken();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}token/refresh/`,
          { refresh }
        );

        const newAccess = response.data.access;

        setAccessToken(newAccess);

        originalRequest.headers.Authorization =
          `Bearer ${newAccess}`;

        return api(originalRequest);
      } catch (refreshError) {
        removeToken();
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;