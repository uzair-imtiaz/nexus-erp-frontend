import { responseMetadata } from "../apis/types";
import { deleteCallback, getCallback, postCallback, putCallback } from "../utils/network-helper";

export const getBanks = async () => {
    const response: responseMetadata = await getCallback("/banks");
    return response;
  };
  
  export const createBank = async (data: any) => {
    const response: responseMetadata = await postCallback("/banks", data);
    return response;
  };
  
  export const updateBank = async (id: number, data: any) => {
    const response: responseMetadata = await putCallback(`/banks/${id}`, data);
    return response;
  };
  
  export const deleteBank = async (id: number) => {
    const response: responseMetadata = await deleteCallback(`/banks/${id}`);
    return response;
  };