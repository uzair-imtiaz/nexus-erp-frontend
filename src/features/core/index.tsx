import {
  BankOutlined,
  ShoppingOutlined,
  StockOutlined,
  UserOutlined,
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
          <StockOutlined /> Inventory
        </span>
      ),
      children: <Inventory />,
    },
    {
      key: "charts-of-accounts",
      label: (
        <span>
          <StockOutlined /> Charts of Accounts
        </span>
      ),
      children: <ChartOfAccounts />,
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Tabs defaultActiveKey="vendor" items={items} />
    </div>
  );
};

export default Core;
