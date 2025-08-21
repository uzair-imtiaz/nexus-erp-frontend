import { getCallback } from "../utils/network-helper";

export const getCodeApi = async (query: string) => {
  const response: { data: { code: string } } = await getCallback(
    `/code${query}`
  );
  return response;
};
