import { useEffect, useState } from "react";
import DataTable from "../../components/common/table/data-table";
import dayjs from "dayjs";
import { buildQueryString, formatCurrency } from "../../utils";
import {
  downloadPaymentPdfApi,
  getPaymentsApi,
  viewPaymentPdfApi,
} from "../../services/payment.services";
import { Button, Flex, notification, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";

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
  const [viewPdfLoading, setViewPdfLoading] = useState<Record<string, boolean>>({});

  const [downloadPdfLoading, setDownloadPdfLoading] = useState<Record<string, boolean>>({});
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
      debugger;
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
      render: (vendor: any) => vendor?.name,
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
          <Button
            icon={<EyeOutlined />}
            onClick={async () => viewPdf(record.id)}
            loading={viewPdfLoading?.[record.id]}
            type="text"
            size="small"
            disabled={downloadPdfLoading?.[record.id]}
          />
          <Button
            size="small"
            type="text"
            icon={<DownloadOutlined size={16} />}
            onClick={async () => downloadPdf(record.id)}
            loading={downloadPdfLoading?.[record.id]}
            disabled={viewPdfLoading?.[record.id]}
          />
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
    </>
  );
};

export default Payments;
