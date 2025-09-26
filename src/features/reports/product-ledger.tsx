import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Row,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PaginatedSelect from "../../components/common/paginated-select/paginated-select";
import { getInventoryApi } from "../../services/inventory.services";
import { getProductLedgerReport } from "../../services/reports.services";
import { buildQueryString, formatCurrency } from "../../utils";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface ProductLedgerEntry {
  id: string;
  date: string;
  type: string;
  accountName: string;
  voucherNo?: string;
  docNo?: string;
  unit: string;
  inBaseQty: number;
  outBaseQty: number;
  baseQtyBalance: number;
  netAmount: number;
  product: {
    id: string;
    name: string;
    code: string;
  };
}

interface ProductLedgerSummary {
  product: {
    id: string;
    name: string;
    code: string;
  };
  totalInQty: number;
  totalOutQty: number;
  totalNetAmount: number;
  transactions: ProductLedgerEntry[];
}

const ProductLedger: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProductLedgerSummary[]>([]);

  const initialValues = {
    dateRange:
      searchParams.get("date_from") && searchParams.get("date_to")
        ? [
            dayjs(searchParams.get("date_from")),
            dayjs(searchParams.get("date_to")),
          ]
        : [dayjs().startOf("month"), dayjs().endOf("month")],
    product_ids: searchParams.get("product_ids")?.split(",") || [],
    category: searchParams.get("category") || undefined,
    transaction_type: searchParams.get("transaction_type") || "ALL",
    balance_forward: searchParams.get("balance_forward") === "true",
  };

  const fetchReport = async (values: any) => {
    setLoading(true);
    try {
      const params: Record<string, any> = {};

      if (values.dateRange) {
        params.date_from = values.dateRange[0].format("YYYY-MM-DD");
        params.date_to = values.dateRange[1].format("YYYY-MM-DD");
      }

      if (values.product_ids?.length) {
        params.product_ids = values.product_ids;
      }

      if (values.category) {
        params.category = values.category;
      }

      if (values.transaction_type && values.transaction_type !== "ALL") {
        params.transaction_type = values.transaction_type;
      }

      if (values.balance_forward) {
        params.balance_forward = true;
      }

      const queryString = buildQueryString(params);
      const response = await getProductLedgerReport(queryString);

      if (response.success) {
        setData(response.data || []);

        // Update URL params
        const urlParams = new URLSearchParams();
        if (params.date_from) urlParams.set("date_from", params.date_from);
        if (params.date_to) urlParams.set("date_to", params.date_to);
        if (params.product_ids?.length)
          urlParams.set("product_ids", params.product_ids.join(","));
        if (params.category) urlParams.set("category", params.category);
        if (params.transaction_type && params.transaction_type !== "ALL")
          urlParams.set("transaction_type", params.transaction_type);
        if (params.balance_forward) urlParams.set("balance_forward", "true");

        setSearchParams(urlParams);
      }
    } catch (error) {
      console.error("Error fetching product ledger:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
    fetchReport(initialValues);
  }, []);

  const columns: ColumnsType<ProductLedgerEntry> = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 100,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 100,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "A/C No.",
      dataIndex: "accountName",
      key: "accountName",
      width: 150,
    },
    {
      title: "Account",
      dataIndex: "accountName",
      key: "account",
      width: 200,
    },
    {
      title: "V. ID",
      dataIndex: "voucherNo",
      key: "voucherNo",
      width: 80,
    },
    {
      title: "Doc No.",
      dataIndex: "docNo",
      key: "docNo",
      width: 120,
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      width: 60,
    },
    {
      title: "In Base QTY",
      dataIndex: "inBaseQty",
      key: "inBaseQty",
      width: 100,
      align: "right",
      render: (qty) => (qty > 0 ? qty.toLocaleString() : "-"),
    },
    {
      title: "Out Base QTY",
      dataIndex: "outBaseQty",
      key: "outBaseQty",
      width: 100,
      align: "right",
      render: (qty) => (qty > 0 ? qty.toLocaleString() : "-"),
    },
    {
      title: "Base Qty Balance",
      dataIndex: "baseQtyBalance",
      key: "baseQtyBalance",
      width: 120,
      align: "right",
      render: (balance) => (
        <span
          style={{
            fontWeight: 500,
            color: balance < 0 ? "#ff4d4f" : balance > 0 ? "#52c41a" : "#000",
          }}
        >
          {balance.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Net Amount",
      dataIndex: "netAmount",
      key: "netAmount",
      width: 120,
      align: "right",
      render: (amount) => (
        <span
          style={{
            fontWeight: 500,
            color: amount < 0 ? "#ff4d4f" : amount > 0 ? "#52c41a" : "#000",
          }}
        >
          {formatCurrency(amount || 0)}
        </span>
      ),
    },
  ];

  const renderProductSummary = (summary: ProductLedgerSummary) => (
    <Card
      key={summary.product.id}
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
              {summary.product.name}
            </Text>
            <Text type="secondary" style={{ marginLeft: "8px" }}>
              ({summary.product.code})
            </Text>
          </div>
        </div>
      }
    >
      <Table
        columns={columns}
        dataSource={summary.transactions}
        rowKey={(record) => `${summary.product.id}-${record.id}`}
        pagination={false}
        size="small"
        scroll={{ x: 1200 }}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={7}>
              <Text strong>Total</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={7} align="right">
              <Text strong>{summary.totalInQty.toLocaleString()}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={8} align="right">
              <Text strong>{summary.totalOutQty.toLocaleString()}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={9} align="right">
              <Text strong>
                {(summary.totalInQty - summary.totalOutQty).toLocaleString()}
              </Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={10} align="right">
              <Text strong>{formatCurrency(summary.totalNetAmount)}</Text>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
    </Card>
  );

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Product Transaction Details</Title>

      <Card style={{ marginBottom: "24px" }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={fetchReport}
          initialValues={initialValues}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="Transaction Type" name="transaction_type">
                <Select placeholder="Select transaction type">
                  <Option value="ALL">All</Option>
                  <Option value="SALE">Sale</Option>
                  <Option value="PURCHASE">Purchase</Option>
                  <Option value="PRODUCTION">Production</Option>
                  <Option value="ADJUSTMENT">Adjustment</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
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

            <Col span={6}>
              <Form.Item label="Category (Optional)" name="category">
                <Select
                  placeholder="Select category"
                  allowClear
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {/* Categories would be loaded dynamically */}
                </Select>
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="Products (Optional)" name="product_ids">
                <PaginatedSelect
                  mode="multiple"
                  placeholder="Select products to filter"
                  api={getInventoryApi}
                  value={[]}
                  onChange={() => {}}
                  optionLabelProp="label"
                  allowClear
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={3}>
              <Form.Item name="balance_forward" valuePropName="checked">
                <Checkbox>B/FWD</Checkbox>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item label=" ">
                <Space>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Run Report
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {data.length > 0
        ? data.map((summary) => renderProductSummary(summary))
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

export default ProductLedger;
