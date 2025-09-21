import { responseMetadata } from "../apis/types";
import {
  deleteCallback,
  getCallback,
  postCallback,
  putCallback,
} from "../utils/network-helper";

interface Customer {
  id: string;
  name: string;
  personName: string;
  address?: string;
  contactNumber?: string;
  code: string;
  email?: string;
  openingBalance: number;
  openingBalanceDate: string;
  status: boolean;
}

export const getCustomersApi = async (
  query: string = ""
): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`customer${query}`);
  return response;
};

export const createCustomerApi = async (
  payload: Partial<Customer>
): Promise<responseMetadata> => {
  const response: responseMetadata = await postCallback(`customer`, payload);
  return response;
};

export const updateCustomerApi = async (
  id: string,
  payload: Partial<Customer>
): Promise<responseMetadata> => {
  const response: responseMetadata = await putCallback(
    `customer/${id}`,
    payload
  );
  return response;
};

export const deleteCustomerApi = async (
  id: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await deleteCallback(`customer/${id}`);
  return response;
};

export const getCustomerApi = async (id: string): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`customer/${id}`);
  return response;
};

export const getCustomersWithTransactions = async (
  query: string = ""
): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(
    `customer/customers_open_transactions${query}`
  );
  return response;
};
