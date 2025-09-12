export interface Receipt {
  id: string;
  date: string;
  amount: number;
  notes?: string;
  bank: {
    id: string;
    name: string;
  };
  customer: {
    id: string;
    name: string;
    advanceBalance: number;
  };
  transactions?: ReceiptTransaction[];
}

export interface Payment {
  id: string;
  date: string;
  amount: number;
  notes?: string;
  bank: {
    id: string;
    name: string;
  };
  vendor: {
    id: string;
    name: string;
    advanceBalance: number;
  };
  transactions?: PaymentTransaction[];
}

export interface ReceiptTransaction {
  id: string;
  amount: number;
  discount: number;
  outstandingBalance: number;
  saleId?: string;
  sale?: {
    id: string;
    date: string;
    totalAmount: number;
  };
}

export interface PaymentTransaction {
  id: string;
  amount: number;
  discount: number;
  outstandingBalance: number;
  purchaseId?: string;
  purchase?: {
    id: string;
    date: string;
    totalAmount: number;
  };
}
