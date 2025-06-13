export interface InventoryItem {
  id: string;
  name: string;
  category: "Raw Material" | "Semi-Finished Goods" | "Finished Goods";
  baseUnit: string;
  quantity: number;
  stockValue: number;
  baseRate: number;
  code: string;
  multiUnits: Record<string, number>;
}
