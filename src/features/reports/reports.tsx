import {
  BarChartOutlined,
  BookOutlined,
  DollarOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  TruckOutlined,
  WalletOutlined,
  ClockCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Card,
  Col,
  Row,
  Typography,
  Space,
  Button,
  Badge,
  List,
  Avatar,
} from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

interface ReportItem {
  key: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  isNew?: boolean;
  color: string;
}

interface ReportCategory {
  title: string;
  description: string;
  icon: React.ReactNode;
  reports: ReportItem[];
  color: string;
}

const Reports: React.FC = () => {
  const navigate = useNavigate();

  const recentReports = [
    {
      title: "Customer Ledger",
      description: "Last generated 2 hours ago",
      icon: <TeamOutlined />,
      path: "/reports/customer-ledger",
      color: "#52c41a",
    },
    {
      title: "Trial Balance",
      description: "Last generated yesterday",
      icon: <BarChartOutlined />,
      path: "/reports/trial-balance",
      color: "#1890ff",
    },
    {
      title: "Product Ledger",
      description: "Last generated 3 days ago",
      icon: <ShoppingCartOutlined />,
      path: "/reports/product-ledger",
      color: "#eb2f96",
    },
  ];

  const reportCategories: ReportCategory[] = [
    {
      title: "Financial Reports",
      description: "Core financial statements and analysis",
      icon: <DollarOutlined />,
      color: "#52c41a",
      reports: [
        {
          key: "trial-balance",
          title: "Trial Balance",
          description:
            "Summary of all account balances to verify debits equal credits",
          icon: <BarChartOutlined />,
          path: "/reports/trial-balance",
          color: "#52c41a",
        },
        {
          key: "balance-sheet",
          title: "Balance Sheet",
          description:
            "Statement of financial position showing assets, liabilities, and equity",
          icon: <FileTextOutlined />,
          path: "/reports/balance-sheet",
          color: "#1890ff",
        },
        {
          key: "profit-loss",
          title: "Profit & Loss",
          description:
            "Income statement showing revenues, expenses, and net profit",
          icon: <DollarOutlined />,
          path: "/reports/profit-loss",
          color: "#722ed1",
        },
      ],
    },
    {
      title: "Ledger Reports",
      description: "Detailed transaction history and account movements",
      icon: <BookOutlined />,
      color: "#1890ff",
      reports: [
        {
          key: "journal-ledger",
          title: "Journal Ledger",
          description:
            "Detailed view of all journal entries and account movements",
          icon: <BookOutlined />,
          path: "/reports/journal-ledger",
          color: "#1890ff",
        },
        {
          key: "customer-ledger",
          title: "Customer Ledger",
          description:
            "Customer account statements with transaction history and balances",
          icon: <TeamOutlined />,
          path: "/reports/customer-ledger",
          color: "#52c41a",
          isNew: true,
        },
        {
          key: "vendor-ledger",
          title: "Vendor Ledger",
          description:
            "Vendor account statements with transaction history and balances",
          icon: <TruckOutlined />,
          path: "/reports/vendor-ledger",
          color: "#fa8c16",
          isNew: true,
        },
        {
          key: "product-ledger",
          title: "Product Ledger",
          description: "Inventory movement tracking with quantities and values",
          icon: <ShoppingCartOutlined />,
          path: "/reports/product-ledger",
          color: "#eb2f96",
        },
      ],
    },
    {
      title: "Management Reports",
      description: "Business intelligence and operational insights",
      icon: <BarChartOutlined />,
      color: "#722ed1",
      reports: [
        // Placeholder for future management reports
        {
          key: "cash-flow",
          title: "Cash Flow Statement",
          description:
            "Track cash inflows and outflows across operating, investing, and financing activities",
          icon: <WalletOutlined />,
          path: "/reports/cash-flow",
          color: "#13c2c2",
        },
        {
          key: "aging-report",
          title: "Aging Report",
          description:
            "Customer and vendor aging analysis for better credit management",
          icon: <TeamOutlined />,
          path: "/reports/aging",
          color: "#fa541c",
        },
      ],
    },
  ];

  const handleReportClick = (path: string) => {
    navigate(path);
  };

  const renderReportCard = (report: ReportItem) => (
    <Card
      key={report.key}
      hoverable
      onClick={() => handleReportClick(report.path)}
      style={{
        height: "100%",
        borderLeft: `4px solid ${report.color}`,
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      bodyStyle={{ padding: "20px" }}
      className="report-card"
    >
      <Space direction="vertical" size="small" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Space>
            <div
              style={{
                fontSize: "24px",
                color: report.color,
                display: "flex",
                alignItems: "center",
              }}
            >
              {report.icon}
            </div>
            <div>
              <Title level={5} style={{ margin: 0 }}>
                {report.title}
                {report.isNew && (
                  <Badge
                    count="NEW"
                    style={{
                      backgroundColor: "#52c41a",
                      marginLeft: "8px",
                      fontSize: "10px",
                    }}
                  />
                )}
              </Title>
            </div>
          </Space>
        </div>
        <Text type="secondary" style={{ fontSize: "13px", lineHeight: "1.4" }}>
          {report.description}
        </Text>
      </Space>
    </Card>
  );

  const renderCategory = (category: ReportCategory) => (
    <div key={category.title} style={{ marginBottom: "32px" }}>
      <div style={{ marginBottom: "16px" }}>
        <Space align="center" size="middle">
          <div
            style={{
              fontSize: "28px",
              color: category.color,
              display: "flex",
              alignItems: "center",
            }}
          >
            {category.icon}
          </div>
          <div>
            <Title level={3} style={{ margin: 0 }}>
              {category.title}
            </Title>
            <Text type="secondary">{category.description}</Text>
          </div>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        {category.reports.map((report) => (
          <Col key={report.key} xs={24} sm={12} lg={8} xl={6}>
            {renderReportCard(report)}
          </Col>
        ))}
      </Row>
    </div>
  );

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ marginBottom: "32px" }}>
        <Title level={2} style={{ marginBottom: "8px" }}>
          Reports
        </Title>
        <Text type="secondary">
          Access financial reports, ledgers, and business intelligence tools
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Main Reports Categories */}
        <Col xs={24} lg={18}>
          {reportCategories.map(renderCategory)}
        </Col>

        {/* Sidebar with Recent Reports and Quick Actions */}
        <Col xs={24} lg={6}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Recent Reports */}
            <Card
              title={
                <Space>
                  <ClockCircleOutlined />
                  Recent Reports
                </Space>
              }
              size="small"
            >
              <List
                size="small"
                dataSource={recentReports}
                renderItem={(item) => (
                  <List.Item
                    style={{ cursor: "pointer", padding: "8px 0" }}
                    onClick={() => handleReportClick(item.path)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={item.icon}
                          style={{ backgroundColor: item.color }}
                          size="small"
                        />
                      }
                      title={
                        <div style={{ fontSize: "13px", fontWeight: 500 }}>
                          {item.title}
                        </div>
                      }
                      description={
                        <div style={{ fontSize: "11px" }}>
                          {item.description}
                        </div>
                      }
                    />
                    <RightOutlined style={{ fontSize: "10px" }} />
                  </List.Item>
                )}
              />
            </Card>

            {/* Quick Actions */}
            <Card title="Quick Actions" size="small">
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button
                  type="primary"
                  block
                  icon={<BarChartOutlined />}
                  onClick={() => handleReportClick("/reports/trial-balance")}
                >
                  Trial Balance
                </Button>
                <Button
                  block
                  icon={<TeamOutlined />}
                  onClick={() => handleReportClick("/reports/customer-ledger")}
                >
                  Customer Ledger
                </Button>
                <Button
                  block
                  icon={<DollarOutlined />}
                  onClick={() => handleReportClick("/reports/profit-loss")}
                >
                  P&L Report
                </Button>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>

      <style jsx>{`
        .report-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .report-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default Reports;
