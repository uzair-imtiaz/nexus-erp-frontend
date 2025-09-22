import { responseMetadata } from "../apis/types";
import {
  deleteCallback,
  getCallback,
  postCallback,
  putCallback,
} from "../utils/network-helper";

interface Bank {
  id: string;
  name: string;
  accountNumber: string;
  iban: string;
  code: string;
  currentBalance: number;
  openingDate: string;
}

export const getBanks = async (query?: string) => {
  const response: responseMetadata = await getCallback(`/banks${query ?? ""}`);
  return response;
};

export const createBank = async (data: Partial<Bank>) => {
  const response: responseMetadata = await postCallback("/banks", data);
  return response;
};

export const updateBank = async (id: string, data: Partial<Bank>) => {
  const response: responseMetadata = await putCallback(`/banks/${id}`, data);
  return response;
};

export const deleteBank = async (id: string) => {
  const response: responseMetadata = await deleteCallback(`/banks/${id}`);
  return response;
};
