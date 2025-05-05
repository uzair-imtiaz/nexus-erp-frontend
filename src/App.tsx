import { ConfigProvider } from "antd";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Core from "./components/Core";
import Dashboard from "./components/Dashboard";
import Formulation from "./components/Formulation";
import Inventory from "./components/inventory/inventory";
import Production from "./components/Production";
import PurchaseSale from "./components/PurchaseSale";
import Reports from "./components/Reports";
// import Settings from './components/Settings';
import AppLayout from "./components/common/layout";

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
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="production" element={<Production />} />
            <Route path="formulation" element={<Formulation />} />
            <Route path="purchase-sale" element={<PurchaseSale />} />
            <Route path="core" element={<Core />} />
            <Route path="reports" element={<Reports />} />
            {/* <Route path="settings" element={<Settings />} /> */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
