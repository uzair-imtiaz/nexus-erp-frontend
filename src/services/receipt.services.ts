import { responseMetadata } from "../apis/types";
import {
  deleteCallback,
  getCallback,
  postCallback,
  putCallback,
} from "../utils/network-helper";

export const createReceiptApi = async (payload): Promise<responseMetadata> => {
  const response: responseMetadata = await postCallback("/receipts", payload);
  return response;
};

export const getReceiptsApi = async (
  query?: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`/receipts${query}`);
  return response;
};

export const getReceiptApi = async (id: string): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`/receipts/${id}`);
  return response;
};

export const updateReceiptApi = async (
  id,
  payload
): Promise<responseMetadata> => {
  const response: responseMetadata = await putCallback(
    `/receipts/${id}`,
    payload
  );
  return response;
};

export const deleteReceiptApi = async (
  id: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await deleteCallback(`/receipts/${id}`);
  return response;
};

export const viewReceiptPdfApi = async (id: string): Promise<Blob> => {
  const response: Blob = await getCallback(`/receipts/${id}/view`, {
    responseType: "blob",
  });
  return response;
};

export const downloadReceiptPdfApi = async (id: string): Promise<Blob> => {
  const response: Blob = await getCallback(`/receipts/${id}/download`, {
    responseType: "blob",
  });
  return response;
};
