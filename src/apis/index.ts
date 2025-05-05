import {
  getCallback,
  postCallback,
  putCallback,
  deleteCallback,
} from "../utils/network-helper";
import { responseMetadata } from "./types";

export const getInventories = async (query?: string) => {
  const response: responseMetadata = await getCallback(`/inventory${query}`);
  return response;
};

export const createInventory = async (data: any) => {
  const response: responseMetadata = await postCallback("/inventory", data);
  return response;
};

export const getAccounts = async (type: string) => {
  const response: responseMetadata = await getCallback(`/accounts?type=${type}`);
  return response;
};

export const updateInventory = async (id: number, data: any) => {
  const response: responseMetadata = await putCallback(`/inventory/${id}`, data);
  return response;
};

export const deleteInventory = async (id: number) => {
  const response: responseMetadata = await deleteCallback(`/inventory/${id}`);
  return response;
};




