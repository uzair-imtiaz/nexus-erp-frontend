import { Table } from "antd";
import { BaseTableItem, CommonTableProps } from "./types";
import "./data-table.css";

const DataTable = <T extends BaseTableItem>({
  data,
  columns,
  emptyText,
  loading,
  fetchItems,
  size = "middle",
  bordered = true,
  setPagination,
  pagination = {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  rowClickable = false,
  onRowClick,
}: CommonTableProps<T>) => {
  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      bordered={bordered}
      size={size}
      pagination={{
        current: pagination?.page,
        pageSize: pagination?.limit,
        total: pagination?.total,
        showSizeChanger: true,
      }}
      onChange={(pagination) => {
        setPagination(pagination);
        fetchItems({ page: pagination.current, limit: pagination.pageSize });
      }}
      loading={loading}
      locale={{ emptyText }}
      onRow={(record, index) => {
        return {
          onClick: () => {
            onRowClick?.(record, index as number);
          },
        };
      }}
      rowClassName={() => (rowClickable ? "data-table-row-clickable" : "")}
    />
  );
};

export default DataTable;
