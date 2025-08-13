import FinancialSettlementForm from "../../components/common/transaction/financial-settlement-form";
import { getCustomersWithTransactions } from "../../services/customers.services";
import { createReceiptApi } from "../../services/receipt.services";

const ReceiptForm = () => {
  return (
    <FinancialSettlementForm
      transactorApi={getCustomersWithTransactions}
      type="receipt"
      createApi={createReceiptApi}
    />
  );
};

export default ReceiptForm;
