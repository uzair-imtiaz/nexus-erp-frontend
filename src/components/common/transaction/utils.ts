import dayjs from "dayjs";

export const createPayload = (values, isReceipt, transactions) => {
  const basePayload = {
    ref: values.ref || undefined,
    date: values.date ? values.date.toISOString() : new Date().toISOString(),
    notes: values.notes || undefined,
    paymentType: values.mode,
    bankId: values.bank,
    amount: values.amount || 0,
  };

  const outstandingTransactions =
    transactions
      ?.filter(
        (transaction) =>
          (transaction.receipt || 0) > 0 || (transaction.discount || 0) > 0
      )
      ?.map((transaction) => ({
        id: transaction.id,
        amount: transaction.receipt || 0,
        discount: transaction.discount || 0,
      })) || [];

  if (isReceipt) {
    return {
      ...basePayload,
      customerId: values.transactor,
      transactions:
        outstandingTransactions.length > 0
          ? outstandingTransactions
          : undefined,
    };
  } else {
    return {
      ...basePayload,
      vendorId: values.transactor,
      transactions:
        outstandingTransactions.length > 0
          ? outstandingTransactions
          : undefined,
    };
  }
};

export const defaultInitialValues = {
  ref: "",
  date: null,
  notes: "",
  mode: "cash",
  bank: null,
  amount: null,
  transactor: null,
  unallocatedBalance: 0,
  mailingAddress: "",
};

export const getInitialValues = (isEdit, initialData) => {
  if (!isEdit || !initialData) return defaultInitialValues;

  return {
    ref: initialData.ref || "",
    date: initialData.date ? dayjs(initialData.date) : null,
    notes: initialData.notes || "",
    mode: initialData.paymentType || "cash",
    bank: initialData.bankId
      ? { id: initialData.bankId, name: initialData.bankName }
      : null,
    amount: initialData.amount || 0,
    transactor:
      initialData.customerId || initialData.vendorId
        ? {
            id: initialData.customerId || initialData.vendorId,
            name: initialData.customerName || initialData.vendorName,
          }
        : null,
    unallocatedBalance: 0,
    mailingAddress: initialData.mailingAddress || "",
  };
};

export enum PaymentTypes {
  CASH = "cash",
  BANK = "bank",
  CARD = "card",
  CHEQUE = "cheque",
  ONLINE = "online",
  PAY_ORDER = "pay_order",
  OTHER = "other",
}

export const PaymentTypeOptions = [
  { label: "Cash", value: PaymentTypes.CASH },
  { label: "Bank", value: PaymentTypes.BANK },
  { label: "Card", value: PaymentTypes.CARD },
  { label: "Cheque", value: PaymentTypes.CHEQUE },
  { label: "Online", value: PaymentTypes.ONLINE },
  { label: "Pay Order", value: PaymentTypes.PAY_ORDER },
  { label: "Other", value: PaymentTypes.OTHER },
];
