import FinancialSettlementForm from "../../components/common/transaction/financial-settlement-form";
import { createPaymentApi } from "../../services/payment.services";
import { getVendorsWithTransactions } from "../../services/vendors.services";

const PaymentForm = () => {
  return (
    <FinancialSettlementForm
      transactorApi={getVendorsWithTransactions}
      type="payment"
      createApi={createPaymentApi}
    />
  );
};

export default PaymentForm;
