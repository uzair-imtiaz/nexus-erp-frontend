import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Row,
  Space,
  Table,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PaginatedSelect from "../../components/common/paginated-select/paginated-select";
import { getCustomersApi } from "../../services/customers.services";
import { getEntityLedgerReport } from "../../services/reports.services";
import { getVendorsApi } from "../../services/vendors.services";
import { buildQueryString, formatCurrency } from "../../utils";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface EntityLedgerEntry {
  id: string;
  date: string;
  ref?: string;
  voucherNo?: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  entity: {
    id: string;
    name: string;
    code: string;
  };
}

interface EntityLedgerSummary {
  entity: {
    id: string;
    name: string;
    code: string;
  };
  totalDebit: number;
  totalCredit: number;
  transactions: EntityLedgerEntry[];
}

interface EntityLedgerProps {
  entityType: "customer" | "vendor";
  title: string;
}

const EntityLedger: React.FC<EntityLedgerProps> = ({ entityType, title }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EntityLedgerSummary[]>([]);

  const initialValues = {
    dateRange:
      searchParams.get("date_from") && searchParams.get("date_to")
        ? [
            dayjs(searchParams.get("date_from")),
            dayjs(searchParams.get("date_to")),
          ]
        : [dayjs().startOf("month"), dayjs().endOf("month")],
    entity_ids: searchParams.get("entity_ids")?.split(",") || [],
    balance_forward: searchParams.get("balance_forward") === "true",
  };

  const fetchReport = async (values: any) => {
    setLoading(true);
    try {
      const params: unknown = {
        entity_type: entityType,
      };

      if (values.dateRange) {
        params.date_from = values.dateRange[0].format("YYYY-MM-DD");
        params.date_to = values.dateRange[1].format("YYYY-MM-DD");
      }

      if (values.entity_ids?.length) {
        params.entity_ids = values.entity_ids;
      }

      if (values.balance_forward) {
        params.balance_forward = true;
      }

      const queryString = buildQueryString(params);
      const response = await getEntityLedgerReport(entityType, queryString);

      if (response.success) {
        setData(response.data || []);

        // Update URL params
        const urlParams = new URLSearchParams();
        if (params.date_from) urlParams.set("date_from", params.date_from);
        if (params.date_to) urlParams.set("date_to", params.date_to);
        if (params.entity_ids?.length)
          urlParams.set("entity_ids", params.entity_ids.join(","));
        if (params.balance_forward) urlParams.set("balance_forward", "true");

        setSearchParams(urlParams);
      }
    } catch (error) {
      console.error(`Error fetching ${entityType} ledger:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
    fetchReport(initialValues);
  }, []);

  const columns: ColumnsType<EntityLedgerEntry> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 100,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ref No.",
      dataIndex: "ref",
      key: "ref",
      width: 120,
    },
    {
      title: "V. No.",
      dataIndex: "voucherNo",
      key: "voucherNo",
      width: 80,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 300,
    },
    {
      title: "Debit",
      dataIndex: "debit",
      key: "debit",
      width: 120,
      align: "right",
      render: (amount) => (amount > 0 ? formatCurrency(amount) : "-"),
    },
    {
      title: "Credit",
      dataIndex: "credit",
      key: "credit",
      width: 120,
      align: "right",
      render: (amount) => (amount > 0 ? formatCurrency(amount) : "-"),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      width: 140,
      align: "right",
      render: (balance) => (
        <span
          style={{
            fontWeight: 500,
            color: balance < 0 ? "#ff4d4f" : balance > 0 ? "#52c41a" : "#000",
          }}
        >
          {formatCurrency(balance || 0)}
        </span>
      ),
    },
  ];

  const renderEntitySummary = (summary: EntityLedgerSummary, index: number) => (
    <Card
      key={summary.entity.id}
      style={{ marginBottom: "24px" }}
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Text strong style={{ fontSize: "16px" }}>
              {summary.entity.name}
            </Text>
            <Text type="secondary" style={{ marginLeft: "8px" }}>
              ({summary.entity.code})
            </Text>
          </div>
        </div>
      }
    >
      <Table
        columns={columns}
        dataSource={summary.transactions}
        rowKey={(record) => `${summary.entity.id}-${record.id}`}
        pagination={false}
        size="small"
        scroll={{ x: 1000 }}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={4}>
              <Text strong>Total</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={5} align="right">
              <Text strong>{formatCurrency(summary.totalDebit)}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={6} align="right">
              <Text strong>{formatCurrency(summary.totalCredit)}</Text>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
    </Card>
  );

  const fetchEntities =
    entityType === "customer" ? getCustomersApi : getVendorsApi;
  const entityLabel = entityType === "customer" ? "Customers" : "Vendors";

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>{title}</Title>

      <Card style={{ marginBottom: "24px" }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={fetchReport}
          initialValues={initialValues}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Date Range"
                name="dateRange"
                rules={[
                  { required: true, message: "Please select date range" },
                ]}
              >
                <RangePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label={`${entityLabel} (Optional)`} name="entity_ids">
                <PaginatedSelect
                  mode="multiple"
                  placeholder={`Select ${entityLabel.toLowerCase()} to filter`}
                  fetchOptions={fetchEntities}
                  optionLabelProp="label"
                  allowClear
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            {/* <Col span={3}>
              <Form.Item name="balance_forward" valuePropName="checked">
                <Checkbox>Balance Forward</Checkbox>
              </Form.Item>
            </Col> */}

            <Col span={3}>
              <Form.Item label=" ">
                <Space>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Generate Report
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {data.length > 0
        ? data.map((summary, index) => renderEntitySummary(summary, index))
        : !loading && (
            <Card>
              <div style={{ textAlign: "center", padding: "40px" }}>
                <Text type="secondary">
                  No data found for the selected criteria
                </Text>
              </div>
            </Card>
          )}
    </div>
  );
};

export default EntityLedger;
