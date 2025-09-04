import {
  ArrowUpOutlined,
  CalendarOutlined,
  DownloadOutlined,
  ExperimentOutlined,
  InboxOutlined,
  PlusOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  List,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  Typography,
} from "antd";

import { Line, Pie } from "@ant-design/plots";
import dayjs from "dayjs";
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useDashboardData } from "../../hooks/useDashboardData";
import { formatCurrency } from "../../utils";
import { expensesConfig, incomeConfig } from "./graph-utils";

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

interface AccountItem {
  status: string;
  count: number;
  amount: string;
}

const Dashboard: React.FC = () => {
  const { themeMode } = useTheme();
  const { data, loading, refetch, filters, updateFilters } = useDashboardData();

  // Handle date range change
  const handleDateRangeChange = (dates: unknown) => {
    if (dates && dates.length === 2) {
      updateFilters({
        dateRange: {
          startDate: dates[0].format("YYYY-MM-DD"),
          endDate: dates[1].format("YYYY-MM-DD"),
        },
      });
    }
  };

  // Format transaction data for table
  const formattedTransactions = data.recentTransactions.map(
    (transaction, index) => ({
      key: transaction.id || index.toString(),
      date: dayjs(transaction.date).format("MMM DD, YYYY"),
      description: transaction.description,
      category: transaction.type,
      amount: formatCurrency(transaction.amount),
    })
  );

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
  ];

  // Format accounts receivable data
  const accountsReceivable: AccountItem[] = data.accountsData?.receivable
    ? [
        {
          status: "Current",
          count: data.accountsData.receivable.buckets.current.count,
          amount: formatCurrency(
            data.accountsData.receivable.buckets.current.amount
          ),
        },
        {
          status: "1-30 Days",
          count: data.accountsData.receivable.buckets.days1to30.count,
          amount: formatCurrency(
            data.accountsData.receivable.buckets.days1to30.amount
          ),
        },
        {
          status: "31-60 Days",
          count: data.accountsData.receivable.buckets.days31to60.count,
          amount: formatCurrency(
            data.accountsData.receivable.buckets.days31to60.amount
          ),
        },
        {
          status: ">60 Days",
          count: data.accountsData.receivable.buckets.daysOver60.count,
          amount: formatCurrency(
            data.accountsData.receivable.buckets.daysOver60.amount
          ),
        },
      ]
    : [];

  // Format accounts payable data
  const accountsPayable: AccountItem[] = data.accountsData?.payable
    ? [
        {
          status: "Current",
          count: data.accountsData.payable.buckets.current.count,
          amount: formatCurrency(
            data.accountsData.payable.buckets.current.amount
          ),
        },
        {
          status: "1-30 Days",
          count: data.accountsData.payable.buckets.days1to30.count,
          amount: formatCurrency(
            data.accountsData.payable.buckets.days1to30.amount
          ),
        },
        {
          status: "31-60 Days",
          count: data.accountsData.payable.buckets.days31to60.count,
          amount: formatCurrency(
            data.accountsData.payable.buckets.days31to60.amount
          ),
        },
        {
          status: ">60 Days",
          count: data.accountsData.payable.buckets.daysOver60.count,
          amount: formatCurrency(
            data.accountsData.payable.buckets.daysOver60.amount
          ),
        },
      ]
    : [];

  // Prepare chart data
  const expensesChartData =
    data.chartData?.expensesBreakdown?.map((item) => ({
      name: item.category,
      value: item.value,
    })) || [];

  const incomeChartData =
    data.chartData?.incomeVsExpenses?.flatMap((item) => [
      {
        date: item.month,
        type: "Income",
        value: item.income,
      },
      {
        date: item.month,
        type: "Expenses",
        value: item.expenses,
      },
      {
        date: item.month,
        type: "Profit",
        value: item.profit,
      },
    ]) || [];

  return (
    <div style={{ padding: "24px", minHeight: "100vh" }}>
      {/* Header with Date Range Filter */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            Dashboard
          </Title>
        </Col>
        <Col>
          <Space size="middle">
            <RangePicker
              value={
                filters.dateRange
                  ? [
                      dayjs(filters.dateRange.startDate),
                      dayjs(filters.dateRange.endDate),
                    ]
                  : null
              }
              onChange={handleDateRangeChange}
              format="YYYY-MM-DD"
              placeholder={["Start Date", "End Date"]}
              suffixIcon={<CalendarOutlined />}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                refetch.summary();
                refetch.charts();
                refetch.accounts();
                refetch.transactions();
              }}
            >
              Refresh
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Spin spinning={loading.summary}>
              <Statistic
                title={
                  <Space
                    style={{ justifyContent: "space-between", width: "100%" }}
                  >
                    <span>
                      <InboxOutlined className="mr-2" />
                      Inventory
                    </span>
                    <Button
                      shape="circle"
                      icon={<PlusOutlined />}
                      size="small"
                    />
                  </Space>
                }
                value={formatCurrency(data.summary?.inventory.value || 0, 0)}
                precision={0}
                valueStyle={{ color: "#3f8600" }}
              />
              <Text type="secondary">Last Updated Value</Text>
              <br />
              <Text
                type={
                  data.summary?.inventory.change.startsWith("+")
                    ? "success"
                    : "danger"
                }
              >
                <ArrowUpOutlined /> {data.summary?.inventory.change || "0%"}{" "}
                from last month
              </Text>
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Spin spinning={loading.summary}>
              <Statistic
                title={
                  <Space
                    style={{ justifyContent: "space-between", width: "100%" }}
                  >
                    <span>
                      <ShoppingCartOutlined className="mr-2" />
                      Sales
                    </span>
                    <Button
                      shape="circle"
                      icon={<PlusOutlined />}
                      size="small"
                    />
                  </Space>
                }
                value={formatCurrency(data.summary?.sales.value || 0, 0)}
                precision={0}
                valueStyle={{ color: "#1890ff" }}
              />
              <Text type="secondary">Current Month Sales</Text>
              <br />
              <Text
                type={
                  data.summary?.sales.change.startsWith("+")
                    ? "success"
                    : "danger"
                }
              >
                <ArrowUpOutlined /> {data.summary?.sales.change || "0%"} from
                last month
              </Text>
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Spin spinning={loading.summary}>
              <Statistic
                title={
                  <Space
                    style={{ justifyContent: "space-between", width: "100%" }}
                  >
                    <span>
                      <ExperimentOutlined className="mr-2" />
                      Production
                    </span>
                    <Button
                      shape="circle"
                      icon={<PlusOutlined />}
                      size="small"
                    />
                  </Space>
                }
                value={data.summary?.production.value || 0}
                precision={0}
                valueStyle={{ color: "#13c2c2" }}
                suffix=" units"
              />
              <Text type="secondary">Monthly Production Output</Text>
              <br />
              <Text
                type={
                  data.summary?.production.change.startsWith("+")
                    ? "success"
                    : "danger"
                }
              >
                <ArrowUpOutlined /> {data.summary?.production.change || "0%"}
                from last month
              </Text>
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Spin spinning={loading.summary}>
              <Statistic
                title="Simple P&L"
                value={formatCurrency(data.summary?.profit.value ?? 0, 0)}
                precision={0}
                valueStyle={{ color: "#52c41a" }}
              />
              <Text type="secondary">Net Profit This Month</Text>
              <br />
              <Text
                type={
                  data.summary?.profit.change.startsWith("+")
                    ? "success"
                    : "danger"
                }
              >
                <ArrowUpOutlined /> {data.summary?.profit.change || "0%"} from
                last month
              </Text>
            </Spin>
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title="Expenses Breakdown"
            extra={
              <Text type="secondary">
                {filters.dateRange &&
                  `${dayjs(filters.dateRange.startDate).format(
                    "MMM YYYY"
                  )} - ${dayjs(filters.dateRange.endDate).format("MMM YYYY")}`}
              </Text>
            }
          >
            <Spin spinning={loading.charts}>
              {expensesChartData.length > 0 ? (
                <Pie
                  data={expensesChartData}
                  {...expensesConfig}
                  theme={{
                    type: themeMode === "dark" ? "classicDark" : "classic",
                  }}
                />
              ) : (
                <div
                  style={{ textAlign: "center", padding: "40px", height: 350 }}
                >
                  <Text type="secondary">
                    No expense data available for the selected period
                  </Text>
                </div>
              )}
            </Spin>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="Income vs Expenses"
            extra={
              <Text type="secondary">
                {filters.dateRange &&
                  `${dayjs(filters.dateRange.startDate).format(
                    "MMM YYYY"
                  )} - ${dayjs(filters.dateRange.endDate).format("MMM YYYY")}`}
              </Text>
            }
          >
            <Spin spinning={loading.charts}>
              {incomeChartData.length > 0 ? (
                <Line
                  data={incomeChartData}
                  {...incomeConfig}
                  theme={{
                    type: themeMode === "dark" ? "classicDark" : "classic",
                  }}
                />
              ) : (
                <div
                  style={{ textAlign: "center", padding: "40px", height: 350 }}
                >
                  <Text type="secondary">
                    No income/expense data available for the selected period
                  </Text>
                </div>
              )}
            </Spin>
          </Card>
        </Col>
      </Row>

      {/* Recent Transactions */}
      <Card title="Recent Transactions" style={{ marginBottom: 24 }}>
        <Spin spinning={loading.transactions}>
          <Table
            dataSource={formattedTransactions}
            columns={transactionColumns}
            pagination={false}
            size="small"
            locale={{
              emptyText: "No transactions found",
            }}
          />
        </Spin>
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
            <Spin spinning={loading.accounts}>
              <Statistic
                title="Total Outstanding"
                value={data.accountsData?.receivable?.totalOutstanding || 0}
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
                locale={{
                  emptyText: "No receivables data",
                }}
              />
            </Spin>
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
            <Spin spinning={loading.accounts}>
              <Statistic
                title="Total Outstanding"
                value={data.accountsData?.payable?.totalOutstanding || 0}
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
                locale={{
                  emptyText: "No payables data",
                }}
              />
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
