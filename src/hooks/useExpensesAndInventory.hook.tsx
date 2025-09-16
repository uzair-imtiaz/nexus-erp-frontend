// hooks/useInventoryAndExpenses.ts
import { useEffect, useState } from "react";
import { getInventories } from "../apis";
import { getByTypeUnderTopLevel } from "../services/charts-of-accounts.services";

import { notification } from "antd";
import { ACCOUNT_TYPE } from "../features/charts-of-accounts/utils";

export const useInventoryAndExpenses = () => {
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [expensesList, setExpensesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [invRes, expensesRes] = await Promise.all([
          getInventories("?limit=100000"),
          getByTypeUnderTopLevel("Expenses", ACCOUNT_TYPE[3].value),
        ]);
        if (invRes?.success && expensesRes?.success) {
          setExpensesList(expensesRes.data);
          setInventoryItems(invRes.data);
        } else {
          notification.error({
            message: "Error",
            description: "Failed to load inventories/expenses",
          });
        }
      } catch (err) {
        notification.error({
          message: "Error",
          description: String(err),
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const finishedGoods = inventoryItems.filter((item: any) =>
    item?.category.includes("Finished")
  );
  const ingredients = inventoryItems.filter(
    (item: any) => item?.category === "Raw Materials"
  );

  return { finishedGoods, ingredients, inventoryItems, expensesList, loading };
};
