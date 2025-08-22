import { responseMetadata } from "../apis/types";
import {
  deleteCallback,
  getCallback,
  postCallback,
  putCallback,
} from "../utils/network-helper";

export const getSalesApi = async (query?: string) => {
  const response: responseMetadata = await getCallback(`/sales${query}`);
  return response;
};

export const getSaleApi = async (id: string): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`/sales/${id}`);
  return response;
};

export const deleteSaleApi = async (id: string): Promise<responseMetadata> => {
  const response: responseMetadata = await deleteCallback(`/sales/${id}`);
  return response;
};

export const updateSaleApi = async (id, payload): Promise<responseMetadata> => {
  const response: responseMetadata = await putCallback(`/sales/${id}`, payload);
  return response;
};

export const addSaleApi = async (payload): Promise<responseMetadata> => {
  const response: responseMetadata = await postCallback("/sales", payload);
  return response;
};

export const getinvoiceApi = async (id: string): Promise<Blob> => {
  const response = await getCallback<Blob>(`/sales/${id}/invoice/view`, {
    responseType: "blob",
  });
  return response;
};

export const downloadInvoiceApi = async (id: string): Promise<Blob> => {
  const response = await getCallback<Blob>(`/sales/${id}/invoice/download`, {
    responseType: "blob",
  });
  return response;
};
