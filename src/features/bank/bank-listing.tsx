import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table, TablePaginationConfig } from "antd";
import dayjs from "dayjs";

interface Bank {
  id: string;
  name: string;
  accountNumber: string;
  iban: string;
  code: string;
  currentBalance: number;
  openingDate: string;
}

interface BankTableProps {
  data: Bank[];
  loading: boolean;
  onEdit: (bank: Bank) => void;
  onDelete: (id: string) => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
  };
  fetchItems: (params: { page?: number; limit?: number }) => void;
}

export const BankTable = ({
  data,
  loading,
  onEdit,
  onDelete,
  pagination,
  fetchItems,
}: BankTableProps) => {
  const columns = [
    { title: "Bank Code", dataIndex: "code", key: "code" },
    { title: "Bank Name", dataIndex: "name", key: "name" },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    { title: "IBAN", dataIndex: "iban", key: "iban" },
    {
      title: "Current Balance",
      dataIndex: "currentBalance",
      key: "currentBalance",
    },
    {
      title: "Opening Date",
      dataIndex: "openingDate",
      key: "openingDate",
      render: (openingDate: string) => dayjs(openingDate).format("DD-MMM-YY"),
    },
    {
      title: "Actions",
      render: (_: unknown, record: Bank) => (
        <Space>
          <Button
            size="small"
            onClick={() => onEdit(record)}
            icon={<EditOutlined />}
            type="link"
          />
          <Popconfirm
            title="Are you sure you want to delete this bank?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small" icon={<DeleteOutlined />} type="link" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      size="small"
      pagination={{
        current: pagination.page,
        pageSize: pagination.limit,
        total: pagination.total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`,
      }}
      onChange={(paginationConfig: TablePaginationConfig) => {
        fetchItems({
          page: paginationConfig.current,
          limit: paginationConfig.pageSize,
        });
      }}
      bordered
    />
  );
};
