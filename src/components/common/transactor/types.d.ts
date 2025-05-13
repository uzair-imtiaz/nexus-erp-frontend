export type TransactorType = "vendor" | "customer";

export interface Transactor {
  id: string;
  name: string;
  type: TransactorType;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  openingBalance: number;
  currentBalance: number;
  asOfDate: string;
}

export interface ViewTransactorModalProps {
  visible: boolean;
  entity: Transactor | null;
  onClose: () => void;
}

export interface TransactorFormModalProps {
  visible: boolean;
  entity: Transactor | null;
  type: TransactorType;
  onSave: (entity: Transactor) => void;
  onCancel: () => void;
}
