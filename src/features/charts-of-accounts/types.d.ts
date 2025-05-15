export interface DataType {
  id: React.ReactNode;
  name: string;
  type: string;
  code: string;
  amount: string;
  children?: DataType[];
}
