import { ReactNode } from "react";

export interface NominalAccount {
  id: string;
  name: string;
  code: string;
  type: string;
}

export interface NominalAccountGroup {
  label: string | ReactNode;
  title: string;
  options: {
    label: string;
    value: string;
  }[];
}

export interface ApiError {
  message: string;
  errorFields?: { name: string[]; errors: string[] }[];
}

export interface JournalEntryRow {
  key: number;
  nominalAccount: string | null;
  project: string;
  description: string;
  debit: number;
  credit: number;
}

export interface Journal {
  id: string;
  date: string;
  ref: string;
  total: number;
  entries: JournalEntry[];
  description?: string;
  status?: "draft" | "posted" | "cancelled";
}

export interface JournalEntry {
  id: string;
  nominalAccount: { name: string; code: string } | null;
  debit: number;
  credit: number;
  description: string;
}

export interface Filters {
  nominal_ids?: string[];
  ref?: string;
  dateRange?: [dayjs.Dayjs, dayjs.Dayjs] | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
}
