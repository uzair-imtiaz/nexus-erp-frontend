import * as yup from "yup";
import dayjs from "dayjs";

export const receiptValidationSchema = yup.object().shape({
  customer: yup.string().required("Customer is required"),
  bank: yup.string().required("Bank is required"),
  mode: yup.string().nullable(),
  mailingAddress: yup.string().nullable(),
  date: yup
    .mixed()
    .required("Date is required")
    .test("is-date", "Invalid date", (value) => dayjs(value).isValid()),
  amount: yup
    .number()
    .required("Amount is required")
    .typeError("Amount must be a number")
    .moreThan(0, "Amount must be greater than 0"),
  refNo: yup.string().nullable(),
  unallocatedBalance: yup.number().nullable(),
  notes: yup.string().nullable(),
});

export const initialValues = {
  customer: null,
  mailingAddress: "",
  bank: null,
  date: null,
  amount: 0,
  unallocatedBalance: 0,
  mode: null,
  refNo: "",
  notes: "",
};
