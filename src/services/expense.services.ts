import { responseMetadata } from "../apis/types";
import {
  deleteCallback,
  getCallback,
  postCallback,
  putCallback,
} from "../utils/network-helper";

export const addExpenseApi = async (payload): Promise<responseMetadata> => {
  const response: responseMetadata = await postCallback("/expenses", payload);
  return response;
};

export const getExpensesApi = async (
  query?: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`/expenses${query}`);
  return response;
};

export const getExpenseApi = async (id: string): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`/expenses/${id}`);
  return response;
};

export const updateExpenseApi = async (
  id,
  payload
): Promise<responseMetadata> => {
  const response: responseMetadata = await putCallback(
    `/expenses/${id}`,
    payload
  );
  return response;
};

export const deleteExpenseApi = async (
  id: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await deleteCallback(`/expenses/${id}`);
  return response;
};
