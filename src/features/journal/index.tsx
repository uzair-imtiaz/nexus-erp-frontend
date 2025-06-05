import {
  DownOutlined,
  FileTextOutlined,
  PlusOutlined,
  PrinterOutlined,
  ReloadOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Input,
  notification,
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
import { getJournalsApi } from "../../services/journals.services";
import { buildQueryString, formatCurrency } from "../../utils";
import { Filters, Journal, Pagination } from "./types";

const { Option } = Select;
const { RangePicker } = DatePicker;

const JournalsListing = () => {
  const [filters, setFilters] = useState<Filters>({
    nominal_ids: undefined,
    ref_no: undefined,
    dateRange: null,
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Journal[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
    nextPage: null,
    prevPage: null,
  });

  const navigate = useNavigate();
  const { Title } = Typography;

  // Memoized fetch function
  const fetch = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const { nominal_ids, ref_no, dateRange } = filters;

        const queryString = buildQueryString({
          nominal_ids: nominal_ids?.join(","),
          ref_no,
          date_from: dateRange?.[0]?.format("YYYY-MM-DD") || null,
          date_to: dateRange?.[1]?.format("YYYY-MM-DD") || null,
          page,
          limit: pagination.limit,
        });

        const response = await getJournalsApi(queryString);

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

  // Initial load
  useEffect(() => {
    fetch();
  }, []);

  const handleFilterChange = useCallback((key: keyof Filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      nominal_ids: undefined,
      ref_no: undefined,
      dateRange: null,
    });
  }, []);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "posted":
        return "green";
      case "draft":
        return "orange";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  // Memoized columns
  const columns = useMemo(
    () => [
      {
        title: "Journal ID",
        dataIndex: "journal_id",
        width: 120,
        fixed: "left" as const,
        render: (text: string) => (
          <Tag color="blue" style={{ fontFamily: "monospace" }}>
            {text}
          </Tag>
        ),
        sorter: true,
      },
      {
        title: "Date",
        dataIndex: "date",
        width: 120,
        render: (text: string) => (
          <Tooltip title={dayjs(text).format("DD/MM/YYYY HH:mm")}>
            {dayjs(text).format("DD/MM/YYYY")}
          </Tooltip>
        ),
        sorter: true,
      },
      {
        title: "Ref. No.",
        dataIndex: "ref_no",
        width: 140,
        render: (text: string) => (
          <span style={{ fontFamily: "monospace", fontWeight: 500 }}>
            {text || "No Ref"}
          </span>
        ),
      },
      {
        title: "Entries",
        width: 100,
        render: (record: Journal) => (
          <Tag color="purple">{record.entries?.length || 0} entries</Tag>
        ),
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
        title: "Total",
        dataIndex: "total",
        width: 140,
        align: "right" as const,
        render: (amount: number) => (
          <span style={{ fontWeight: 600, color: "#1890ff" }}>
            {formatCurrency(amount)}
          </span>
        ),
        sorter: true,
      },
      {
        title: "Action",
        width: 120,
        fixed: "right" as const,
        render: (record: Journal) => (
          <Space size="small">
            <Tooltip title="View Details">
              <Button type="text" icon={<FileTextOutlined />} size="small" />
            </Tooltip>
            <Tooltip title="Print">
              <Button type="text" icon={<PrinterOutlined />} size="small" />
            </Tooltip>
          </Space>
        ),
      },
    ],
    []
  );

  const entryColumns = useMemo(
    () => [
      {
        title: "Nominal Account",
        dataIndex: "nominal_account",
        render: (account: { name: string; code: string } | null) => (
          <div>
            <Tag color="green">{account?.code || "N/A"}</Tag>
            <br />
            <span style={{ fontSize: "12px", color: "#666" }}>
              {account?.name || "No Account"}
            </span>
          </div>
        ),
      },
      {
        title: "Debit",
        dataIndex: "debit",
        width: 120,
        align: "right" as const,
        render: (amount: number) => (
          <span
            style={{
              fontWeight: amount > 0 ? 600 : 400,
              color: amount > 0 ? "#52c41a" : "#d9d9d9",
            }}
          >
            {amount > 0 ? `$${amount.toLocaleString()}` : "-"}
          </span>
        ),
      },
      {
        title: "Credit",
        dataIndex: "credit",
        width: 120,
        align: "right" as const,
        render: (amount: number) => (
          <span
            style={{
              fontWeight: amount > 0 ? 600 : 400,
              color: amount > 0 ? "#ff7875" : "#d9d9d9",
            }}
          >
            {amount > 0 ? `$${amount.toLocaleString()}` : "-"}
          </span>
        ),
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
    ],
    []
  );

  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.nominal_ids?.length ||
      filters.ref_no ||
      filters.dateRange
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
      <Title level={3}>Journals</Title>

      <Space size="middle" wrap style={{ marginBottom: 16 }}>
        <Select
          mode="multiple"
          placeholder="Select Nominals"
          style={{ width: 240 }}
          value={filters.nominal_ids}
          onChange={(value) => handleFilterChange("nominal_ids", value)}
          allowClear
          maxTagCount={2}
        >
          <Option value="nominal1">Cash Account</Option>
          <Option value="nominal2">Bank Account</Option>
          <Option value="nominal3">Revenue Account</Option>
          <Option value="nominal4">Expense Account</Option>
        </Select>

        <Input
          placeholder="Ref No."
          value={filters.ref_no}
          onChange={(e) => handleFilterChange("ref_no", e.target.value)}
          style={{ width: 140 }}
          allowClear
        />

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
          Clear
        </Button>

        <Button icon={<SearchOutlined />} onClick={async () => await fetch()}>
          Search
        </Button>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="middle"
          onClick={() => navigate("/journal/new")}
        >
          Add New
        </Button>
      </Space>

      {/* <Flex justify="space-between" style={{ marginBottom: 16 }}>
        <Space>
          <Button icon={<FileExcelOutlined />} size="small">
            Excel
          </Button>
          <Button icon={<FilePdfOutlined />} size="small">
            PDF
          </Button>
          <Button icon={<PrinterOutlined />} size="small">
            Print
          </Button>
        </Space>
      </Flex> */}

      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          showSizeChanger: false,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `Showing ${range[0]} to ${range[1]} of ${total} entries`,
          size: "small",
        }}
        rowKey="id"
        expandable={{
          expandedRowRender: (record) => (
            <div
              style={{
                margin: "0 24px",
                backgroundColor: "#fafafa",
                padding: "16px",
                borderRadius: "6px",
              }}
            >
              <Typography.Text
                strong
                style={{ marginBottom: 12, display: "block" }}
              >
                Journal Entries:
              </Typography.Text>
              <Table
                columns={entryColumns}
                dataSource={record.entries}
                pagination={false}
                rowKey="id"
                size="small"
              />
            </div>
          ),
          rowExpandable: (record) => record.entries?.length > 0,
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <DownOutlined
                onClick={(e) => onExpand(record, e)}
                style={{ color: "#1890ff", cursor: "pointer" }}
              />
            ) : (
              <RightOutlined
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

export default JournalsListing;
