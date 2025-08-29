import { DownOutlined, EyeOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Dropdown, Flex, notification, Space } from "antd";
import { Download, Plus, Upload, Edit, Trash2 } from "lucide-react";
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
import PermissionAwareTable from "../PermissionAwareTable";
import ProtectedComponent from "../ProtectedComponent";

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
  const [viewInvoiceLoading, setViewInvoiceLoading] = useState<{
    id: boolean;
  } | null>(null);
  const [downloadInvoiceLoading, setDownloadInvoiceLoading] = useState<{
    id: boolean;
  } | null>(null);
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
      setDownloadInvoiceLoading({ id: true });
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
      setDownloadInvoiceLoading({ id: false });
    }
  };

  const viewPdf = async (id: string) => {
    try {
      setViewInvoiceLoading({ id: true });
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
      setViewInvoiceLoading({ id: false });
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

  const columnsConfig = (type: TransactionType) => [
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
      render: (type: unknown) =>
        type?.name?.charAt?.(0)?.toUpperCase?.() + type?.name?.slice?.(1),
    },
    {
      title: "Net Amount",
      dataIndex: "totalAmount",
      render: (total: number) => formatCurrency(total),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      permission: `${type}s.read`, // Hide amount column if no read permission
    },
  ];

  const tableActions = [
    {
      key: "view",
      label: "",
      icon: <EyeOutlined />,
      permission: `${type}s.read`,
      onClick: (record: Transaction) => viewPdf(record.id),
      loading: viewInvoiceLoading?.[record.id],
      disabled: (record: Transaction) => downloadInvoiceLoading?.[record.id],
      tooltip: "View PDF",
    },
    {
      key: "download",
      label: "",
      icon: <Download size={16} />,
      permission: `${type}s.export`,
      onClick: (record: Transaction) => downloadPdf(record.id),
      loading: downloadInvoiceLoading?.[record.id],
      disabled: (record: Transaction) => viewInvoiceLoading?.[record.id],
      tooltip: "Download PDF",
    },
    {
      key: "edit",
      label: "",
      icon: <Edit size={16} />,
      permission: `${type}s.update`,
      onClick: (record: Transaction) => navigate(`/${type}s/${record.id}`),
      tooltip: "Edit Transaction",
    },
    {
      key: "delete",
      label: "",
      icon: <Trash2 size={16} />,
      permission: `${type}s.delete`,
      onClick: (record: Transaction) => handleDelete(record),
      danger: true,
      tooltip: "Delete Transaction",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Flex wrap gap={2} justify="end">
        <Space>
          <ProtectedComponent permission={`${type}s.create`}>
            <Dropdown
              menu={{ items: menuOptions, onClick: handleMenuClick }}
              placement="bottomRight"
            >
              <Button type="primary" icon={<Plus size={16} />}>
                Add New <DownOutlined />
              </Button>
            </Dropdown>
          </ProtectedComponent>
          <ProtectedComponent permission={`${type}s.export`}>
            <Button icon={<Download size={16} />}>Download</Button>
          </ProtectedComponent>
          <ProtectedComponent permission={`${type}s.create`}>
            <Button icon={<Upload size={16} />}>Import</Button>
          </ProtectedComponent>
        </Space>
      </Flex>

      <PermissionAwareTable
        columns={columnsConfig(type)}
        actions={tableActions}
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
