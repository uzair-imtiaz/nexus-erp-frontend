import { responseMetadata } from "../apis/types";
import {
  deleteCallback,
  getCallback,
  postCallback,
  putCallback,
} from "../utils/network-helper";

export const getPurchasesApi = async (query: string = "") => {
  const response: responseMetadata = await getCallback(`/purchases${query}`);
  return response;
};

export const getPurchaseApi = async (id: string): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`/purchases/${id}`);
  return response;
};

export const deletePurchaseApi = async (
  id: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await deleteCallback(`/purchases/${id}`);
  return response;
};

export const updatePurchaseApi = async (
  id,
  payload
): Promise<responseMetadata> => {
  const response: responseMetadata = await putCallback(
    `/purchases/${id}`,
    payload
  );
  return response;
};

export const addPurchaseApi = async (payload): Promise<responseMetadata> => {
  const response: responseMetadata = await postCallback("/purchases", payload);
  return response;
};
