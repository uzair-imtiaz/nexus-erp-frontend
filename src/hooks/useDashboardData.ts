import { useState, useEffect } from "react";
import { message } from "antd";

interface DashboardSummary {
  stats: {
    inventory: { value: number; change: string };
    sales: { value: number; change: string };
    production: { value: number; change: string };
    profit: { value: number; change: string };
  };
  alertsCount: number;
  recentTransactions: Transaction[];
}

interface ChartData {
  expensesBreakdown: { category: string; value: number; color: string }[];
  incomeVsExpenses: { month: string; income: number; expenses: number }[];
}

export const useDashboardData = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [accountsData, setAccountsData] = useState<{
    receivable: any[];
    payable: any[];
  } | null>(null);

  const [loading, setLoading] = useState({
    summary: true,
    charts: true,
    accounts: true,
  });

  // Critical data first - fast load
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch("/api/dashboard/summary");
        const data = await response.json();
        setSummary(data);
      } catch (error) {
        message.error("Failed to load dashboard summary");
      } finally {
        setLoading((prev) => ({ ...prev, summary: false }));
      }
    };

    fetchSummary();
  }, []);

  // Charts data - can load after summary
  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const [expensesRes, incomeRes] = await Promise.all([
          fetch("/api/dashboard/charts/expenses-breakdown"),
          fetch("/api/dashboard/charts/income-vs-expenses"),
        ]);

        const [expensesData, incomeData] = await Promise.all([
          expensesRes.json(),
          incomeRes.json(),
        ]);

        setChartData({
          expensesBreakdown: expensesData,
          incomeVsExpenses: incomeData,
        });
      } catch (error) {
        message.error("Failed to load chart data");
      } finally {
        setLoading((prev) => ({ ...prev, charts: false }));
      }
    };

    // Delay charts to prioritize summary
    const timer = setTimeout(fetchCharts, 100);
    return () => clearTimeout(timer);
  }, []);

  // Accounts data - lowest priority
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const [receivableRes, payableRes] = await Promise.all([
          fetch("/api/dashboard/accounts-receivable"),
          fetch("/api/dashboard/accounts-payable"),
        ]);

        const [receivableData, payableData] = await Promise.all([
          receivableRes.json(),
          payableRes.json(),
        ]);

        setAccountsData({
          receivable: receivableData,
          payable: payableData,
        });
      } catch (error) {
        message.error("Failed to load accounts data");
      } finally {
        setLoading((prev) => ({ ...prev, accounts: false }));
      }
    };

    // Further delay for accounts
    const timer = setTimeout(fetchAccounts, 300);
    return () => clearTimeout(timer);
  }, []);

  const refetch = {
    summary: () => {
      setLoading((prev) => ({ ...prev, summary: true }));
      // Re-fetch summary logic
    },
    charts: () => {
      setLoading((prev) => ({ ...prev, charts: true }));
      // Re-fetch charts logic
    },
    accounts: () => {
      setLoading((prev) => ({ ...prev, accounts: true }));
      // Re-fetch accounts logic
    },
  };

  return {
    data: {
      summary,
      chartData,
      accountsData,
    },
    loading,
    refetch,
  };
};
