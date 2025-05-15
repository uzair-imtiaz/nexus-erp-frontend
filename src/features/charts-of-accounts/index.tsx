import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Flex,
  Input,
  notification,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  createAccountApi,
  deleteAccountApi,
  getChartOfAccountsApi,
  updateAccountApi,
} from "../../services/charts-of-accounts.services";
import AddAccountModal from "./create-account-modal";
import "./index.css";
import { columnsConfig, getRowClassName } from "./utils";

const { Title, Text } = Typography;

const ChartOfAccounts: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const handleSearch = (value: string) => {};

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getChartOfAccountsApi();
      if (response.success) {
        setAccounts(response.data);
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
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdate = async (data: any) => {
    try {
      setSubmitLoading(true);
      const response = accountToEdit
        ? await updateAccountApi(accountToEdit.id, data)
        : await createAccountApi(data);
      if (response?.success) {
        notification.success({ message: response.message });
        setShowAddModal(false);
        await fetchData();
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
      console.error("Error fetching data:", error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await deleteAccountApi(id);
      if (response?.success) {
        notification.success({ message: response?.message });
        await fetchData();
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
      console.error("Error fetching data:", error);
    }
  };

  const columns = [
    ...columnsConfig,
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              setShowAddModal(true);
              setAccountToEdit(record);
            }}
            icon={<EditOutlined />}
            type="link"
          />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              icon={<DeleteOutlined />}
              type="link"
              color="danger"
              disabled={record?.systemGenerated}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {showAddModal && (
        <AddAccountModal
          visible={showAddModal}
          onCancel={() => setShowAddModal(false)}
          onSave={handleCreateOrUpdate}
          loading={submitLoading}
          accountData={accountToEdit}
        />
      )}
      <Flex className="">
        <Title level={3} className="mb-1">
          Chart of Accounts
        </Title>
        <Button
          type="primary"
          className="ml-auto"
          onClick={() => setShowAddModal(true)}
          icon={<PlusOutlined />}
        >
          Add Account
        </Button>
      </Flex>
      <Text className="text-gray-500">
        Financial accounts hierarchical structure
      </Text>

      <div className="flex justify-between items-center my-4">
        <Input
          placeholder="Search accounts..."
          prefix={<SearchOutlined className="text-gray-400" />}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-64"
          allowClear
        />
      </div>

      <Table
        rowKey="id"
        columns={columns}
        loading={loading}
        dataSource={accounts}
        size="small"
        bordered
        rowClassName={(record) => getRowClassName(record)}
        expandable={{
          onExpand: () => {
            (expanded, record) => {
              if (expanded) {
                setExpandedKeys([record.id]);
              } else {
                setExpandedKeys((prev) =>
                  prev.filter((key) => key !== record.id)
                );
              }
            };
          },
        }}
      />
    </>
  );
};

export default ChartOfAccounts;
