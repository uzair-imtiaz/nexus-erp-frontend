import {
  ArrowUpOutlined,
  CalendarOutlined,
  DollarOutlined,
  DownloadOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  InboxOutlined,
  ReloadOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  WalletOutlined,
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
  Tooltip,
  Typography,
} from "antd";

import { Line, Pie } from "@ant-design/plots";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import AddEditItemModal from "../../features/inventory/add-edit-modal/add-edit-modal";
import { useDashboardData } from "../../hooks/useDashboardData";
import { formatCurrency } from "../../utils";
import FabMenu, { FabAction } from "../common/fab-menu";
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
  const navigate = useNavigate();
  const { data, loading, refetch, filters, updateFilters } = useDashboardData();
  const [pnlLoaded, setPnlLoaded] = useState(false);

  // Modal states
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);

  // Load P&L data after main dashboard loads (lazy loading)
  useEffect(() => {
    if (!loading.summary && !pnlLoaded) {
      const timer = setTimeout(() => {
        refetch.pnl();
        setPnlLoaded(true);
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [loading.summary, pnlLoaded, refetch]);

  // Handle successful inventory creation/update
  const handleInventorySuccess = () => {
    setInventoryModalOpen(false);
    refetch.summary();
  };

  // FAB Menu Actions
  const fabActions: FabAction[] = [
    {
      key: "inventory",
      icon: <InboxOutlined />,
      label: "Add Inventory",
      tooltip: "Add new inventory item",
      onClick: () => setInventoryModalOpen(true),
      color: "#52c41a",
    },
    {
      key: "sale",
      icon: <ShoppingCartOutlined />,
      label: "New Sale",
      tooltip: "Create new sale",
      onClick: () => navigate("sales/new?type=sale"),
      color: "#1890ff",
    },
    {
      key: "purchase",
      icon: <ShoppingOutlined />,
      label: "New Purchase",
      tooltip: "Create new purchase",
      onClick: () => navigate("/purchases/new"),
      color: "#722ed1",
    },
    {
      key: "production",
      icon: <ExperimentOutlined />,
      label: "Production",
      tooltip: "Create production order",
      onClick: () => navigate("production/new"),
      color: "#13c2c2",
    },
    {
      key: "expense",
      icon: <DollarOutlined />,
      label: "New Expense",
      tooltip: "Record new expense",
      onClick: () => navigate("/expenses/new"),
      color: "#f5222d",
    },
    {
      key: "formulation",
      icon: <ExperimentOutlined />,
      label: "Formulation",
      tooltip: "Create new formulation",
      onClick: () => navigate("/formulations/new"),
      color: "#fa8c16",
    },
    {
      key: "receipt",
      icon: <WalletOutlined />,
      label: "Receipt",
      tooltip: "Record receipt",
      onClick: () => navigate("/receipts/new"),
      color: "#52c41a",
    },
    {
      key: "payment",
      icon: <FileTextOutlined />,
      label: "Payment",
      tooltip: "Record payment",
      onClick: () => navigate("/payments/new"),
      color: "#fa8c16",
    },
    {
      key: "journal",
      icon: <FileTextOutlined />,
      label: "Journal Entry",
      tooltip: "Create journal entry",
      onClick: () => navigate("/journal/new"),
      color: "#722ed1",
    },
    {
      key: "bills",
      icon: <FileTextOutlined />,
      label: "Bills",
      tooltip: "Manage bills",
      onClick: () => navigate("/transactions#purchases"),
      color: "#eb2f96",
    },
  ];

  // Handle date range change
  const handleDateRangeChange = (dates: null | (Dayjs | null)[]) => {
    if (dates && dates[0] && dates[1]) {
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
                refetch.pnl();
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
                  </Space>
                }
                value={formatCurrency(data.summary?.inventory.value || 0, 0)}
                precision={0}
                valueStyle={{ color: "#d97706" }}
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
                  </Space>
                }
                value={formatCurrency(data.summary?.sales.value || 0, 0)}
                precision={0}
                valueStyle={{ color: "#2563eb" }}
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
                  </Space>
                }
                value={data.summary?.production.value || 0}
                precision={0}
                valueStyle={{ color: "#e11d48" }}
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
                &nbsp;from last month
              </Text>
            </Spin>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Tooltip title="Click to view detailed P&L report">
            <Card
              hoverable
              onClick={() => {
                const queryParams = new URLSearchParams();
                if (filters.dateRange) {
                  queryParams.set("startDate", filters.dateRange.startDate);
                  queryParams.set("endDate", filters.dateRange.endDate);
                }
                navigate(`/reports/profit-loss?${queryParams.toString()}`);
              }}
              style={{ cursor: "pointer" }}
            >
              <Spin spinning={loading.pnl}>
                <Statistic
                  title={
                    <Space>
                      <span>Detailed P&L</span>
                      <FileTextOutlined
                        style={{ fontSize: "14px", color: "#1890ff" }}
                      />
                    </Space>
                  }
                  value={formatCurrency(
                    data.pnlSummary?.value ?? data.summary?.profit.value ?? 0,
                    0
                  )}
                  precision={0}
                  valueStyle={{ color: "#16a34a" }}
                />
                <Text type="secondary">
                  {data.pnlSummary
                    ? "Earnings Before Tax"
                    : "Net Profit This Month"}
                </Text>
                <br />
                <Text
                  type={
                    (
                      data.pnlSummary?.change ?? data.summary?.profit.change
                    )?.startsWith("+")
                      ? "success"
                      : "danger"
                  }
                >
                  <ArrowUpOutlined />{" "}
                  {data.pnlSummary?.change ??
                    (data.summary?.profit.change || "0%")}{" "}
                  from last month
                </Text>
              </Spin>
            </Card>
          </Tooltip>
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

      {/* Modals */}
      {inventoryModalOpen && (
        <AddEditItemModal
          onClose={() => setInventoryModalOpen(false)}
          onSuccess={handleInventorySuccess}
        />
      )}

      {/* FAB Menu */}
      <FabMenu actions={fabActions} position="bottom-right" />
    </div>
  );
};

export default Dashboard;
