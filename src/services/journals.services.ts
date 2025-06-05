import { responseMetadata } from "../apis/types";
import {
  deleteCallback,
  getCallback,
  postCallback,
  putCallback,
} from "../utils/network-helper";

export const addJournalApi = async (payload): Promise<responseMetadata> => {
  const response: responseMetadata = await postCallback("/journals", payload);
  return response;
};

export const getJournalsApi = async (
  query?: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`/journals${query}`);
  return response;
};

export const getJournalApi = async (id: string): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`/journals/${id}`);
  return response;
};

export const updateJournalApi = async (
  id,
  payload
): Promise<responseMetadata> => {
  const response: responseMetadata = await putCallback(
    `/journals/${id}`,
    payload
  );
  return response;
};

export const deleteJournalApi = async (
  id: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await deleteCallback(`/journals/${id}`);
  return response;
};
