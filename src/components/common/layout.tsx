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

const { Header, Sider, Content } = Layout;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
      key: "/formulation",
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
      key: "/reports",
      icon: <BarChartOutlined />,
      label: "Reports",
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
    } catch (error: any) {
      message.error(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getPageTitle = () => {
    const currentPath = location.pathname;
    const menuItem = menuItems.find((item) => item.key === currentPath);
    return menuItem ? menuItem.label : "Dashboard";
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
        theme="light"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
          boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
          backgroundColor: "#fff",
        }}
      >
        <div
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
              display: "block" /* Removes bottom space */,
              verticalAlign: "bottom" /* Removes any baseline spacing */,
            }}
          />
        </div>
        <Menu
          theme="light"
          mode="inline"
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
            background: "#fff",
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
          <div style={{ marginLeft: "auto" }}>
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
            background: "#fff",
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
