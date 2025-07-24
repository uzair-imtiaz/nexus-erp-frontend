import { responseMetadata } from "../apis/types";
import {
  deleteCallback,
  getCallback,
  postCallback,
  putCallback,
} from "../utils/network-helper";

export const getChartOfAccountsApi = async () => {
  const response: responseMetadata = await getCallback("/accounts");
  return response;
};

export const createAccountApi = async (payload: any) => {
  const response: responseMetadata = await postCallback("/accounts", payload);
  return response;
};

export const getAccountByTypeApi = async (type: string, query: string = "") => {
  const response: responseMetadata = await getCallback(
    `/accounts/${type}${query}`
  );
  return response;
};

export const getByTypeUnderTopLevel = async (
  topLevel: string,
  type: string
) => {
  const response = await getCallback(`/accounts/${topLevel}/${type}`);
  return response;
};

export const updateAccountApi = async (id: number, data: any) => {
  const response: responseMetadata = await putCallback(`/accounts/${id}`, data);
  return response;
};

export const deleteAccountApi = async (id: number) => {
  const response: responseMetadata = await deleteCallback(`/accounts/${id}`);
  return response;
};
