export interface NominalAccount {
  label: string;
  value: string;
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
  journal_id: string;
  date: string;
  ref_no: string;
  total: number;
  entries: JournalEntry[];
  description?: string;
  status?: "draft" | "posted" | "cancelled";
}

export interface JournalEntry {
  id: string;
  nominal_account: { name: string; code: string } | null;
  debit: number;
  credit: number;
  description: string;
}

export interface Filters {
  nominal_ids?: string[];
  ref_no?: string;
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
