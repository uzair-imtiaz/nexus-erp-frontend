export interface ProductionItem {
  id: string;
  code: string;
  date: string;
  formulation: { name: string };
  quantity: number;
  status: "In Progress" | "Completed";
  totalCost: number;
}
