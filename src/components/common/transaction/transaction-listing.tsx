import { Button, Flex, Popconfirm, Space, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { Download, Edit, Eye, Plus, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Transaction, TransactionType } from "./types";
import ViewTransactionModal from "./view-transaction";

interface TransactionsTableProps {
  type: TransactionType;
  transactions: Transaction[];
  loading?: boolean;
  fetch?: (
    type: "purchase" | "sale",
    queryParams?: Record<string, any>
  ) => void;
  pagination?: any;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  type,
  transactions,
  pagination,
  loading = false,
  fetch,
}) => {
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentTransaction, setCurrentTransaction] =
    useState<Transaction | null>(null);

  const navigate = useNavigate();

  const handleEdit = (transaction: Transaction) => {
    // TODO: Implement edit functionality
    console.log("Edit transaction:", transaction);
  };

  const handleDelete = (transaction: Transaction) => {
    // TODO: Implement delete functionality
    console.log("Delete transaction:", transaction);
  };

  const columnsConfig = (type: TransactionType): ColumnsType<Transaction> => [
    {
      title: "Transaction ID",
      dataIndex: "id",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type: string) => type.charAt(0).toUpperCase() + type.slice(1),
    },
    {
      title: type === "purchase" ? "Vendor" : "Customer",
      dataIndex: ["entity", "name"],
      render: (type: string) => type.charAt(0).toUpperCase() + type.slice(1),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (total: number) => `$${total.toFixed(2)}`,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      render: (discount: number) => `$${discount.toFixed(2)}`,
      sorter: (a, b) => a.discount - b.discount,
    },
    {
      title: "Tax",
      dataIndex: "tax",
      render: (tax: number) => `$${tax.toFixed(2)}`,
      sorter: (a, b) => a.tax - b.tax,
    },
    {
      title: "Net Amount",
      dataIndex: "netAmount",
      render: (record) => record.amount - record.discount + record.tax,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View">
            <Button
              type="text"
              icon={<Eye size={16} />}
              onClick={() => setCurrentTransaction(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<Edit size={16} />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this transaction?"
              onConfirm={() => handleDelete(record)}
            >
              <Button type="text" icon={<Trash2 size={16} />} danger />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Flex wrap gap={2} justify="end">
        <Space>
          <Button
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => navigate(`/${type}s/new`)}
          >
            Add New {type === "purchase" ? "Purchase" : "Sale"}
          </Button>
          <Button icon={<Download size={16} />}>Download</Button>
          <Button icon={<Upload size={16} />}>Import</Button>
        </Space>
      </Flex>

      <Table
        columns={columnsConfig(type)}
        dataSource={transactions}
        rowKey="id"
        pagination={{
          current: pagination?.page,
          pageSize: pagination?.limit,
          total: pagination?.total,
          showSizeChanger: true,
        }}
        loading={loading}
        onChange={(pagination) => {
          fetch?.(type, {
            page: pagination.current,
            limit: pagination.pageSize,
          });
        }}
      />

      {/* View Modal */}
      {viewModalVisible && currentTransaction && (
        <ViewTransactionModal
          transaction={currentTransaction}
          onClose={() => setViewModalVisible(false)}
        />
      )}
    </div>
  );
};

export default TransactionsTable;
