export type TransactionType = "purchase" | "sale";

export interface TransactionItem {
  id: string;
  // name: string;
  discount?: number;
  tax?: number;
  rate: number;
  quantity: number;
  unit: string;
}

export interface Transaction {
  id: string;
  date: string;
  entity: TransactionItem;
  amount: number;
  notes: string;
  totalAmount: number;
  items: any[];
  type: "sale" | "sale-return" | "purchase" | "purchase-return";
}
