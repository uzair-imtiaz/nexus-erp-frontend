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
