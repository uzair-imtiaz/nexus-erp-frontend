import {
  DollarOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Row } from "antd";
import { TrendingDown, TrendingUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import PermissionAwareDashboard from "./common/PermissionAwareDashboard";
import ProtectedComponent from "./common/ProtectedComponent";

interface DashboardStats {
  totalSales: number;
  totalPurchases: number;
  totalCustomers: number;
  totalVendors: number;
  totalUsers: number;
  totalInventory: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalPurchases: 0,
    totalCustomers: 0,
    totalVendors: 0,
    totalUsers: 0,
    totalInventory: 0,
    monthlyRevenue: 0,
    monthlyExpenses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch dashboard stats
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Replace with actual API calls
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setStats({
          totalSales: 125000,
          totalPurchases: 85000,
          totalCustomers: 45,
          totalVendors: 23,
          totalUsers: 12,
          totalInventory: 350,
          monthlyRevenue: 45000,
          monthlyExpenses: 32000,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const dashboardWidgets = [
    {
      key: "sales",
      title: "Total Sales",
      value: stats.totalSales,
      prefix: <DollarOutlined />,
      permission: "sales.read",
      span: 6,
    },
    {
      key: "purchases",
      title: "Total Purchases",
      value: stats.totalPurchases,
      prefix: <ShoppingCartOutlined />,
      permission: "purchases.read",
      span: 6,
    },
    {
      key: "customers",
      title: "Total Customers",
      value: stats.totalCustomers,
      prefix: <UserOutlined />,
      permission: "customers.read",
      span: 6,
    },
    {
      key: "inventory",
      title: "Inventory Items",
      value: stats.totalInventory,
      prefix: <FileTextOutlined />,
      permission: "inventory.read",
      span: 6,
    },
    {
      key: "revenue",
      title: "Monthly Revenue",
      value: stats.monthlyRevenue,
      prefix: <TrendingUp style={{ color: "#52c41a" }} />,
      permission: "reports.read",
      span: 8,
    },
    {
      key: "expenses",
      title: "Monthly Expenses",
      value: stats.monthlyExpenses,
      prefix: <TrendingDown style={{ color: "#ff4d4f" }} />,
      permission: "expenses.read",
      span: 8,
    },
    {
      key: "users",
      title: "Total Users",
      value: stats.totalUsers,
      prefix: <UserOutlined />,
      permission: "users.read",
      span: 8,
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <PermissionAwareDashboard
        title="Dashboard Overview"
        widgets={dashboardWidgets.map((widget) => ({
          ...widget,
          loading,
        }))}
        extra={
          <ProtectedComponent permission="reports.export">
            <Button type="primary">Export Report</Button>
          </ProtectedComponent>
        }
      />

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={12}>
          <ProtectedComponent permission="sales.read">
            <Card
              title="Recent Sales"
              extra={<Button type="link">View All</Button>}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "#999",
                }}
              >
                Recent sales data would be displayed here
              </div>
            </Card>
          </ProtectedComponent>
        </Col>
        <Col span={12}>
          <ProtectedComponent permission="purchases.read">
            <Card
              title="Recent Purchases"
              extra={<Button type="link">View All</Button>}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "#999",
                }}
              >
                Recent purchases data would be displayed here
              </div>
            </Card>
          </ProtectedComponent>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <ProtectedComponent permission="reports.read">
            <Card title="Financial Overview">
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 0",
                  color: "#999",
                }}
              >
                Financial charts and graphs would be displayed here
              </div>
            </Card>
          </ProtectedComponent>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
