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

const Core = () => {
  const tabKeys = [
    "vendor",
    "customer",
    "bank",
    "inventory",
    "charts-of-accounts",
  ];

  // Read initial tab key from URL hash (default to vendor if none)
  const getInitialTab = () => {
    const hash = window.location.hash.replace("#", "");
    return tabKeys.includes(hash) ? hash : "vendor";
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

  const items = [
    {
      key: "vendor",
      label: (
        <span>
          <ShoppingOutlined /> Vendors
        </span>
      ),
      children: <VendorComponent />,
    },
    {
      key: "customer",
      label: (
        <span>
          <UserOutlined /> Customers
        </span>
      ),
      children: <CustomerComponent />,
    },
    {
      key: "bank",
      label: (
        <span>
          <BankOutlined /> Banks
        </span>
      ),
      children: <BanksPage />,
    },
    {
      key: "inventory",
      label: (
        <span>
          <InboxOutlined /> Inventory
        </span>
      ),
      children: <Inventory />,
    },
    {
      key: "charts-of-accounts",
      label: (
        <span>
          <FundOutlined /> Charts of Accounts
        </span>
      ),
      children: <ChartOfAccounts />,
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveKey(key);
    window.location.hash = key;
  };

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
