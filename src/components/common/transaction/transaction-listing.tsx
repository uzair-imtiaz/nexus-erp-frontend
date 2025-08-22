import { DownOutlined, EyeOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Dropdown, Flex, notification, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { Download, Plus, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildQueryString, formatCurrency } from "../../../utils";
import type { Transaction, TransactionType } from "./types";
import ViewTransactionModal from "./view-transaction";
import {
  downloadInvoiceApi,
  getinvoiceApi,
} from "../../../services/sales.services";
import {
  downloadBillApi,
  getBillApi,
} from "../../../services/purchase.services";

interface TransactionsTableProps {
  type: TransactionType;
  fetchApi: (queryString: string) => Promise<any>;
  menuOptions: MenuProps["items"];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  type,
  menuOptions,
  fetchApi,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    nextPage: null,
    prevPage: null,
  });

  const [currentTransaction, setCurrentTransaction] =
    useState<Transaction | null>(null);
  const [viewInvoiceLoading, setViewInvoiceLoading] = useState(false);
  const [downloadInvoiceLoading, setDownloadInvoiceLoading] = useState(false);
  const navigate = useNavigate();

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    navigate(`/${key.split("-")[0]}s/new?type=${key}`);
  };

  const fetchTransactions = async (queryParams: Record<string, any> = {}) => {
    try {
      setLoading(true);
      const queryString = buildQueryString(queryParams);
      const response = await fetchApi(queryString);
      if (!response?.success) {
        return notification.error({
          message: "Error",
          description: response.message,
        });
      }
      setTransactions(response?.data);
      setPagination(response?.pagination);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions({});
  }, [type]);

  const downloadPdf = async (id) => {
    try {
      setDownloadInvoiceLoading(true);
      const response =
        type === "sale"
          ? await downloadInvoiceApi(id)
          : await downloadBillApi(id);
      const fileURL = URL.createObjectURL(response);

      const link = document.createElement("a");
      link.href = fileURL;
      link.download = type === "sale" ? `invoice-${id}.pdf` : `bill-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(fileURL);
    } catch (error) {
      notification.error({
        message: "Error",
        description: error?.message,
      });
    } finally {
      setDownloadInvoiceLoading(false);
    }
  };

  const viewPdf = async (id: string) => {
    try {
      setViewInvoiceLoading(true);
      const response =
        type === "sale" ? await getinvoiceApi(id) : await getBillApi(id);

      const fileURL = URL.createObjectURL(response);
      window.open(fileURL, "_blank");
    } catch (error) {
      notification.error({
        message: "Error",
        description: error?.message,
      });
    } finally {
      setViewInvoiceLoading(false);
    }
  };

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
      title: "ID",
      dataIndex: "id",
      width: 90,
      sorter: (a, b) => Number(a.id) - Number(b.id),
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
      dataIndex: [type === "purchase" ? "vendor" : "customer"],
      render: (type: any) =>
        type?.name?.charAt?.(0)?.toUpperCase?.() + type?.name?.slice?.(1),
    },
    {
      title: "Net Amount",
      dataIndex: "totalAmount",
      render: (total: number) => formatCurrency(total),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={async () => viewPdf(record.id)}
            loading={viewInvoiceLoading}
            type="text"
            size="small"
            disabled={downloadInvoiceLoading}
          />
          <Button
            size="small"
            type="text"
            icon={<Download size={16} />}
            onClick={async () => downloadPdf(record.id)}
            loading={downloadInvoiceLoading}
            disabled={viewInvoiceLoading}
          />
        </Space>
      ),
      /*{
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
              onClick={() => navigate(`/${type}s/${record.id}`)}
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
    },*/
    },
  ];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Flex wrap gap={2} justify="end">
        <Space>
          <Dropdown
            menu={{ items: menuOptions, onClick: handleMenuClick }}
            placement="bottomRight"
          >
            <Button type="primary" icon={<Plus size={16} />}>
              Add New <DownOutlined />
            </Button>
          </Dropdown>
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
          fetchTransactions?.({
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
