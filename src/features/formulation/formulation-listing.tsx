import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Flex, Input, notification, Popconfirm, Space } from "antd";
import { ColumnsType } from "antd/es/table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../components/common/table/data-table";
import {
  deleteFormulationApi,
  getFormulationsApi,
} from "../../services/formulation.services";
import { buildQueryString, formatCurrency } from "../../utils";
import { FormulationItem } from "./types";

const Formulation: React.FC = () => {
  const [formulations, setFormulations] = useState<FormulationItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    fetchFormulations();
  }, []);

  const formulationColumns: ColumnsType<FormulationItem> = [
    {
      title: "Formulation Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Formulation Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Total Cost",
      dataIndex: "totalCost",
      key: "totalCost",
      render: (cost: number) => formatCurrency(cost),
      sorter: (a, b) => a.totalCost - b.totalCost,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Flex>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/formulations/${record?.id}`)}
          />
          <Popconfirm
            title="Delete this record?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record?.id)}
          >
            <Button type="link" size="small" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Flex>
      ),
    },
  ];

  const fetchFormulations = async (queryParams?: Record<string, any>) => {
    try {
      setLoading(true);
      const { page, limit, search } = queryParams || {};
      const query = buildQueryString({ page, limit, search });
      const response = await getFormulationsApi(query);
      if (response?.success) {
        setFormulations(response?.data);
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
      const response = await deleteFormulationApi(id);
      if (response?.success) {
        notification.success({ message: response?.message });
        await fetchFormulations();
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
    await fetchFormulations({
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
            placeholder="Search formulations..."
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
              navigate("/formulations/new");
            }}
          >
            Add New Item
          </Button>
          <Button icon={<DownloadOutlined />}>Export</Button>
          <Button icon={<UploadOutlined />}>Import</Button>
        </Space>
      </Space>
      <DataTable
        data={formulations}
        columns={formulationColumns}
        emptyText="No formulations found."
        loading={loading}
        pagination={pagination}
        setPagination={setPagination}
        fetchItems={fetchFormulations}
      />
    </div>
  );
};

export default Formulation;
