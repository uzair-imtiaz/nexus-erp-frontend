import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Flex, notification, Space, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Payment } from "../../components/common/financial-transaction/types";
import ViewPaymentModal from "../../components/common/financial-transaction/view-payment-modal";
import DataTable from "../../components/common/table/data-table";
import {
  downloadPaymentPdfApi,
  getPaymentsApi,
  viewPaymentPdfApi,
} from "../../services/payment.services";
import { buildQueryString, formatCurrency } from "../../utils";

const { Title } = Typography;

const Payments = () => {
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
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const query = buildQueryString({});
        const response = await getPaymentsApi(query);
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
      const response = await downloadPaymentPdfApi(id);

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
      const response = await viewPaymentPdfApi(id);

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

  const viewPaymentDetails = async (payment: Payment) => {
    try {
      setCurrentPayment(payment);
      setViewModalVisible(true);
    } catch {
      notification.error({
        message: "Error",
        description: "Failed to fetch payment details",
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
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
      render: (vendor: unknown) => vendor?.name,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: "Advance Balance",
      dataIndex: "vendor",
      key: "advanceBalance",
      render: (vendor: { advanceBalance: number }) =>
        formatCurrency(vendor?.advanceBalance),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              onClick={() => viewPaymentDetails(record)}
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
        <Title level={3}>Payments</Title>
        <Button
          type="primary"
          style={{ marginBottom: "1rem" }}
          onClick={() => {
            navigate("/payments/new");
          }}
        >
          New Payment
        </Button>
      </Flex>
      <DataTable
        data={data}
        columns={columns}
        pagination={pagination}
        loading={loading}
      />

      {/* View Payment Modal */}
      {viewModalVisible && currentPayment && (
        <ViewPaymentModal
          payment={currentPayment}
          onClose={() => {
            setViewModalVisible(false);
            setCurrentPayment(null);
          }}
        />
      )}
    </>
  );
};

export default Payments;
