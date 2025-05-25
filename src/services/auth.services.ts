import { responseMetadata } from "../apis/types";
import { postCallback } from "../utils/network-helper";

export const login = async (payload: any) => {
  const response: responseMetadata = await postCallback("/auth/login", payload);
  return response;
};

export const logout = async () => {
  const response: responseMetadata = await postCallback("/auth/logout");
  return response;
};

export const register = async (payload: any) => {
  const response: responseMetadata = await postCallback("/users", payload);
  return response;
};
