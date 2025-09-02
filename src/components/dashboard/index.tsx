import {
  ArrowUpOutlined,
  DownloadOutlined,
  ExperimentOutlined,
  EyeOutlined,
  InboxOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  List,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";

import { Line, Pie } from "@ant-design/plots";
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { formatCurrency } from "../../utils";
import { config, expensesConfig } from "./graph-utils";

const { Text } = Typography;

interface Transaction {
  key: string;
  date: string;
  description: string;
  category: string;
  amount: string;
  status: "Completed" | "Pending";
}

interface AccountItem {
  status: string;
  count: number;
  amount: string;
}

const Dashboard: React.FC = () => {
  const { themeMode } = useTheme();
  const recentTransactions: Transaction[] = [
    {
      key: "1",
      date: "Oct 15, 2024",
      description: "Client Payment - ABC Corp",
      category: "Accounts Receivable",
      amount: "$5,240.00",
      status: "Completed",
    },
    {
      key: "2",
      date: "Oct 14, 2024",
      description: "Office Supplies Purchase",
      category: "Office Expenses",
      amount: "$845.75",
      status: "Completed",
    },
    {
      key: "3",
      date: "Oct 13, 2024",
      description: "Vendor Payment - XYZ Ltd",
      category: "Accounts Payable",
      amount: "$2,340.50",
      status: "Completed",
    },
    {
      key: "4",
      date: "Oct 12, 2024",
      description: "Software Subscription",
      category: "Technology",
      amount: "$299.00",
      status: "Completed",
    },
    {
      key: "5",
      date: "Oct 11, 2024",
      description: "Client Payment - DEF Inc",
      category: "Accounts Receivable",
      amount: "$8,750.00",
      status: "Completed",
    },
  ];

  const transactionColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: string) => <Text strong>{amount}</Text>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Completed" ? "green" : "orange"}>{status}</Tag>
      ),
    },
  ];

  const accountsReceivable: AccountItem[] = [
    { status: "Current", count: 12, amount: "$14,560.00" },
    { status: "1-30 Days", count: 6, amount: "$7,240.00" },
    { status: "31-60 Days", count: 4, amount: "$3,120.00" },
    { status: ">60 Days", count: 2, amount: "$2,880.00" },
  ];

  const accountsPayable: AccountItem[] = [
    { status: "Current", count: 9, amount: "$8,560.25" },
    { status: "1-30 Days", count: 7, amount: "$4,110.50" },
    { status: "31-60 Days", count: 3, amount: "$1,890.00" },
    { status: ">60 Days", count: 2, amount: "$560.00" },
  ];

  return (
    <div style={{ padding: "24px", minHeight: "100vh" }}>
      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={
                <Space
                  style={{ justifyContent: "space-between", width: "100%" }}
                >
                  <span>
                    <InboxOutlined className="mr-2" />
                    Inventory
                  </span>
                  <Button shape="circle" icon={<PlusOutlined />} size="small" />
                </Space>
              }
              value={formatCurrency(248560)}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              suffix="$"
            />
            <Text type="secondary">Last Updated Value</Text>
            <br />
            <Text type="success">
              <ArrowUpOutlined /> +5.2% from last month
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={
                <Space
                  style={{ justifyContent: "space-between", width: "100%" }}
                >
                  <span>
                    <ShoppingCartOutlined className="mr-2" />
                    Sales
                  </span>
                  <Button shape="circle" icon={<PlusOutlined />} size="small" />
                </Space>
              }
              value={formatCurrency(482290)}
              precision={0}
              valueStyle={{ color: "#1890ff" }}
            />
            <Text type="secondary">Current Month Sales</Text>
            <br />
            <Text type="success">
              <ArrowUpOutlined /> +12.4% from last month
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={
                <Space
                  style={{ justifyContent: "space-between", width: "100%" }}
                >
                  <span>
                    <ExperimentOutlined className="mr-2" />
                    Production
                  </span>
                  <Button shape="circle" icon={<PlusOutlined />} size="small" />
                </Space>
              }
              value={142850}
              precision={0}
              valueStyle={{ color: "#13c2c2" }}
              suffix=" units"
            />
            <Text type="secondary">Monthly Production Output</Text>
            <br />
            <Text type="success">
              <ArrowUpOutlined /> +8.2% from last month
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Simple P&L"
              value={formatCurrency(126740)}
              precision={0}
              valueStyle={{ color: "#52c41a" }}
            />
            <Text type="secondary">Net Profit This Month</Text>
            <br />
            <Text type="success">
              <ArrowUpOutlined /> +15.7% from last month
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Expenses Breakdown">
            <Pie
              data={[
                { name: "Operations", value: 5000 },
                { name: "Marketing", value: 3000 },
                { name: "Admin", value: 2000 },
              ]}
              {...expensesConfig}
              theme={{
                type: themeMode === "dark" ? "classicDark" : "classic",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Income vs Expenses">
            <Line
              {...config}
              theme={{
                type: themeMode === "dark" ? "classicDark" : "classic",
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Transactions */}
      <Card
        title="Recent Transactions"
        extra={
          <Button type="link" icon={<EyeOutlined />}>
            View All
          </Button>
        }
        style={{ marginBottom: 24 }}
      >
        <Table
          dataSource={recentTransactions}
          columns={transactionColumns}
          pagination={false}
          size="small"
        />
      </Card>

      {/* Bottom Row */}
      <Row gutter={[16, 16]}>
        {/* Accounts Receivable */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <DownloadOutlined />
                Accounts Receivable
              </Space>
            }
          >
            <Statistic
              title="Total Outstanding"
              value={28420}
              precision={2}
              prefix="$"
              style={{ marginBottom: 16 }}
            />
            <List
              dataSource={accountsReceivable}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text>{item.status}</Text>
                        <Badge
                          count={item.count}
                          style={{ backgroundColor: "#52c41a" }}
                        />
                      </Space>
                    }
                  />
                  <Text strong>{item.amount}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Accounts Payable */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <DownloadOutlined />
                Accounts Payable
              </Space>
            }
          >
            <Statistic
              title="Total Outstanding"
              value={15520.75}
              precision={2}
              prefix="$"
              style={{ marginBottom: 16 }}
            />
            <List
              dataSource={accountsPayable}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <Text>{item.status}</Text>
                        <Badge
                          count={item.count}
                          style={{ backgroundColor: "#faad14" }}
                        />
                      </Space>
                    }
                  />
                  <Text strong>{item.amount}</Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
