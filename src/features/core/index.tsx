import {
  BankOutlined,
  ShoppingOutlined,
  InboxOutlined,
  UserOutlined,
  FundOutlined,
} from "@ant-design/icons";
import { Tabs } from "antd";
import BanksPage from "../bank";
import { CustomerComponent } from "../customers";
import Inventory from "../inventory/inventory";
import { VendorComponent } from "../vendors";
import ChartOfAccounts from "../charts-of-accounts";

const Core = () => {
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

  return (
    <div style={{ padding: "24px" }}>
      <Tabs defaultActiveKey="vendor" items={items} destroyInactiveTabPane />
    </div>
  );
};

export default Core;
