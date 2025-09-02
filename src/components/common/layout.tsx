import {
  BarChartOutlined,
  BookOutlined,
  CloseOutlined,
  DashboardOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  ProfileOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, message } from "antd";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../services/auth.services";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../../contexts/ThemeContext";

const { Header, Sider, Content } = Layout;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { themeMode } = useTheme();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileVisible(!mobileVisible);
  };

  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/production",
      icon: <ExperimentOutlined />,
      label: "Production",
    },
    {
      key: "/formulations",
      icon: <FileTextOutlined />,
      label: "Formulation",
    },
    {
      key: "/transactions",
      icon: <ShoppingCartOutlined />,
      label: "Transactions",
    },
    {
      key: "/expenses",
      icon: <ProfileOutlined />,
      label: "Expenses",
    },
    {
      key: "/journal",
      icon: <BookOutlined />,
      label: "Journal",
    },
    {
      key: "reports",
      icon: <BarChartOutlined />,
      label: "Reports",
      children: [
        {
          key: "/reports/trial-balance",
          icon: <BarChartOutlined />,
          label: "Trial Balance",
        },
        {
          key: "/reports/journal-ledger",
          icon: <BookOutlined />,
          label: "Journal Ledger",
        },
        {
          key: "/reports/profit-loss",
          icon: <ProfileOutlined />,
          label: "Profit & Loss",
        },
        {
          key: "/reports/balance-sheet",
          icon: <FileTextOutlined />,
          label: "Balance Sheet (As At)",
        },
      ],
    },
    {
      key: "/core",
      icon: <SettingOutlined />,
      label: "Core",
    },
  ];

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await logout();
      if (!response.success) {
        message.error(response.message);
        return;
      }
      message.success(response.message);
      navigate("/login");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      message.error(errorMessage);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getPageTitle = () => {
    const currentPath = location.pathname;
    const route = currentPath.split("/")[1];
    return route.charAt(0).toUpperCase() + route.slice(1);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Mobile Menu Toggle Button */}
      <Button
        type="primary"
        icon={mobileVisible ? <CloseOutlined /> : <MenuOutlined />}
        onClick={toggleMobileSidebar}
        style={{
          position: "fixed",
          top: "16px",
          left: "16px",
          zIndex: 1001,
          display: "none", // Hidden by default, shown on mobile via media query
          background: "#1B4D3E",
        }}
        className="mobile-menu-button"
      />

      {/* Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
        className="sidebar"
        theme={themeMode}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 20,
          bottom: 0,
          zIndex: 1000,
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
          // backgroundColor: themeMode === "dark" ? "#1f1f1f" : "#fff",
        }}
      >
        {/* <div
          style={{
            backgroundColor: "#0f4741",
            paddingBlock: 9,
          }}
        >
          <img
            src="/assets/images/logo-expanded.png"
            alt="Logo"
            style={{
              width: "100%",
              display: "block",
              verticalAlign: "bottom",
            }}
          />
        </div> */}
        <Menu
          theme={themeMode}
          mode="vertical"
          selectedKeys={[location.pathname]}
          style={{ borderRight: 0 }}
          onClick={({ key }) => {
            navigate(key);
            if (window.innerWidth < 768) {
              setMobileVisible(false);
            }
          }}
          items={menuItems}
        />
      </Sider>

      <Layout
        style={{ marginLeft: collapsed ? 0 : 200, transition: "all 0.2s" }}
      >
        <Header
          style={{
            background: themeMode === "dark" ? "#1f1f1f" : "#fff",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Button
            type="text"
            onClick={toggleSidebar}
            style={{ marginRight: 16 }}
            className="desktop-toggle"
          >
            {collapsed ? <MenuOutlined /> : <MenuFoldOutlined />}
          </Button>
          <Title level={5} style={{ margin: 0 }}>
            {getPageTitle()}
          </Title>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <ThemeToggle />
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ background: "#1B4D3E" }}
              block
              loading={loading}
            >
              Logout
            </Button>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: themeMode === "dark" ? "#1f1f1f" : "#fff",
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>

      {/* Mobile overlay */}
      {mobileVisible && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
          onClick={() => setMobileVisible(false)}
        />
      )}

      <style>
        {`
          @media (max-width: 767px) {
            .mobile-menu-button {
              display: block !important;
            }
            .desktop-toggle {
              display: none !important;
            }
            .sidebar {
              left: ${mobileVisible ? "0" : "-200px"};
            }
          }
        `}
      </style>
    </Layout>
  );
};

export default AppLayout;
