import { notification } from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import {
  AccountsAging,
  BusinessStats,
  ChartFilters,
  ExpenseBreakdown,
  getAccountsReceivableAndPayablesApi,
  getDashboardSummaryApi,
  getExpensesBreakdownApi,
  getIncomeVsExpensesApi,
  getPnLSummaryApi,
  getRecentTransactionsApi,
  IncomeExpenseChart,
  StatValue,
  Transaction,
  TransactionFilters,
} from "../services/dashboard.services";

interface ChartData {
  expensesBreakdown: ExpenseBreakdown[];
  incomeVsExpenses: IncomeExpenseChart[];
}

interface AccountsData {
  receivable: AccountsAging;
  payable: AccountsAging;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DashboardFilters {
  dateRange?: DateRange;
  transactionLimit?: number;
}

export const useDashboardData = (initialFilters?: DashboardFilters) => {
  const [summary, setSummary] = useState<BusinessStats | null>(null);
  const [pnlSummary, setPnlSummary] = useState<StatValue | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [accountsData, setAccountsData] = useState<AccountsData | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );

  const [loading, setLoading] = useState({
    summary: true,
    pnl: true,
    charts: true,
    accounts: true,
    transactions: true,
  });

  const [currentFilters, setCurrentFilters] = useState<DashboardFilters>(() => {
    // Default to last 12 months
    const endDate = dayjs();
    const startDate = endDate.subtract(12, "months");

    return {
      dateRange: {
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
      },
      transactionLimit: 10,
      ...initialFilters,
    };
  });

