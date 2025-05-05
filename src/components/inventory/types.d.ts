export interface InventoryItem {
    id: string;
    name: string;
    category: 'Raw Material' | 'Semi-Finished Goods' | 'Finished Goods';
    baseUnit: string;
    quantityAvailable: number;
    stockValue: number;
    currentRate: number;
    multiUnits: {
      name: string;
      factor: number;
    }[];
  }