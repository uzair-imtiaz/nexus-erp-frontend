import { responseMetadata } from "../apis/types";
import { buildQueryString } from "../utils";
import { getCallback } from "../utils/network-helper";

export interface StatValue {
  value: number;
  change: string;
}

export interface BusinessStats {
  inventory: StatValue;
  sales: StatValue;
  production: StatValue;
  profit: StatValue;
}

export interface Transaction {
  id: string;
  date: Date;
  description: string;
  amount: number;
  type: "Sale" | "Purchase" | "Expense" | "Payment" | "Receipt";
}

export interface ExpenseBreakdown {
  category: string;
  value: number;
  color: string;
  percentage: number;
}

export interface IncomeExpenseChart {
  month: string;
  income: number;
  expenses: number;
  profit: number;
}

export interface AgingBucket {
  count: number;
  amount: number;
}

export interface AccountsAging {
  totalOutstanding: number;
  buckets: {
    current: AgingBucket;
    days1to30: AgingBucket;
    days31to60: AgingBucket;
    daysOver60: AgingBucket;
  };
}

export interface ChartFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
}

export interface TransactionFilters {
  limit?: number;
  type?: string;
  status?: string;
}

// Dashboard API Services
export const getDashboardSummaryApi = async (): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`dashboard/summary`);
  return response;
};

export const getExpensesBreakdownApi = async (
  filters?: ChartFilters
): Promise<responseMetadata> => {
  const query = buildQueryString(filters || {});
  const response: responseMetadata = await getCallback(
    `dashboard/charts/expenses-breakdown${query}`
  );
  return response;
};

export const getIncomeVsExpensesApi = async (
  filters?: ChartFilters
): Promise<responseMetadata> => {
  const query = buildQueryString(filters || {});
  const response: responseMetadata = await getCallback(
    `dashboard/charts/income-vs-expenses${query}`
  );
  return response;
};

export const getRecentTransactionsApi = async (
  filters?: TransactionFilters
): Promise<responseMetadata> => {
  const query = buildQueryString(filters || {});
  const response: responseMetadata = await getCallback(
    `dashboard/recent-transactions${query}`
  );
  return response;
};

export const getAccountsReceivableApi = async (): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(
    `dashboard/accounts-receivable`
  );
  return response;
};

export const getAccountsPayableApi = async (): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(
    `dashboard/accounts-payable`
  );
  return response;
};
