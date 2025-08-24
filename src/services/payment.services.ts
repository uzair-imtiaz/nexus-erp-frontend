import { responseMetadata } from "../apis/types";
import {
  deleteCallback,
  getCallback,
  postCallback,
  putCallback,
} from "../utils/network-helper";

export const createPaymentApi = async (payload): Promise<responseMetadata> => {
  const response: responseMetadata = await postCallback("/payments", payload);
  return response;
};

export const getPaymentsApi = async (
  query?: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`/payments${query}`);
  return response;
};

export const getPaymentApi = async (id: string): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`/payments/${id}`);
  return response;
};

export const updatePaymentApi = async (
  id,
  payload
): Promise<responseMetadata> => {
  const response: responseMetadata = await putCallback(
    `/payments/${id}`,
    payload
  );
  return response;
};

export const deletePaymentApi = async (
  id: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await deleteCallback(`/payments/${id}`);
  return response;
};

export const viewPaymentPdfApi = async (id: string): Promise<Blob> => {
  const response: Blob = await getCallback(`/payments/${id}/view`, {
    responseType: "blob",
  });
  return response;
};

export const downloadPaymentPdfApi = async (id: string): Promise<Blob> => {
  const response: Blob = await getCallback(`/payments/${id}/download`, {
    responseType: "blob",
  });
  return response;
};
