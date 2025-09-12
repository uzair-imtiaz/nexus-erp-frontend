import { InventoryItem } from "../../../features/inventory/types";

export type TransactionType = "purchase" | "sale";

export interface TransactionItem {
  id: string;
  name: string;
  discount?: number;
  tax?: number;
  rate: number;
  buyingRate: number;
  quantity: number;
  unit: string;
}

export interface Transaction {
  id: string;
  date: string;
  entity?: TransactionItem;
  vendor?: { id: string; name: string };
  customer?: { id: string; name: string };
  amount: number;
  notes: string;
  totalAmount: number;
  inventories: InventoryItem[];
  type: "sale" | "sale-return" | "purchase" | "purchase-return";
}
