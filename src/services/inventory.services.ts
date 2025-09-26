import { responseMetadata } from "../apis/types";
import {
  deleteCallback,
  getCallback,
  postCallback,
  putCallback,
} from "../utils/network-helper";

interface Inventory {
  id: string;
  name: string;
  code: string;
  quantity: number;
  baseRate: number;
  sellingRate: number;
  category?: string;
  baseUnit: string;
  openingDate: string;
  amount: number;
  parentId?: string;
  multiUnits?: Record<string, number>;
}

export const getInventoryApi = async (
  query: string = ""
): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`inventory${query}`);
  return response;
};

export const createInventoryApi = async (
  payload: Partial<Inventory>
): Promise<responseMetadata> => {
  const response: responseMetadata = await postCallback(`inventory`, payload);
  return response;
};

export const updateInventoryApi = async (
  id: string,
  payload: Partial<Inventory>
): Promise<responseMetadata> => {
  const response: responseMetadata = await putCallback(
    `inventory/${id}`,
    payload
  );
  return response;
};

export const deleteInventoryApi = async (
  id: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await deleteCallback(`inventory/${id}`);
  return response;
};

export const getInventoryByIdApi = async (
  id: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`inventory/${id}`);
  return response;
};
