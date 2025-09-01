import {
  BankOutlined,
  FundOutlined,
  InboxOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Tabs } from "antd";
import { useEffect, useState } from "react";
import BanksPage from "../bank";
import ChartOfAccounts from "../charts-of-accounts";
import { CustomerComponent } from "../customers";
import Inventory from "../inventory/inventory";
import { VendorComponent } from "../vendors";
import ProtectedComponent from "../../components/common/ProtectedComponent";
import { usePermissions } from "../../contexts/PermissionContext";

const Core = () => {
  const { hasPermission } = usePermissions();

  const allTabKeys = [
    "vendor",
    "customer",
    "bank",
    "inventory",
    "charts-of-accounts",
  ];

  // Filter tabs based on permissions
  const availableTabKeys = allTabKeys.filter((key) => {
    switch (key) {
      case "vendor":
        return hasPermission("vendors.read");
      case "customer":
        return hasPermission("customers.read");
      case "bank":
        return hasPermission("banks.read");
      case "inventory":
        return hasPermission("inventory.read");
      case "charts-of-accounts":
        return hasPermission("accounts.read");
      default:
        return false;
    }
  });

  // Read initial tab key from URL hash (default to first available if none)
  const getInitialTab = () => {
    const hash = window.location.hash.replace("#", "");
    return availableTabKeys.includes(hash)
      ? hash
      : availableTabKeys[0] || "vendor";
  };

  const [activeKey, setActiveKey] = useState(getInitialTab);

  useEffect(() => {
    const handleHashChange = () => {
      const newHash = window.location.hash.replace("#", "");
      if (tabKeys.includes(newHash)) {
        setActiveKey(newHash);
      }
    };

    // Listen for hash changes (e.g. back/forward navigation)
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const allItems = [
    {
      key: "vendor",
      label: (
        <span>
          <ShoppingOutlined /> Vendors
        </span>
      ),
      children: (
        <ProtectedComponent permission="vendors.read">
          <VendorComponent />
        </ProtectedComponent>
      ),
      permission: "vendors.read",
    },
    {
      key: "customer",
      label: (
        <span>
          <UserOutlined /> Customers
        </span>
      ),
      children: (
        <ProtectedComponent permission="customers.read">
          <CustomerComponent />
        </ProtectedComponent>
      ),
      permission: "customers.read",
    },
    {
      key: "bank",
      label: (
        <span>
          <BankOutlined /> Banks
        </span>
      ),
      children: (
        <ProtectedComponent permission="banks.read">
          <BanksPage />
        </ProtectedComponent>
      ),
      permission: "banks.read",
    },
    {
      key: "inventory",
      label: (
        <span>
          <InboxOutlined /> Inventory
        </span>
      ),
      children: (
        <ProtectedComponent permission="inventory.read">
          <Inventory />
        </ProtectedComponent>
      ),
      permission: "inventory.read",
    },
    {
      key: "charts-of-accounts",
      label: (
        <span>
          <FundOutlined /> Charts of Accounts
        </span>
      ),
      children: (
        <ProtectedComponent permission="accounts.read">
          <ChartOfAccounts />
        </ProtectedComponent>
      ),
      permission: "accounts.read",
    },
  ];

  // Filter items based on permissions
  const items = allItems.filter((item) => hasPermission(item.permission));

  const handleTabChange = (key: string) => {
    setActiveKey(key);
    window.location.hash = key;
  };

  // If user has no permissions for any core modules, show access denied
  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <h3>Access Denied</h3>
        <p>You don't have permission to access any core management features.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <Tabs
        activeKey={activeKey}
        onChange={handleTabChange}
        items={items}
        destroyInactiveTabPane
      />
    </div>
  );
};

export default Core;
