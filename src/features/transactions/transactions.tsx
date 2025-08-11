import { DollarOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { notification, Tabs } from "antd";
import { useEffect, useState } from "react";
import Transactions from "../../components/common/transaction/transaction-listing";
import { Transaction } from "../../components/common/transaction/types";
import { getPurchasesApi } from "../../services/purchase.services";
import { getSalesApi } from "../../services/sales.services";
import { buildQueryString } from "../../utils";
import { ReceiptIcon } from "lucide-react";
import Receipts from "../receipt";

const { TabPane } = Tabs;

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"purchase" | "sale">(() => {
    const hash = window.location.hash.toLowerCase();
    return hash === "#sales" ? "sale" : "purchase";
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    nextPage: null,
    prevPage: null,
  });

  const fetchTransactions = async (
    type: "purchase" | "sale",
    queryParams: Record<string, any> = {}
  ) => {
    try {
      setLoading(true);
      const queryString = buildQueryString(queryParams);
      const response =
        type === "purchase"
          ? await getPurchasesApi(queryString)
          : await getSalesApi(queryString);
      if (!response?.success) {
        return notification.error({
          message: "Error",
          description: response.message,
        });
      }
      setTransactions(response?.data);
      setPagination(response?.pagination);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.location.hash = activeTab;
    fetchTransactions(activeTab);
  }, [activeTab]);

  const handleTabChange = (key: string) => {
    const newTab = key as "purchase" | "sale";
    setActiveTab(newTab);
    window.location.hash = newTab === "sale" ? "sales" : "purchases";
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#sales" && activeTab !== "sale") {
        setActiveTab("sale");
      } else if (hash === "#purchases" && activeTab !== "purchase") {
        setActiveTab("purchase");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [activeTab]);

  return (
    <Tabs activeKey={activeTab} onChange={handleTabChange}>
      <TabPane
        tab={
          <span className="flex items-center gap-1">
            <ShoppingCartOutlined size={16} /> Purchases
          </span>
        }
        key="purchase"
      >
        <Transactions
          type="purchase"
          transactions={transactions}
          loading={loading}
          pagination={pagination}
          fetch={fetchTransactions}
          menuOptions={[
            {
              key: "purchase",
              label: "Purchase",
            },
            {
              key: "purchase-return",
              label: "Purchase Return",
            },
          ]}
        />
      </TabPane>
      <TabPane
        tab={
          <span className="flex items-center gap-1">
            <DollarOutlined size={16} /> Sales
          </span>
        }
        key="sale"
      >
        <Transactions
          type="sale"
          transactions={transactions}
          loading={loading}
          pagination={pagination}
          fetch={fetchTransactions}
          menuOptions={[
            {
              key: "sale",
              label: "Sale",
            },
            {
              key: "sale-return",
              label: "Sale Return",
            },
          ]}
        />
      </TabPane>
      <TabPane
        tab={
          <span className="flex items-center gap-1">
            <ReceiptIcon size={16} /> Receipts
          </span>
        }
        key={"receipt"}
      >
        <Receipts />
      </TabPane>
    </Tabs>
  );
};

export default TransactionsPage;
