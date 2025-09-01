import { responseMetadata } from "../apis/types";
import {
  deleteCallback,
  getCallback,
  postCallback,
  putCallback,
} from "../utils/network-helper";

export const getVendorsApi = async (
  query?: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`vendor${query}`);
  return response;
};

export const createVendorApi = async (payload): Promise<responseMetadata> => {
  const response: responseMetadata = await postCallback(`vendor`, payload);
  return response;
};

export const updateVendorApi = async (
  id,
  payload
): Promise<responseMetadata> => {
  const response: responseMetadata = await putCallback(`vendor/${id}`, payload);
  return response;
};

export const deleteVendorApi = async (id: string) => {
  const response = await deleteCallback(`vendor/${id}`);
  return response;
};

export const getVendorApi = async (id: string): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`vendor/${id}`);
  return response;
};

export const getVendorsWithTransactions = async (
  query: string = ""
): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(
    `vendor/vendors_open_transactions${query}`
  );
  return response;
};
