import { responseMetadata } from "../apis/types";
import {
  deleteCallback,
  getCallback,
  postCallback,
  putCallback,
} from "../utils/network-helper";

export const getCustomersApi = async (
  query?: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`customer${query}`);
  return response;
};

export const createCustomerApi = async (payload): Promise<responseMetadata> => {
  const response: responseMetadata = await postCallback(`customer`, payload);
  return response;
};

export const updateCustomerApi = async (
  id,
  payload
): Promise<responseMetadata> => {
  const response: responseMetadata = await putCallback(
    `customer/${id}`,
    payload
  );
  return response;
};

export const deleteCustomerApi = async (
  id: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await deleteCallback(`customer/${id}`);
  return response;
};

export const getCustomerApi = async (id: string): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`customer/${id}`);
  return response;
};
