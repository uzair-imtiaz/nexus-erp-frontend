import { responseMetadata } from "../apis/types";
import {
  deleteCallback,
  getCallback,
  postCallback,
  putCallback,
} from "../utils/network-helper";

export const getProductionsApi = async (
  query?: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`production${query}`);
  return response;
};

export const createProductionApi = async (
  payload: Record<string, any>
): Promise<responseMetadata> => {
  const response: responseMetadata = await postCallback(`production`, payload);
  return response;
};

export const changeProductionStatusApi = async (
  id: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await putCallback(
    `production/${id}/status`,
    {}
  );
  return response;
};

export const updateProductionApi = async (
  id: string,
  payload: Record<string, any>
): Promise<responseMetadata> => {
  const response: responseMetadata = await putCallback(
    `production/${id}`,
    payload
  );
  return response;
};

export const deleteProductionApi = async (
  id: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await deleteCallback(`production/${id}`);
  return response;
};

export const getProductionApi = async (
  id: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`production/${id}`);
  return response;
};
