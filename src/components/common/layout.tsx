import {
  BarChartOutlined,
  CloseOutlined,
  DashboardOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  InboxOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);
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
      key: "/purchase-sale",
      icon: <ShoppingCartOutlined />,
      label: "Purchase/Sale",
    },
    {
      key: "/core",
      icon: <TeamOutlined />,
      label: "Core",
    },
    {
      key: "/reports",
      icon: <BarChartOutlined />,
      label: "Reports",
    },
    // {
    //   key: '/settings',
    //   icon: <SettingOutlined />,
    //   label: 'Settings',
    // },
  ];

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
          className="logo"
          style={{
            height: "64px",
            padding: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#1B4D3E",
          }}
        >
          <h1 style={{ color: "white", margin: 0 }}>ALGO Bricks</h1>
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
          <h2 style={{ margin: 0 }}>{getPageTitle()}</h2>
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

      <style jsx>{`
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
      `}</style>
    </Layout>
  );
};

export default AppLayout;
