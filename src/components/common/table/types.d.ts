import { SizeType } from "antd/es/config-provider/SizeContext";

export interface BaseTableItem {
  id: string;
  name?: string;
  [key: string]: any;
}

export interface CommonTableProps<T extends BaseTableItem> {
  data: T[];
  bordered?: boolean;
  columns: ColumnsType<T>;
  size?: SizeType;
  emptyText: string;
  loading?: boolean;
  pagination?: Record<string, number>;
  fetchItems: (queryParams?: Record<string, any>) => void;
  setPagination: any;
  onRowClick?: (record: T, index: number) => void;
  rowClickable?: boolean;
}