  // Helper function for API calls with proper error handling
  const handleApiCall = useCallback(
    async <T>(
      apiFunction: () => Promise<{
        success: boolean;
        message: string;
        data: T;
      }>,
      setter: (data: T) => void,
      loadingKey: keyof typeof loading
    ) => {
      try {
        const response = await apiFunction();

        if (response.success) {
          setter(response.data);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description: error instanceof Error ? error.message : "Network Error",
        });
      } finally {
        setLoading((prev) => ({ ...prev, [loadingKey]: false }));
      }
    },
    []
  );

  // Function to update filters and refetch data
  const updateFilters = useCallback((newFilters: Partial<DashboardFilters>) => {
    setCurrentFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Critical data first - fast load (500ms requirement)
  useEffect(() => {
    handleApiCall<BusinessStats>(getDashboardSummaryApi, setSummary, "summary");
  }, [handleApiCall]);

  // Recent transactions - medium priority (800ms requirement)
  useEffect(() => {
    const timer = setTimeout(() => {
      const transactionFilters: TransactionFilters = {
        limit: currentFilters.transactionLimit || 10,
      };

      handleApiCall<Transaction[]>(
        () => getRecentTransactionsApi(transactionFilters),
        setRecentTransactions,
        "transactions"
      );
    }, 200);
    return () => clearTimeout(timer);
  }, [handleApiCall, currentFilters.transactionLimit]);

  // Charts data - can load after summary (1000ms requirement)
  useEffect(() => {
    const fetchCharts = async () => {
      try {
        setLoading((prev) => ({ ...prev, charts: true }));

        const chartFilters: ChartFilters = currentFilters.dateRange
          ? {
              startDate: currentFilters.dateRange.startDate,
              endDate: currentFilters.dateRange.endDate,
            }
          : {};

        const [expensesResponse, incomeResponse] = await Promise.all([
          getExpensesBreakdownApi(chartFilters),
          getIncomeVsExpensesApi(chartFilters),
        ]);

        if (expensesResponse.success && incomeResponse.success) {
          setChartData({
            expensesBreakdown: expensesResponse.data,
            incomeVsExpenses: incomeResponse.data,
          });
        } else {
          throw new Error(
            expensesResponse.message ||
              incomeResponse.message ||
              "Failed to load chart data"
          );
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description:
            error instanceof Error ? error.message : "Unknown error occurred",
        });
      } finally {
        setLoading((prev) => ({ ...prev, charts: false }));
      }
    };

    // Delay charts to prioritize summary
    const timer = setTimeout(fetchCharts, 100);
    return () => clearTimeout(timer);
  }, [currentFilters.dateRange]);

  // Accounts data - lowest priority (2000ms requirement)
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await getAccountsReceivableAndPayablesApi();

        if (response.success) {
          setAccountsData(response.data);
        } else {
          throw new Error(response.message || "Failed to load accounts data");
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description:
            error instanceof Error ? error.message : "Unknown error occurred",
        });
      } finally {
        setLoading((prev) => ({ ...prev, accounts: false }));
      }
    };

    // Further delay for accounts
    const timer = setTimeout(fetchAccounts, 300);
    return () => clearTimeout(timer);
  }, []);

  const refetch = {
    summary: useCallback(() => {
      setLoading((prev) => ({ ...prev, summary: true }));
      handleApiCall<BusinessStats>(
        getDashboardSummaryApi,
        setSummary,
        "summary"
      );
    }, [handleApiCall]),

    charts: useCallback(() => {
      setLoading((prev) => ({ ...prev, charts: true }));
      const fetchCharts = async () => {
        try {
          const chartFilters: ChartFilters = currentFilters.dateRange
            ? {
                startDate: currentFilters.dateRange.startDate,
                endDate: currentFilters.dateRange.endDate,
              }
            : {};

          const [expensesResponse, incomeResponse] = await Promise.all([
            getExpensesBreakdownApi(chartFilters),
            getIncomeVsExpensesApi(chartFilters),
          ]);

          if (expensesResponse.success && incomeResponse.success) {
            setChartData({
              expensesBreakdown: expensesResponse.data,
              incomeVsExpenses: incomeResponse.data,
            });
          } else {
            throw new Error(
              expensesResponse.message ||
                incomeResponse.message ||
                "Failed to load chart data"
            );
          }
        } catch (error) {
          notification.error({
            message: "Error",
            description:
              error instanceof Error ? error.message : "Unknown error occurred",
          });
        } finally {
          setLoading((prev) => ({ ...prev, charts: false }));
        }
      };
      fetchCharts();
    }, [currentFilters.dateRange]),

    accounts: useCallback(() => {
      setLoading((prev) => ({ ...prev, accounts: true }));
      const fetchAccounts = async () => {
        try {
          const response = await getAccountsReceivableAndPayablesApi();

          if (response.success) {
            setAccountsData(response.data);
          } else {
            throw new Error(response.message || "Failed to load accounts data");
          }
        } catch (error) {
          notification.error({
            message: "Error",
            description:
              error instanceof Error ? error.message : "Unknown error occurred",
          });
        } finally {
          setLoading((prev) => ({ ...prev, accounts: false }));
        }
      };
      fetchAccounts();
    }, []),

    transactions: useCallback(() => {
      setLoading((prev) => ({ ...prev, transactions: true }));
      const transactionFilters: TransactionFilters = {
        limit: currentFilters.transactionLimit || 10,
      };

      handleApiCall<Transaction[]>(
        () => getRecentTransactionsApi(transactionFilters),
        setRecentTransactions,
        "transactions"
      );
    }, [handleApiCall, currentFilters.transactionLimit]),

    pnl: useCallback(() => {
      setLoading((prev) => ({ ...prev, pnl: true }));
      const chartFilters: ChartFilters = currentFilters.dateRange
        ? {
            startDate: currentFilters.dateRange.startDate,
            endDate: currentFilters.dateRange.endDate,
          }
        : {};

      handleApiCall<StatValue>(
        () => getPnLSummaryApi(chartFilters),
        setPnlSummary,
        "pnl"
      );
    }, [handleApiCall, currentFilters.dateRange]),
  };

  return {
    data: {
      summary,
      pnlSummary,
      chartData,
      accountsData,
      recentTransactions,
    },
    loading,
    refetch,
    filters: currentFilters,
    updateFilters,
  };
};
