export interface FormulationItem {
  id: string;
  name: string;
  finalProduct: { name: string; baseUnit: string };
  quantity: number;
  totalCost: number;
  products: any[];
  ingredients: any[];
  expenses: any[];
  costPerUnit: number;
}

export interface AddEditFormulationModalProps {
  formulation: any;
  inventoryItems: any[];
  onSave: (formulation: any) => void;
  onClose: () => void;
}
