export interface Account {
  id: number;
  name: string;
  code?: string;
  parentId?: string;
  children?: Account[];
  creditAmount?: number;
  debitAmount?: number;
  type?: string;
  systemGenerated?: boolean;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}
