import { LoadingOutlined } from "@ant-design/icons";
import { ConfigProvider, Spin } from "antd";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/common/layout";
import Dashboard from "./components/Dashboard";
import Formulation from "./components/Formulation";
import Production from "./components/Production";
import Reports from "./components/Reports";
import Login from "./features/auth/LoginForm";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import RegisterForm from "./features/auth/RegisterForm";
import Core from "./features/core";
import ExpenseListing from "./features/expenses";
import AddExpenses from "./features/expenses/add-expenses";
import Inventory from "./features/inventory/inventory";
import Journal from "./features/journal";
import JournalEntry from "./features/journal/add-journal";
import SaleForm from "./features/transactions/sale-form";
import TransactionsPage from "./features/transactions/transactions";

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
              <Route index element={<Dashboard />} />
              <Route path="core/inventory" element={<Inventory />} />
              <Route path="production" element={<Production />} />
              <Route path="formulation" element={<Formulation />} />
              <Route path="transactions" element={<TransactionsPage />} />
              <Route path="sales/new" element={<SaleForm />} />
              <Route path="journal" element={<Journal />} />
              <Route path="journal/new" element={<JournalEntry />} />
              <Route path="expenses" element={<ExpenseListing />} />
              <Route path="expenses/new" element={<AddExpenses />} />
              <Route path="expenses/:id" element={<AddExpenses />} />
              <Route path="core" element={<Core />} />
              <Route path="reports" element={<Reports />} />
              <Route path="core/banks" element={<Reports />} />
              {/* <Route path="settings" element={<Settings />} /> */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
