import Cookies from "js-cookie";
import { postCallback } from "./network-helper";

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

export const refreshAccessToken = async (): Promise<boolean> => {
  // Prevent multiple simultaneous refresh attempts
  if (isRefreshing && refreshPromise) {
    await refreshPromise;
    return !!Cookies.get("accessToken");
  }

  isRefreshing = true;

  try {
    refreshPromise = postCallback("/auth/refresh");
    const response = await refreshPromise;

    if (response.success) {
      // Token is automatically set via cookies by the backend
      return true;
    }

    return false;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

export const shouldRefreshToken = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = payload.exp - currentTime;

    // Refresh if token expires in less than 5 minutes
    return timeUntilExpiry < 300;
  } catch {
    return true;
  }
};
