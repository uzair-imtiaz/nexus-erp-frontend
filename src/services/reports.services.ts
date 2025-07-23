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
