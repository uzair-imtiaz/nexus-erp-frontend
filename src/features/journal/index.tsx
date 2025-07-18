import {
  DownOutlined,
  PlusOutlined,
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
import { getAccountByTypeApi } from "../../services/charts-of-accounts.services";
import { getJournalsApi } from "../../services/journals.services";
import { buildQueryString, formatCurrency } from "../../utils";
import { Filters, Journal, JournalEntry, Pagination } from "./types";

const { RangePicker } = DatePicker;

const JournalsListing = () => {
  const [filters, setFilters] = useState<Filters>({
    nominal_ids: undefined,
    ref: undefined,
    dateRange: null,
  });
  const [loading, setLoading] = useState(false);
  const [nominals, setNominals] = useState<any>([]);
  const [data, setData] = useState<Journal[]>([]);
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

  // Memoized fetch function
  const fetch = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        const { nominal_ids, ref, dateRange } = filters;

        const queryString = buildQueryString({
          nominal_ids: nominal_ids?.join(","),
          ref,
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
    const fetchNominals = async () => {
      try {
        const response = await getAccountByTypeApi("subAccount");
        if (!response.success) {
          return notification.error({
            message: "Error",
            description: response.message,
          });
        }
        setNominals(response.data);
      } catch (error: any) {
        notification.error({
          message: "Error",
          description: error?.message,
        });
      }
    };

    fetchNominals();
    fetch();
  }, []);

  const handleFilterChange = useCallback((key: keyof Filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      nominal_ids: undefined,
      ref: undefined,
      dateRange: null,
    });
  }, []);

  // Memoized columns
  const columns = useMemo(
    () => [
      {
        title: "Journal ID",
        dataIndex: "id",
        width: 80,
        fixed: "left" as const,
        render: (text: string) => (
          <Tag color="blue" style={{ fontFamily: "monospace" }}>
            {text}
          </Tag>
        ),
        sorter: (a: Journal, b: Journal) => Number(a.id) - Number(b.id),
      },
      {
        title: "Date",
        dataIndex: "date",
        width: 120,
        render: (text: string) => dayjs(text).format("DD-MM-YYYY"),
        sorter: (a: Journal, b: Journal) =>
          dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
      },
      {
        title: "Description",
        dataIndex: "description",
        width: 200,
      },
      {
        title: "Total",
        dataIndex: "total",
        width: 140,
        // align: "right" as const,
        render: (_: any, record: Journal) => {
          const amount = record.details.reduce(
            (total, entry) =>
              Number(total) + Number(entry.debit) - Number(entry.credit),
            0
          );
          return (
            <span style={{ fontWeight: 600, color: "#1890ff" }}>
              {formatCurrency(amount)}
            </span>
          );
        },
        sorter: (a: Journal, b: Journal) => {
          const totalA = a.details.reduce(
            (total: number, entry: JournalEntry) =>
              Number(total) + Number(entry.debit) - Number(entry.credit),
            0
          );
          const totalB = b.details.reduce(
            (total: number, entry: JournalEntry) =>
              Number(total) + Number(entry.debit) - Number(entry.credit),
            0
          );
          return totalA - totalB;
        },
      },
      // {
      //   title: "Action",
      //   dataIndex: "action",
      //   width: 120,
      //   align: "right" as const,
      //   render: (_: any, record: Journal) => {
      //     return (
      //       <Space size="small" align="end">
      //         <Button
      //           size="small"
      //           type="link"
      //           icon={<EditOutlined />}
      //           onClick={() => {}}
      //         />
      //         <Popconfirm title="Are you sure you want to delete this journal?">
      //           <Button danger type="link" icon={<DeleteOutlined />} />
      //         </Popconfirm>
      //       </Space>
      //     );
      //   },
      // },
    ],
    []
  );

  const entryColumns = useMemo(
    () => [
      {
        title: "Nominal Account",
        dataIndex: "nominalAccount",
        width: 300,
        render: (account: { name: string } | null) => (
          <Tag color="green">{account?.name || "No Account"}</Tag>
        ),
      },
      {
        title: "Debit",
        dataIndex: "debit",
        width: 120,
        // align: "right" as const,
        render: (amount: number) => (
          <span
            style={{
              fontWeight: amount > 0 ? 600 : 400,
              color: amount > 0 ? "#52c41a" : "#d9d9d9",
            }}
          >
            {formatCurrency(amount)}
          </span>
        ),
      },
      {
        title: "Credit",
        dataIndex: "credit",
        width: 120,
        render: (amount: number) => (
          <span
            style={{
              fontWeight: amount > 0 ? 600 : 400,
              color: amount > 0 ? "#ff7875" : "#d9d9d9",
            }}
          >
            {formatCurrency(amount)}{" "}
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
    return !!(filters.nominal_ids?.length || filters.ref || filters.dateRange);
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
          {nominals.map((nominal) => (
            <Select.Option key={nominal.id} value={nominal.id}>
              {nominal.name} ({nominal.code})
            </Select.Option>
          ))}
        </Select>

        <Input
          placeholder="Ref No."
          value={filters.ref}
          onChange={(e) => handleFilterChange("ref", e.target.value)}
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
        rowKey="id"
        size="small"
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
        expandable={{
          expandedRowRender: (record) => (
            <Table
              columns={entryColumns}
              dataSource={record.details}
              pagination={false}
              rowKey="id"
              size="small"
            />
          ),
          rowExpandable: (record) => record.details?.length > 0,
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
      />
    </div>
  );
};

export default JournalsListing;
