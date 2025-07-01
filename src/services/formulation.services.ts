import { responseMetadata } from "../apis/types";
import {
  deleteCallback,
  getCallback,
  postCallback,
  putCallback,
} from "../utils/network-helper";

export const getFormulationsApi = async (
  query?: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`formulations${query}`);
  return response;
};

export const createFormulationApi = async (
  payload: Record<string, any>
): Promise<responseMetadata> => {
  const response: responseMetadata = await postCallback(
    `formulations`,
    payload
  );
  return response;
};

export const updateFormulationApi = async (
  id: string,
  payload: Record<string, any>
): Promise<responseMetadata> => {
  const response: responseMetadata = await putCallback(
    `formulations/${id}`,
    payload
  );
  return response;
};

export const deleteFormulationApi = async (
  id: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await deleteCallback(`formulations/${id}`);
  return response;
};

export const getFormulationApi = async (
  id: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`formulations/${id}`);
  return response;
};
