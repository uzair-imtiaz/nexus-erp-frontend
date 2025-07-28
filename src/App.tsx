import { LoadingOutlined } from "@ant-design/icons";
import { ConfigProvider, Spin } from "antd";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/common/layout";
import Login from "./features/auth/LoginForm";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import RegisterForm from "./features/auth/RegisterForm";
import Core from "./features/core";
import ExpenseListing from "./features/expenses";
import AddExpenses from "./features/expenses/add-expenses";
import AddEditFormulation from "./features/formulation/add-formulation";
import Formulation from "./features/formulation/formulation-listing";
import Inventory from "./features/inventory/inventory";
import Journal from "./features/journal";
import JournalEntry from "./features/journal/add-journal";
import PurchaseForm from "./features/transactions/purchase-form";
import SaleForm from "./features/transactions/sale-form";
import TransactionsPage from "./features/transactions/transactions";
import Production from "./features/production/production-listing";
import ProductionForm from "./features/production/production-form";
import TrialBalance from "./features/reports/trial-balance";
import JournalLedger from "./features/reports/journal-ledger";
import ProfitLossReport from "./features/reports/pnl-report";
import BalanceSheet from "./features/reports/balance-sheet";

const loadingIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

Spin.setDefaultIndicator(loadingIcon);

const theme = {
  token: {
    colorPrimary: "#1B4D3E",
    borderRadius: 4,
  },
};

function App() {
  return (
    <ConfigProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<RegisterForm />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AppLayout />}>
              {/* <Route index element={<Dashboard />} /> */}
              <Route path="core/inventory" element={<Inventory />} />
              <Route path="production" element={<Production />} />
              <Route path="production/new" element={<ProductionForm />} />
              <Route path="formulations" element={<Formulation />} />
              <Route path="formulations/new" element={<AddEditFormulation />} />
              <Route path="formulations/:id" element={<AddEditFormulation />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="sales/new" element={<SaleForm />} />
              <Route path="sales/:id" element={<SaleForm />} />
              <Route path="purchases/new" element={<PurchaseForm />} />
              <Route path="purchases/:id" element={<PurchaseForm />} />
              <Route path="journal" element={<Journal />} />
              <Route path="journal/new" element={<JournalEntry />} />
              <Route path="expenses" element={<ExpenseListing />} />
              <Route path="expenses/new" element={<AddExpenses />} />
              <Route path="expenses/:id" element={<AddExpenses />} />
              <Route path="core" element={<Core />} />
              <Route path="reports">
                <Route path="trial-balance" element={<TrialBalance />} />
                <Route path="journal-ledger" element={<JournalLedger />} />
                <Route path="profit-loss" element={<ProfitLossReport />} />
                <Route path="balance-sheet" element={<BalanceSheet />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
