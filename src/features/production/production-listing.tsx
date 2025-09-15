import {
  CheckCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Flex,
  Input,
  notification,
  Popconfirm,
  Space,
  Tag,
} from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/common/table/data-table";
import {
  changeProductionStatusApi,
  deleteProductionApi,
  getProductionsApi,
} from "../../services/production.services";
import { buildQueryString, formatCurrency } from "../../utils";
import { ProductionItem } from "./types";

const Production: React.FC = () => {
  const [productions, setProductions] = useState<ProductionItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    fetchProductions();
  }, []);

  const handleStatusChange = async (id: string) => {
    try {
      setLoading(true);
      const response = await changeProductionStatusApi(id);
      if (response?.success) {
        notification.success({ message: response?.message });
        const newProductions = productions.map((production) => {
          if (production.id === id) {
            return {
              ...production,
              status: response?.data.status,
            };
          }
          return production;
        });
        setProductions(newProductions);
      } else {
        notification.error({
          message: "Error",
          description: response?.message,
        });
      }
    } catch {
      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const productionColumns: ColumnsType<ProductionItem> = [
    {
      title: "Production Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Production Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => dayjs(date).format("DD MMM, YYYY"),
    },
    {
      title: "Formulation",
      dataIndex: ["formulation", "name"],
      key: "formulation",
    },
    {
      title: "Total Cost",
      dataIndex: "totalCost",
      key: "totalCost",
      render: (cost: number) => formatCurrency(cost),
      sorter: (a, b) => a.totalCost - b.totalCost,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Completed" ? "#87d068" : "#2db7f5"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Flex>
          {record.status !== "Completed" && (
            <Button
              type="text"
              size="small"
              icon={<CheckCircleOutlined />}
              onClick={() => handleStatusChange(record.id)}
            />
          )}
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/production/${record?.id}`)}
          />
          {/* <Popconfirm
            title="Delete this record?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record?.id)}
          >
            <Button type="link" size="small" icon={<DeleteOutlined />} danger />
          </Popconfirm> */}
        </Flex>
      ),
    },
  ];

  const fetchProductions = async (queryParams?: Record<string, any>) => {
    try {
      setLoading(true);
      const { page, limit, search } = queryParams || {};
      const query = buildQueryString({ page, limit, search });
      const response = await getProductionsApi(query);
      if (response?.success) {
        setProductions(response?.data);
        setPagination(response?.pagination);
        return response;
      } else {
        notification.error({
          message: "Error",
          description: response?.message,
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteProductionApi(id);
      if (response?.success) {
        notification.success({ message: response?.message });
        await fetchProductions();
      } else {
        notification.error({
          message: "Error",
          description: response.message,
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error?.message,
      });
    }
  };

  const handleSearch = async (searchTerm: string) => {
    await fetchProductions({
      search: searchTerm,
      page: pagination?.page,
      limit: pagination?.limit,
    });
  };

  return (
    <div className="space-y-6">
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
        direction="horizontal"
      >
        <Space wrap>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search productions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 250 }}
            onPressEnter={() => handleSearch(searchTerm)}
          />
        </Space>

        <Space wrap>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              navigate("/production/new");
            }}
          >
            Add New Item
          </Button>
          <Button icon={<DownloadOutlined />}>Export</Button>
          <Button icon={<UploadOutlined />}>Import</Button>
        </Space>
      </Space>
      <DataTable
        data={productions}
        columns={productionColumns}
        emptyText="No productions found."
        loading={loading}
        pagination={pagination}
        setPagination={setPagination}
        fetchItems={fetchProductions}
      />
    </div>
  );
};

export default Production;
