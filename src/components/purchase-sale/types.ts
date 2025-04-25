export type TransactionType = 'purchase' | 'sale';

export type TransactionStatus = 'pending' | 'completed' | 'cancelled';

export interface Entity {
  id: string;
  name: string;
  type: 'vendor' | 'customer';
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Raw Material' | 'Finished Goods';
  baseUnit: string;
  quantityAvailable: number;
  stockValue: number;
  currentRate: number;
  multiUnits: {
    name: string;
    factor: number;
  }[];
}

export interface TransactionItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  unitConversionFactor: number;
  baseQuantity: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  date: string;
  entity: Entity;
  items: TransactionItem[];
  totalAmount: number;
  status: TransactionStatus;
  notes?: string;
}