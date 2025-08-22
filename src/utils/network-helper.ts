import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import axiosRetry from "axios-retry";
import Cookies from "js-cookie";
import { redirectToLogin } from ".";

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
  (config) => {
    const token = Cookies.get("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
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
  (error) => {
    const { response } = error;
    if (response?.status === 401 || response?.status === 403) {
      Cookies.remove("accessToken");
      Cookies.remove("tenant");
      redirectToLogin();
      return Promise.resolve({
        success: false,
        message: "Unauthorized",
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
};
