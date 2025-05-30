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
