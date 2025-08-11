import FinancialSettlementForm from "../../components/common/transaction/financial-settlement-form";
import { getCustomersWithTransactions } from "../../services/customers.services";

const ReceiptForm = () => {
  return (
    <FinancialSettlementForm
      transactorApi={getCustomersWithTransactions}
      type="receipt"
    />
  );
};

export default ReceiptForm;
