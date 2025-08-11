import { useEffect, useState } from "react";
import DataTable from "../../components/common/table/data-table";
import dayjs from "dayjs";
import { buildQueryString, formatCurrency } from "../../utils";
import { getReceiptsApi } from "../../services/receipt.services";
import { Button, Flex, notification, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
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
];
const Receipts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { pagination, setPagination } = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
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
    </>
  );
};

export default Receipts;
