import {
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Flex,
  notification,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBanks } from "../../services/bank.services";
import { getAccountByTypeApi } from "../../services/charts-of-accounts.services";
import {
  deleteExpenseApi,
  getExpensesApi,
} from "../../services/expense.services";
import { buildQueryString, formatCurrency } from "../../utils";
import { ACCOUNT_TYPE } from "../charts-of-accounts/utils";
import { Expense, Filters, Pagination } from "./types";

const { Option } = Select;
const { RangePicker } = DatePicker;

const ExpenseListing = () => {
  const [filters, setFilters] = useState<Filters>({
    bank_id: undefined,
    nominal_account_ids: undefined,
    dateRange: null,
    search: undefined,
  });
  const [banks, setBanks] = useState<any>([]);
  const [nominals, setNominals] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Expense[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    nextPage: null,
    prevPage: null,
  });

  const navigate = useNavigate();
  const { Title } = Typography;

  const fetch = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const { bank_id, nominal_account_ids, dateRange, search } = filters;

        const queryString = buildQueryString({
          bank_id,
          nominal_account_ids: nominal_account_ids?.join(","),
          date_from: dateRange?.[0]?.format("YYYY-MM-DD") || null,
          date_to: dateRange?.[1]?.format("YYYY-MM-DD") || null,
          search,
          page,
          limit: pagination.limit,
        });

        const response = await getExpensesApi(queryString);

        if (!response.success) {
          notification.error({
            message: "Error",
            description: response.message,
          });
          return;
        }

        setData(response.data);
        setPagination(response.pagination);
      } catch (error: any) {
        notification.error({
          message: "Error",
          description: error?.message || "An unexpected error occurred",
        });
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.limit]
  );

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetch(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  // Initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [BanksRes, NominalRes] = await Promise.all([
          getBanks(),
          getAccountByTypeApi(ACCOUNT_TYPE[3].value),
        ]);
        if (BanksRes?.success && NominalRes?.success) {
          setBanks(BanksRes?.data);
          setNominals(NominalRes?.data);
        } else {
          notification.error({
            message: "Error",
            description: "Error fetching data",
          });
        }
      } catch (error: any) {
        notification.error({
          message: "Error",
          description: error?.message,
        });
      }
    };

    fetch();
    fetchData();
  }, []);

  const onDeleteExpense = async (id) => {
    try {
      const response = await deleteExpenseApi(id);
      if (response?.success) {
        notification.success({ message: response?.message });
        await fetch();
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

  const handleFilterChange = useCallback((key: keyof Filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      bank_id: undefined,
      nominal_account_ids: undefined,
      dateRange: null,
      search: undefined,
    });
  }, []);

  // Memoized columns to prevent re-creation on every render
  const columns = useMemo(
    () => [
      {
        title: "V. No.",
        dataIndex: "id",
        width: 100,
        fixed: "left" as const,
        sorter: true,
      },
      {
        title: "Date",
        dataIndex: "createdAt",
        width: 120,
        render: (text: string) => (
          <Tooltip title={dayjs(text).format("DD/MM/YYYY HH:mm")}>
            {dayjs(text).format("DD-MM-YYYY")}
          </Tooltip>
        ),
        sorter: true,
      },
      {
        title: "Bank",
        dataIndex: "bank",
        width: 150,
        render: (bank: { name: string } | null) => (
          <Tag color={bank ? "blue" : "default"}>{bank?.name || "No Bank"}</Tag>
        ),
      },
      {
        title: "Total Amount",
        dataIndex: "totalAmount",
        width: 140,
        align: "right" as const,
        render: (amount: number) => (
          <span
            style={{
              fontWeight: 600,
              color: amount < 0 ? "#ff4d4f" : "#52c41a",
            }}
          >
            {formatCurrency(amount || 0)}
          </span>
        ),
        sorter: true,
      },
      {
        title: "Description",
        dataIndex: "description",
        ellipsis: {
          showTitle: false,
        },
        render: (text: string) => (
          <Tooltip placement="topLeft" title={text}>
            {text || "No description"}
          </Tooltip>
        ),
      },
      {
        title: "Actions",
        key: "actions",
        width: 100,
        fixed: "right" as const,
        render: (_: any, record: Expense) => (
          <Flex gap={5}>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => navigate(`/expenses/${record.id}`)}
            />
            <Popconfirm
              title="Are you sure?"
              onConfirm={() => onDeleteExpense(record?.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="link"
                size="small"
                icon={<DeleteOutlined />}
                danger
              />
            </Popconfirm>
          </Flex>
        ),
      },
    ],
    []
  );

  const detailColumns = useMemo(
    () => [
      {
        title: "Nominal Account",
        dataIndex: "nominalAccount",
        render: (nominalAccount: { name: string } | null) => (
          <Tag color={nominalAccount ? "green" : "default"}>
            {nominalAccount?.name || "N/A"}
          </Tag>
        ),
      },
      {
        title: "Amount",
        dataIndex: "amount",
        render: (amount: number) => (
          <span style={{ fontWeight: 500 }}>{formatCurrency(amount)}</span>
        ),
      },
      {
        title: "Detail",
        dataIndex: "description",
        ellipsis: {
          showTitle: false,
        },
        render: (text: string) => (
          <Tooltip placement="topLeft" title={text}>
            {text || "No detail"}
          </Tooltip>
        ),
      },
    ],
    []
  );

  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.bank_id ||
      filters.nominal_account_ids?.length ||
      filters.dateRange ||
      filters.search
    );
  }, [filters]);

  const handleTableChange = (
    paginationConfig: any,
    filtersConfig: any,
    sorter: any
  ) => {
    if (paginationConfig.current !== pagination.page) {
      fetch(paginationConfig.current);
    }
  };

  return (
    <div>
      <Title level={3}>Expenses Management</Title>

      <Space size="middle" wrap style={{ marginBottom: 16 }}>
        <Select
          placeholder="Select Bank"
          style={{ width: 200 }}
          value={filters.bank_id}
          onChange={(value) => handleFilterChange("bank_id", value)}
          allowClear
        >
          {banks.map((bank) => (
            <Option key={bank.id} value={bank.id}>
              {bank.name}
            </Option>
          ))}
        </Select>

        <Select
          mode="multiple"
          placeholder="Select Nominals"
          style={{ width: 240 }}
          value={filters.nominal_account_ids}
          onChange={(value) => handleFilterChange("nominal_account_ids", value)}
          allowClear
          showSearch
          filterOption={(input, option) =>
            (option?.name ?? "").toLowerCase().includes(input.toLowerCase())
          }
        >
          {nominals.map((nominal) => (
            <Option key={nominal.id} value={nominal.id}>
              {nominal.name}
            </Option>
          ))}
        </Select>

        <RangePicker
          value={filters.dateRange}
          onChange={(dates) => handleFilterChange("dateRange", dates)}
          format="DD/MM/YYYY"
          placeholder={["Start Date", "End Date"]}
        />

        <Button
          icon={<ReloadOutlined />}
          onClick={clearFilters}
          disabled={!hasActiveFilters}
        >
          Clear Filters
        </Button>

        <Button icon={<SearchOutlined />} onClick={() => fetch()}>
          Search
        </Button>

        <Button type="primary" icon={<PlusOutlined />} size="middle">
          Add New Expense
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} expenses`,
          pageSizeOptions: ["10", "20", "50", "100"],
        }}
        rowKey="id"
        expandable={{
          expandedRowRender: (record) => (
            <Table
              columns={detailColumns}
              dataSource={record.details}
              pagination={false}
              rowKey="id"
              size="small"
              style={{ margin: "0 24px" }}
            />
          ),
          rowExpandable: (record) => record.details?.length > 0,
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <DownOutlined
                onClick={(e) => onExpand(record, e)}
                size={12}
                style={{ color: "#1890ff", cursor: "pointer" }}
              />
            ) : (
              <RightOutlined
                size={12}
                onClick={(e) => onExpand(record, e)}
                style={{ color: "#1890ff", cursor: "pointer" }}
              />
            ),
        }}
        scroll={{ x: "max-content" }}
        onChange={handleTableChange}
        size="middle"
      />
    </div>
  );
};

export default ExpenseListing;
