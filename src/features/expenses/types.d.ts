import { Dayjs } from "dayjs";

export interface ExpenseRow {
  key: number;
  date: Dayjs;
  nominalAccount: {} | null;
  description: string;
  amount: number;
}

export interface Expense {
  id: string;
  createdAt: string;
  bank: { name: string } | null;
  totalAmount: number;
  description: string;
  details: ExpenseDetail[];
}

export interface ExpenseDetail {
  id: string;
  nominalAccount: { name: string } | null;
  amount: number;
  description: string;
}

export interface Filters {
  bank_id?: string;
  nominal_account_ids?: string[];
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs] | null;
  search?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
}
