export type TransactorType = "vendor" | "customer";

export interface Transactor {
  code: string;
  id: string;
  name: string;
  type: TransactorType;
  contactPerson?: string;
  email?: string;
  contactNumber?: string;
  address?: string;
  openingBalance: number;
  openingBalanceDate: string;
  status: boolean;
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
  onSave: (entity: Transactor) => Promise<void>;
  onCancel: () => void;
}
