import { responseMetadata } from "../apis/types";
import { postCallback } from "../utils/network-helper";

export const login = async (payload: any) => {
  const response: responseMetadata = await postCallback("/auth/login", payload);

  // The backend sets cookies automatically, but we can also store additional data if needed
  if (response.success && response.data) {
    // Optionally store user data in localStorage for quick access
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }

  return response;
};

export const logout = async () => {
  const response: responseMetadata = await postCallback("/auth/logout");

  // Clear local storage and cookies
  localStorage.removeItem("user");
  localStorage.removeItem("user_permissions_cache");

  return response;
};

export const register = async (payload: any) => {
  const response: responseMetadata = await postCallback("/users", payload);
  return response;
};
