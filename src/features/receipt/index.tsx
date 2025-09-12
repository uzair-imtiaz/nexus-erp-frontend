import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Flex, notification, Space, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Receipt } from "../../components/common/financial-transaction/types";
import ViewReceiptModal from "../../components/common/financial-transaction/view-receipt-modal";
import DataTable from "../../components/common/table/data-table";
import {
  downloadReceiptPdfApi,
  getReceiptsApi,
  viewReceiptPdfApi,
} from "../../services/receipt.services";
import { buildQueryString, formatCurrency } from "../../utils";

const { Title } = Typography;

const Receipts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [viewPdfLoading, setViewPdfLoading] = useState<Record<string, boolean>>(
    {}
  );

  const [downloadPdfLoading, setDownloadPdfLoading] = useState<
    Record<string, boolean>
  >({});
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<Receipt | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const query = buildQueryString({});
        const response = await getReceiptsApi(query);
        if (!response?.success) {
          notification.error({
            message: "Error",
            description: response?.message,
          });
        }
        setData(response?.data);
        setPagination(response?.pagination);
      } catch (error) {
        notification.error({
          message: "Error",
          description: error,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const downloadPdf = async (id) => {
    try {
      setDownloadPdfLoading({ id: true });
      const response = await downloadReceiptPdfApi(id);

      const fileURL = URL.createObjectURL(response);

      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `payment-${id}.pdf`;
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
      setDownloadPdfLoading({ id: false });
    }
  };

  const viewPdf = async (id: string) => {
    try {
      setViewPdfLoading({ id: true });
      const response = await viewReceiptPdfApi(id);

      const fileURL = URL.createObjectURL(response);
      window.open(fileURL, "_blank");
    } catch (error) {
      notification.error({
        message: "Error",
        description: error?.message,
      });
    } finally {
      setViewPdfLoading({ id: false });
    }
  };

  const viewReceiptDetails = async (receipt: Receipt) => {
    try {
      setCurrentReceipt(receipt);
      setViewModalVisible(true);
    } catch {
      notification.error({
        message: "Error",
        description: "Failed to fetch receipt details",
      });
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => dayjs(date).format("DD-MM-YYYY"),
    },
    {
      title: "Bank",
      dataIndex: "bank",
      key: "bank",
      render: (bank: any) => bank?.name,
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      render: (customer: any) => customer?.name,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: "Advance Balance",
      dataIndex: "customer",
      key: "advanceBalance",
      render: (customer: { advanceBalance: number }) =>
        formatCurrency(customer?.advanceBalance),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              onClick={() => viewReceiptDetails(record)}
              type="text"
              size="small"
            />
          </Tooltip>
          <Tooltip title="Download PDF">
            <Button
              size="small"
              type="text"
              icon={<DownloadOutlined size={16} />}
              onClick={async () => downloadPdf(record.id)}
              loading={downloadPdfLoading?.[record.id]}
              disabled={viewPdfLoading?.[record.id]}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Flex justify="space-between">
        <Title level={3}>Receipts</Title>
        <Button
          type="primary"
          style={{ marginBottom: "1rem" }}
          onClick={() => {
            navigate("/receipts/new");
          }}
        >
          New Receipt
        </Button>
      </Flex>
      <DataTable
        data={data}
        columns={columns}
        pagination={pagination}
        loading={loading}
      />

      {/* View Receipt Modal */}
      {viewModalVisible && currentReceipt && (
        <ViewReceiptModal
          receipt={currentReceipt}
          onClose={() => {
            setViewModalVisible(false);
            setCurrentReceipt(null);
          }}
        />
      )}
    </>
  );
};

export default Receipts;
