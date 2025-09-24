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
import { getInventories } from "../../apis";
import { getProductLedgerReport } from "../../services/reports.services";
import { buildQueryString, formatCurrency } from "../../utils";

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface ProductLedgerEntry {
  id: string;
  date: string;
  ref: string;
  description: string;
  transaction_type:
    | "OPENING"
    | "PURCHASE"
    | "SALE"
    | "PRODUCTION"
    | "ADJUSTMENT";
  quantity_in: number;
  quantity_out: number;
  balance_quantity: number;
  rate: number;
  amount_in: number;
  amount_out: number;
  balance_amount: number;
  inventory: {
    id: string;
    name: string;
    code: string;
    baseUnit?: string;
  };
}

const ProductLedger: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProductLedgerEntry[]>([]);

  const initialValues = {
    dateRange:
      searchParams.get("date_from") && searchParams.get("date_to")
        ? [
            dayjs(searchParams.get("date_from")),
            dayjs(searchParams.get("date_to")),
          ]
        : [dayjs().startOf("month"), dayjs().endOf("month")],
    inventory_ids: searchParams.get("inventory_ids")?.split(",") || [],
    category: searchParams.get("category") || undefined,
    balance_forward: searchParams.get("balance_forward") === "true",
  };

  const fetchReport = async (values: any) => {
    setLoading(true);
    try {
      const params: any = {};

      if (values.dateRange) {
        params.date_from = values.dateRange[0].format("YYYY-MM-DD");
        params.date_to = values.dateRange[1].format("YYYY-MM-DD");
      }

      if (values.inventory_ids?.length) {
        params.inventory_ids = values.inventory_ids;
      }

      if (values.category) {
        params.category = values.category;
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
        if (params.inventory_ids?.length)
          urlParams.set("inventory_ids", params.inventory_ids.join(","));
        if (params.category) urlParams.set("category", params.category);
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

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "OPENING":
        return "#52c41a";
      case "PURCHASE":
        return "#1890ff";
      case "SALE":
        return "#ff4d4f";
      case "PRODUCTION":
        return "#722ed1";
      case "ADJUSTMENT":
        return "#fa8c16";
      default:
        return "#000";
    }
  };

  const columns: ColumnsType<ProductLedgerEntry> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 100,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ref",
      dataIndex: "ref",
      key: "ref",
      width: 100,
    },
    {
      title: "Product",
      key: "product",
      width: 200,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.inventory.name}</div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            {record.inventory.code}
          </div>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 250,
    },
    {
      title: "Type",
      dataIndex: "transaction_type",
      key: "transaction_type",
      width: 100,
      render: (type) => (
        <span style={{ color: getTransactionTypeColor(type), fontWeight: 500 }}>
          {type}
        </span>
      ),
    },
    {
      title: "Qty In",
      dataIndex: "quantity_in",
      key: "quantity_in",
      width: 80,
      align: "right",
      render: (qty) => (qty > 0 ? qty.toLocaleString() : "-"),
    },
    {
      title: "Qty Out",
      dataIndex: "quantity_out",
      key: "quantity_out",
      width: 80,
      align: "right",
      render: (qty) => (qty > 0 ? qty.toLocaleString() : "-"),
    },
    {
      title: "Balance Qty",
      dataIndex: "balance_quantity",
      key: "balance_quantity",
      width: 100,
      align: "right",
      render: (qty) => (
        <span style={{ fontWeight: 500 }}>{qty?.toLocaleString() || 0}</span>
      ),
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      width: 100,
      align: "right",
      render: (rate) => formatCurrency(rate),
    },
    {
      title: "Amount In",
      dataIndex: "amount_in",
      key: "amount_in",
      width: 120,
      align: "right",
      render: (amount) => (amount > 0 ? formatCurrency(amount) : "-"),
    },
    {
      title: "Amount Out",
      dataIndex: "amount_out",
      key: "amount_out",
      width: 120,
      align: "right",
      render: (amount) => (amount > 0 ? formatCurrency(amount) : "-"),
    },
    {
      title: "Balance Amount",
      dataIndex: "balance_amount",
      key: "balance_amount",
      width: 140,
      align: "right",
      render: (amount) => (
        <span style={{ fontWeight: 500 }}>{formatCurrency(amount || 0)}</span>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Product Ledger Report</Title>

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

            <Col span={6}>
              <Form.Item label="Products (Optional)" name="inventory_ids">
                <PaginatedSelect
                  mode="multiple"
                  placeholder="Select products to filter"
                  fetchOptions={getInventories}
                  optionLabelProp="label"
                  allowClear
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="Category (Optional)" name="category">
                <Select
                  placeholder="Select category"
                  allowClear
                  style={{ width: "100%" }}
                >
                  <Select.Option value="Raw Material">
                    Raw Material
                  </Select.Option>
                  <Select.Option value="Semi-Finished Goods">
                    Semi-Finished Goods
                  </Select.Option>
                  <Select.Option value="Finished Goods">
                    Finished Goods
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={3}>
              <Form.Item name="balance_forward" valuePropName="checked">
                <Checkbox>Balance Forward</Checkbox>
              </Form.Item>
            </Col>

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

      <Card>
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 50,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: 1400 }}
          size="small"
        />
      </Card>
    </div>
  );
};

export default ProductLedger;
