import { responseMetadata } from "../apis/types";
import { getCallback } from "../utils/network-helper";

export const getTrialBalanceReport = async (query?: string) => {
  const response: responseMetadata = await getCallback(
    `/reports/trial-balance${query}`
  );
  return response;
};

export const getJournalLedgerReport = async (query?: string) => {
  const response: responseMetadata = await getCallback(
    `/reports/journal-ledger${query}`
  );
  return response;
};

export const getProfitLossReport = async (query?: string) => {
  const response: responseMetadata = await getCallback(
    `/reports/profit-and-loss${query}`
  );
  return response;
};

export const getBalanceSheetReport = async (query?: string) => {
  const response: responseMetadata = await getCallback(
    `/reports/balance-sheet${query}`
  );
  return response;
};

export const getProductLedgerReport = async (query?: string) => {
  const response: responseMetadata = await getCallback(
    `/reports/product-ledger${query}`
  );
  return response;
};

export const getEntityLedgerReport = async (
  entityType: string,
  query?: string
) => {
  const response: responseMetadata = await getCallback(
    `/reports/${entityType}-ledger${query}`
  );
  return response;
};

export const getCustomerLedgerReport = async (query?: string) => {
  const response: responseMetadata = await getCallback(
    `/reports/customer-ledger${query}`
  );
  return response;
};

export const getVendorLedgerReport = async (query?: string) => {
  const response: responseMetadata = await getCallback(
    `/reports/vendor-ledger${query}`
  );
  return response;
};
