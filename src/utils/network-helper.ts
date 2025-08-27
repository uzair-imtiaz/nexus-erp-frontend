import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import axiosRetry from "axios-retry";
import Cookies from "js-cookie";
import { redirectToLogin } from ".";
import { refreshAccessToken, shouldRefreshToken } from "./token-refresh";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? `${import.meta.env.VITE_APP_API_URL}/api`
      : "http://localhost:3001/api",
  timeout: 35000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔁 Retry failed requests (network errors, 5xx)
axiosRetry(axiosInstance, {
  retries: 3,
  retryDelay: (retryCount) => {
    return retryCount * 1000;
  },
  retryCondition: (error) => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.code === "ECONNABORTED" ||
      error.message === "Network Error"
    );
  },
});

// 🛠 Inject token into headers
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = Cookies.get("accessToken");

    // Check if token needs refresh before making the request
    if (token && shouldRefreshToken(token)) {
      await refreshAccessToken();
    }

    const currentToken = Cookies.get("accessToken");
    if (currentToken && config.headers) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }

    const tenantId = Cookies.get("tenantId");
    if (tenantId) {
      config.headers["x-tenant-id"] = tenantId;
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`[Axios → ${config.method?.toUpperCase()}]: ${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🚫 Global error handling
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const { response, config } = error;

    if (response?.status === 401) {
      // Try to refresh token once
      if (!config._retry) {
        config._retry = true;
        const refreshed = await refreshAccessToken();

        if (refreshed) {
          // Retry the original request with new token
          const token = Cookies.get("accessToken");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return axiosInstance(config);
        }
      }

      // If refresh failed or this is a retry, redirect to login
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("tenantId");
      redirectToLogin();
      return Promise.resolve({
        success: false,
        message: "Unauthorized",
      });
    }

    if (response?.status === 403) {
      return Promise.resolve({
        success: false,
        message: "Forbidden",
      });
    }

    return Promise.reject(error);
  }
);

// 🔁 Merge default headers with custom config
const mergeConfig = (custom: AxiosRequestConfig = {}): AxiosRequestConfig => ({
  ...custom,
  headers: {
    "Content-Type": "application/json",
    // ...axiosInstance.defaults.headers,
    // ...custom.headers,
  },
});

// 📦 GET
const getCallback = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await axiosInstance.get<T>(url, {
    ...mergeConfig(config),
    responseType: config?.responseType || "json",
  });
  return response.data;
};

// 📤 POST
const postCallback = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await axiosInstance.post<T>(url, data, mergeConfig(config));
  return response.data;
};

// 📝 PUT
const putCallback = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await axiosInstance.put<T>(url, data, mergeConfig(config));
  return response.data;
};

const patchCallback = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await axiosInstance.patch<T>(url, data, mergeConfig(config));
  return response.data;
};

// ❌ DELETE
const deleteCallback = async <T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await axiosInstance.delete<T>(url, mergeConfig(config));
  return response.data;
};

export {
  axiosInstance,
  getCallback,
  postCallback,
  putCallback,
  deleteCallback,
  patchCallback,
};
