import { DollarOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Flex, Tabs } from "antd";
import { useEffect, useState } from "react";
import { IoReceiptOutline } from "react-icons/io5";
import { MdOutlinePayment } from "react-icons/md";
import Transactions from "../../components/common/transaction/transaction-listing";
import { getPurchasesApi } from "../../services/purchase.services";
import { getSalesApi } from "../../services/sales.services";

import Receipts from "../receipt";
import Payments from "../payment";

const { TabPane } = Tabs;

const tabKeyToHash: Record<string, string> = {
  purchase: "purchases",
  sale: "sales",
  receipt: "receipts",
  payment: "payments",
};

const hashToTabKey: Record<string, string> = Object.fromEntries(
  Object.entries(tabKeyToHash).map(([k, v]) => [`#${v}`, k])
);

const TransactionsPage = () => {
  // Pick tab from hash or default to 'purchase'
  const [activeTab, setActiveTab] = useState<string>(() => {
    const hash = window.location.hash.toLowerCase();
    return hashToTabKey[hash] || "purchase";
  });

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    window.location.hash = tabKeyToHash[key] || "";
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hashToTabKey[hash] && activeTab !== hashToTabKey[hash]) {
        setActiveTab(hashToTabKey[hash]);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [activeTab]);

  return (
    <Tabs activeKey={activeTab} onChange={handleTabChange}>
      <TabPane
        tab={
          <span>
            <ShoppingCartOutlined /> Purchases
          </span>
        }
        key="purchase"
      >
        <Transactions
          type="purchase"
          fetchApi={getPurchasesApi}
          menuOptions={[
            { key: "purchase", label: "Purchase" },
            { key: "purchase-return", label: "Purchase Return" },
          ]}
        />
      </TabPane>
      <TabPane
        tab={
          <span>
            <DollarOutlined /> Sales
          </span>
        }
        key="sale"
      >
        <Transactions
          type="sale"
          fetchApi={getSalesApi}
          menuOptions={[
            { key: "sale", label: "Sale" },
            { key: "sale-return", label: "Sale Return" },
          ]}
        />
      </TabPane>
      <TabPane
        tab={
          <Flex align="center" gap={4}>
            <IoReceiptOutline /> Receipts
          </Flex>
        }
        key="receipt"
      >
        <Receipts />
      </TabPane>
      <TabPane
        tab={
          <Flex align="center" gap={4}>
            <MdOutlinePayment /> Payments
          </Flex>
        }
        key="payment"
      >
        <Payments />
      </TabPane>
    </Tabs>
  );
};

export default TransactionsPage;
