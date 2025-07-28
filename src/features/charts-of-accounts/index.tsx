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
import React, { useEffect, useMemo, useState } from "react";
import {
  createAccountApi,
  deleteAccountApi,
  getChartOfAccountsApi,
  updateAccountApi,
} from "../../services/charts-of-accounts.services";
import AddAccountModal from "./create-account-modal";
import "./index.css";
import { columnsConfig, getRowClassName } from "./utils";
import { formatCurrency } from "../../utils";
import { Account } from "./types";

const { Title, Text } = Typography;

const getAllKeys = (data) => {
  let keys = [];

  data.forEach((item) => {
    keys.push(item.id);
    if (item.children && item.children.length > 0) {
      keys = keys.concat(getAllKeys(item.children));
    }
  });

  return keys;
};

const ChartOfAccounts: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [accountToEdit, setAccountToEdit] = useState<Account | null>(null);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const allKeys = useMemo(() => getAllKeys(accounts), [accounts]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    if (!value) {
      setExpandedKeys([]);
      return;
    }

    const findMatchingAccounts = (
      accounts: any[],
      searchValue: string,
      parentIds: string[] = []
    ): { matches: string[]; parentIds: string[] } => {
      let matches: string[] = [];
      let allParentIds: string[] = [];

      accounts.forEach((account) => {
        const currentParentIds = [...parentIds];
        if (account.parentId) {
          currentParentIds.push(account.parentId);
        }

        if (
          account.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          account.code?.toLowerCase().includes(searchValue.toLowerCase())
        ) {
          matches.push(account.id);
          allParentIds = [...allParentIds, ...currentParentIds];
        }

        if (account.children && account.children.length) {
          const childResults = findMatchingAccounts(
            account.children,
            searchValue,
            [...currentParentIds, account.id] // pass down the chain
          );
          matches = [...matches, ...childResults.matches];
          allParentIds = [...allParentIds, ...childResults.parentIds];
        }
      });

      return { matches, parentIds: allParentIds };
    };

    const { matches: _, parentIds } = findMatchingAccounts(accounts, value);
    const allIdsToExpand = [...new Set(parentIds)];
    setExpandedKeys(allIdsToExpand);
  };

  useEffect(() => {
    if (searchText) {
      handleSearch(searchText);
    }
  }, [accounts]);

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
      width: 90,
      render: (_: any, record: Account) => (
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
          {/* <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              icon={<DeleteOutlined />}
              type="link"
              danger
              disabled={record?.systemGenerated}
            />
          </Popconfirm> */}
        </Space>
      ),
    },
  ];

  const handleExpandAll = () => {
    if (expandedKeys.length > 0) {
      setExpandedKeys([]);
    } else {
      setExpandedKeys(allKeys);
    }
  };

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

      <Button
        type="primary"
        size="small"
        onClick={handleExpandAll}
        style={{ marginBottom: 8, float: "right" }}
      >
        {expandedKeys.length > 0 ? "Collapse All" : "Expand All"}
      </Button>

      <Table
        rowKey="id"
        columns={columns}
        loading={loading}
        dataSource={accounts}
        size="small"
        bordered
        rowClassName={(record) => getRowClassName(record)}
        expandable={{
          expandedRowKeys: expandedKeys,
          onExpand: (expanded, record) => {
            if (expanded) {
              setExpandedKeys([...expandedKeys, record.id]);
            } else {
              setExpandedKeys(expandedKeys.filter((key) => key !== record.id));
            }
          },
        }}
        summary={(pageData) => {
          const totalCredit = pageData.reduce(
            (sum, record) => sum + Number(record.creditAmount || 0),
            0
          );
          const totalDebit = pageData.reduce(
            (sum, record) => sum + Number(record.debitAmount || 0),
            0
          );

          return (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4}>
                  <Text strong>Balance</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  <Text strong>{formatCurrency(totalDebit)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  <Text strong>{formatCurrency(totalCredit)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6}>
                  <Text strong>{formatCurrency(totalDebit - totalCredit)}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7} />
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />
    </>
  );
};

export default ChartOfAccounts;
