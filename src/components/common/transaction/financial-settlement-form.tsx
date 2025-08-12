import {
  Alert,
  Button,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  notification,
  Row,
  Select,
  Table,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { Formik, Form as FormikForm } from "formik";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { getBanks } from "../../../services/bank-services";
import { formatCurrency } from "../../../utils";
import PaginatedSelect from "../paginated-select/paginated-select";
import { createPayload, getInitialValues, PaymentTypeOptions } from "./utils";

const { Title, Text } = Typography;
const { TextArea } = Input;

const itemLayout = {
  labelCol: { span: 10 },
  colon: false,
  labelAlign: "right",
};

// Validation Schema
const getValidationSchema = (isReceipt) => {
  return Yup.object().shape({
    transactor: Yup.string()
      .nullable()
      .required(`${isReceipt ? "Customer" : "Vendor"} is required`),
    bank: Yup.string().nullable().required("Bank is required"),
    date: Yup.object().nullable().required("Date is required"),
    amount: Yup.number()
      .min(0.01, "Amount must be greater than 0")
      .required("Amount is required"),
    mode: Yup.string().required("Payment mode is required"),
    ref: Yup.string().max(50, "Reference number cannot exceed 50 characters"),
    notes: Yup.string().max(500, "Notes cannot exceed 500 characters"),
  });
};

// Custom Form Item component with error display
const FormItemWithError = ({
  children,
  error,
  touched,
  label,
  required = false,
  ...props
}) => (
  <Form.Item
    label={label}
    required={required}
    validateStatus={error && touched ? "error" : ""}
    help={error && touched ? error : ""}
    {...itemLayout}
    {...props}
  >
    {children}
  </Form.Item>
);

const FinancialSettlementForm = ({
  transactorApi,
  type,
  initialData = null,
  isEdit = false,
  onSubmit,
  onCancel,
  createApi,
}) => {
  const isReceipt = type === "receipt";
  const transactorLabel = isReceipt ? "Customer" : "Vendor";
  const [transactions, setTransactions] = useState({});
  const [isManuallyEditing, setIsManuallyEditing] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const navigate = useNavigate();

  const distributeAmount = useCallback(
    (amount, transactionsList, currentValues) => {
      if (!transactionsList || transactionsList.length === 0 || amount <= 0) {
        return (
          transactionsList?.map((t) => ({ ...t, receipt: 0, discount: 0 })) ||
          []
        );
      }

      let remainingAmount = parseFloat(amount) || 0;
      const updatedTransactions = [...transactionsList];

      // Reset all receipts and discounts first if not manually editing
      if (!isManuallyEditing) {
        updatedTransactions.forEach((t) => {
          t.receipt = 0;
          t.discount = 0;
        });
      }

      // Distribute in order of priority (array order)
      for (
        let i = 0;
        i < updatedTransactions.length && remainingAmount > 0;
        i++
      ) {
        const transaction = updatedTransactions[i];
        const maxAllowable = Math.max(
          0,
          (transaction.outstandingBalance || 0) - (transaction.discount || 0)
        );

        if (maxAllowable > 0) {
          const allocateAmount = Math.min(remainingAmount, maxAllowable);
          transaction.receipt = (transaction.receipt || 0) + allocateAmount;
          remainingAmount -= allocateAmount;
        }
      }

      // Calculate totals
      updatedTransactions.forEach((transaction) => {
        transaction.total = Math.max(
          0,
          (transaction.receipt || 0) - (transaction.discount || 0)
        );
      });

      return updatedTransactions;
    },
    [isManuallyEditing]
  );

  // Calculate unallocated balance
  const calculateUnallocatedBalance = useCallback(
    (amount, transactionsList) => {
      const totalAllocated = (transactionsList || []).reduce(
        (sum, t) => sum + (t.receipt || 0),
        0
      );
      return Math.max(0, (amount || 0) - totalAllocated);
    },
    []
  );

  // Enhanced discount change handler
  const handleDiscountChange = useCallback(
    (newValue, record, setFieldValue, values) => {
      setIsManuallyEditing(true);

      const currentTransactions = values.transactor
        ? transactions[values.transactor] || []
        : [];

      const updatedTransactions = currentTransactions.map((t) => {
        if (t.key === record.key) {
          const newDiscount = Math.max(
            0,
            Math.min(newValue || 0, t.outstandingBalance - (t.receipt || 0))
          );
          return {
            ...t,
            discount: newDiscount,
            total: Math.max(0, (t.receipt || 0) - newDiscount),
          };
        }
        return t;
      });

      setTransactions((prev) => ({
        ...prev,
        [values.transactor]: updatedTransactions,
      }));

      setTimeout(() => setIsManuallyEditing(false), 100);
    },
    [transactions]
  );

  // Enhanced receipt change handler
  const handleReceiptChange = useCallback(
    (newValue, record, setFieldValue, values) => {
      setIsManuallyEditing(true);

      const currentTransactions = values.transactor
        ? transactions[values.transactor] || []
        : [];

      // Calculate current total receipts excluding the one being changed
      const otherReceiptsTotal = currentTransactions.reduce(
        (sum, t) => sum + (t.key !== record.key ? t.receipt || 0 : 0),
        0
      );

      // Calculate maximum allowed for this receipt to not exceed main amount
      const maxAllowedByAmount = Math.max(
        0,
        (values.amount || 0) - otherReceiptsTotal
      );

      const updatedTransactions = currentTransactions.map((t) => {
        if (t.key === record.key) {
          const maxAllowedByBalance = t.outstandingBalance - (t.discount || 0);
          const newReceipt = Math.max(
            0,
            Math.min(
              newValue || 0,
              Math.min(maxAllowedByBalance, maxAllowedByAmount)
            )
          );

          // Show warning if user tried to exceed amount limit
          if ((newValue || 0) > maxAllowedByAmount && maxAllowedByAmount >= 0) {
            message.warning(
              `Receipt amount cannot exceed remaining balance of ${maxAllowedByAmount.toLocaleString()}`
            );
          }

          return {
            ...t,
            receipt: newReceipt,
            total: Math.max(
              0,
              t.outstandingBalance - (t.discount || 0) - newReceipt
            ),
          };
        }
        return t;
      });

      setTransactions((prev) => ({
        ...prev,
        [values.transactor]: updatedTransactions,
      }));

      // Recalculate total amount and unallocated balance
      const totalAllocated = updatedTransactions.reduce(
        (sum, t) => sum + (t.receipt || 0),
        0
      );
      const newUnallocatedBalance = Math.max(
        0,
        (values.amount || 0) - totalAllocated
      );

      setFieldValue("unallocatedBalance", newUnallocatedBalance);

      setTimeout(() => setIsManuallyEditing(false), 100);
    },
    [transactions]
  );

  // Handle amount field changes
  const handleAmountChange = useCallback(
    (newAmount, setFieldValue, values) => {
      setFieldValue("amount", newAmount);

      const currentTransactions = values.transactor
        ? transactions[values.transactor] || []
        : [];

      if (currentTransactions.length > 0) {
        const distributedTransactions = distributeAmount(
          newAmount,
          currentTransactions,
          values
        );

        setTransactions((prev) => ({
          ...prev,
          [values.transactor]: distributedTransactions,
        }));

        const unallocatedBalance = calculateUnallocatedBalance(
          newAmount,
          distributedTransactions
        );
        setFieldValue("unallocatedBalance", unallocatedBalance);
      } else {
        setFieldValue("unallocatedBalance", newAmount || 0);
      }
    },
    [transactions, distributeAmount, calculateUnallocatedBalance]
  );

  const getColumns = (setFieldValue, values) => [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (value) => dayjs(value).format("DD/MM/YYYY"),
    },
    {
      title: isReceipt ? "Inv. No." : "Bill No.",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Original Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (value) => `${(value || 0).toLocaleString()}.00`,
    },
    {
      title: "Outstanding Balance",
      dataIndex: "outstandingBalance",
      key: "outstandingBalance",
      render: (value) => `${(value || 0).toLocaleString()}.00`,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      width: 150,
      render: (value, record) => (
        <InputNumber
          value={value || null}
          placeholder="Disc."
          onChange={(newValue) =>
            handleDiscountChange(newValue, record, setFieldValue, values)
          }
          width={150}
          formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={(val) => val?.replace(/\$\s?|(,*)/g, "")}
          // min={0}
          max={record.outstandingBalance - (record.receipt || 0)}
        />
      ),
    },
    {
      title: isReceipt ? "Receipt" : "Payment",
      dataIndex: "receipt",
      key: "receipt",
      render: (value, record) => {
        // Calculate total receipts excluding current record
        const currentTransactions = values.transactor
          ? transactions[values.transactor] || []
          : [];
        const otherReceiptsTotal = currentTransactions.reduce(
          (sum, t) => sum + (t.key !== record.key ? t.receipt || 0 : 0),
          0
        );
        const maxAllowedByAmount = Math.max(
          0,
          (values.amount || 0) - otherReceiptsTotal
        );
        const maxAllowedByBalance =
          record.outstandingBalance - (record.discount || 0);
        const maxAllowed = Math.min(maxAllowedByBalance, maxAllowedByAmount);

        return (
          <InputNumber
            value={value || null}
            placeholder="Amount"
            onChange={(newValue) =>
              handleReceiptChange(newValue, record, setFieldValue, values)
            }
            formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(val) => val?.replace(/\$\s?|(,*)/g, "")}
            min={0}
            max={maxAllowed}
          />
        );
      },
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (value) => `${(value || 0).toLocaleString()}.00`,
    },
  ];

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setSubmitError(null);

      // Additional business logic validations
      const currentTransactions = values.transactor
        ? transactions[values.transactor] || []
        : [];

      const totalAllocated = currentTransactions.reduce(
        (sum, t) => sum + (t.receipt || 0),
        0
      );

      // Validate that at least one transaction has an allocation if transactions exist
      if (
        currentTransactions.length > 0 &&
        totalAllocated === 0 &&
        values.amount > 0
      ) {
        message.warning(
          "Please allocate the amount to at least one transaction"
        );
        return;
      }

      const payload = createPayload(
        values,
        isReceipt,
        transactions[values.transactor]
      );
      console.log("payload", payload);

      const response = await createApi(payload);
      if (response?.success) {
        notification.success({
          message: "Success",
          description: response?.message,
        });
        navigate(`/transactions#${type}`);
      } else {
        notification.error({
          message: "Error",
          description: response?.message,
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      notification.error({
        message: "Error",
        description: error?.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Title level={3} style={{ marginBottom: "32px" }}>
        {isEdit ? "Edit" : "Add"} {isReceipt ? "Receipt" : "Payment"}
      </Title>

      {submitError && (
        <Alert
          message="Submission Error"
          description={submitError}
          type="error"
          closable
          onClose={() => setSubmitError(null)}
          style={{ marginBottom: 24 }}
        />
      )}

      <Formik
        initialValues={getInitialValues(isEdit, initialData)}
        validationSchema={getValidationSchema(isReceipt)}
        onSubmit={handleSubmit}
        enableReinitialize={true}
        validateOnChange={true}
        validateOnBlur={true}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          setFieldTouched,
          handleSubmit,
          isSubmitting,
          isValid,
        }) => {
          console.log("values", transactions[values.transactor]);
          console.log("values.transactor", values.transactor);
          return (
            <FormikForm>
              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <FormItemWithError
                    label={transactorLabel}
                    required
                    error={errors.transactor}
                    touched={touched.transactor}
                  >
                    <PaginatedSelect
                      api={transactorApi}
                      queryParamName="name"
                      optionsFormatter={(options) => {
                        const _transactions = {};
                        const _transactionsOptions = options?.map((item) => {
                          // Initialize transactions with proper structure
                          _transactions[item.id] =
                            item.transactions?.map((t, index) => ({
                              ...t,
                              key: t.id || index,
                              discount: t.discount || 0,
                              receipt: t.receipt || 0,
                              total:
                                t.outstandingBalance -
                                (t.discount || 0) -
                                (t.receipt || 0),
                            })) || [];

                          return {
                            label: `${item.name} (${item.code})`,
                            value: item.id,
                            key: item.id,
                          };
                        });
                        setTransactions(_transactions);
                        return _transactionsOptions;
                      }}
                      placeholder={`Select ${transactorLabel}`}
                      value={values.transactor}
                      onChange={(value) => {
                        setFieldValue("transactor", value);
                        setFieldTouched("transactor", true);
                        setFieldTouched("ref", true);
                        if (!isEdit) {
                          setFieldValue("amount", 0);
                          setFieldValue("unallocatedBalance", 0);
                        }
                      }}
                      onBlur={() => setFieldTouched("transactor", true)}
                      disabled={isEdit}
                      style={{ width: "100%" }}
                      status={
                        errors.transactor && touched.transactor ? "error" : ""
                      }
                    />
                  </FormItemWithError>
                </Col>
                <Col xs={24} md={8}>
                  <FormItemWithError
                    label="Bank"
                    required
                    error={errors.bank}
                    touched={touched.bank}
                  >
                    <PaginatedSelect
                      api={getBanks}
                      queryParamName="name"
                      placeholder="Select Bank Account"
                      labelExtractor={(item) => `${item.name}`}
                      value={values.bank}
                      style={{ width: "100%" }}
                      onChange={(value) => {
                        setFieldValue("bank", value);
                        setFieldTouched("bank", true);
                      }}
                      onBlur={() => setFieldTouched("bank", true)}
                      status={errors.bank && touched.bank ? "error" : ""}
                    />
                  </FormItemWithError>
                </Col>
                <Col xs={24} md={8}>
                  <FormItemWithError
                    label="Mode"
                    error={errors.mode}
                    touched={touched.mode}
                  >
                    <Select
                      value={values.mode}
                      onChange={(value) => {
                        setFieldValue("mode", value);
                        setFieldTouched("mode", true);
                      }}
                      onBlur={() => setFieldTouched("mode", true)}
                      placeholder="Select Mode"
                      options={PaymentTypeOptions}
                      style={{ width: "100%" }}
                      status={errors.mode && touched.mode ? "error" : ""}
                    />
                  </FormItemWithError>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <FormItemWithError
                    label="Date"
                    required
                    error={errors.date}
                    touched={touched.date}
                  >
                    <DatePicker
                      value={values.date}
                      onChange={(date) => {
                        setFieldValue("date", date);
                        setFieldTouched("date", true);
                      }}
                      onBlur={() => setFieldTouched("date", true)}
                      placeholder="Select date"
                      style={{ width: "100%" }}
                      format="DD/MM/YYYY"
                      status={errors.date && touched.date ? "error" : ""}
                    />
                  </FormItemWithError>
                </Col>
                <Col xs={24} md={8}>
                  <FormItemWithError
                    label={isReceipt ? "Receipt Amount" : "Payment Amount"}
                    required
                    error={errors.amount}
                    touched={touched.amount}
                  >
                    <InputNumber
                      value={values.amount}
                      onChange={(value) => {
                        handleAmountChange(value, setFieldValue, values);
                        setFieldTouched("amount", true);
                      }}
                      onBlur={() => setFieldTouched("amount", true)}
                      placeholder="0.00"
                      style={{ width: "100%" }}
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                      parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                      min={0}
                      status={errors.amount && touched.amount ? "error" : ""}
                    />
                  </FormItemWithError>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Unallocated Balance" {...itemLayout}>
                    <Flex vertical>
                      <InputNumber
                        value={values.unallocatedBalance}
                        placeholder="0.00"
                        style={{ width: "100%" }}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        disabled
                      />
                      {(values.unallocatedBalance || 0) > 0 && (
                        <Text type="warning" style={{ fontSize: "12px" }}>
                          Advance Balance:{" "}
                          {values.unallocatedBalance?.toLocaleString()}.00
                        </Text>
                      )}
                    </Flex>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} md={8}>
                  <FormItemWithError
                    label="Ref No"
                    error={errors.ref}
                    touched={touched.ref}
                  >
                    <Input
                      value={values.ref}
                      onChange={(e) => {
                        setFieldValue("ref", e.target.value);
                        setFieldTouched("ref", true);
                      }}
                      onBlur={() => setFieldTouched("ref", true)}
                      placeholder="Ref No"
                      style={{ width: "100%" }}
                      status={errors.ref && touched.ref ? "error" : ""}
                    />
                  </FormItemWithError>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label={`Mailing Address`} {...itemLayout}>
                    <TextArea
                      disabled
                      style={{ width: "100%" }}
                      value={values.mailingAddress}
                      placeholder="Enter mailing address"
                      rows={2}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  {/* Empty column for spacing */}
                </Col>
              </Row>

              <div style={{ margin: "32px 0" }}>
                <Title level={4}>
                  {isReceipt ? "Outstanding Invoices" : "Outstanding Bills"}
                </Title>
                <Table
                  columns={getColumns(setFieldValue, values)}
                  dataSource={
                    values.transactor
                      ? transactions[values.transactor] || []
                      : []
                  }
                  pagination={false}
                  size="small"
                  bordered
                  summary={(pageData) => {
                    const totals = pageData.reduce(
                      (acc, record) => {
                        const receipt = acc.receipt + (record.receipt || 0);
                        const discount = acc.discount + (record.discount || 0);

                        return {
                          outstandingBalance:
                            acc.outstandingBalance +
                            (+record.outstandingBalance || 0),
                          discount,
                          receipt,
                          total: receipt - discount, // ✅ derived from updated values
                        };
                      },
                      {
                        outstandingBalance: 0,
                        discount: 0,
                        receipt: 0,
                        total: 0,
                      }
                    );

                    return (
                      <Table.Summary.Row>
                        <Table.Summary.Cell colSpan={3}>
                          Total
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                          {formatCurrency(totals.outstandingBalance)}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                          {formatCurrency(totals.discount)}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                          {formatCurrency(totals.receipt)}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell>
                          {formatCurrency(totals.total)}
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    );
                  }}
                />
              </div>

              <FormItemWithError
                label={<Text strong>Notes</Text>}
                colon={false}
                error={errors.notes}
                touched={touched.notes}
                {...itemLayout}
              >
                <TextArea
                  value={values.notes}
                  onChange={(e) => {
                    setFieldValue("notes", e.target.value);
                    setFieldTouched("notes", true);
                  }}
                  onBlur={() => setFieldTouched("notes", true)}
                  placeholder="Enter notes"
                  rows={4}
                  status={errors.notes && touched.notes ? "error" : ""}
                />
              </FormItemWithError>

              <Flex justify="end" className="mb-10" gap={10}>
                <Button
                  disabled={isSubmitting}
                  onClick={() => onCancel && onCancel()}
                >
                  Cancel
                </Button>
                <Button
                  loading={isSubmitting}
                  type="primary"
                  onClick={handleSubmit}
                  disabled={!isValid}
                >
                  {isEdit ? "Update" : "Save"}
                </Button>
              </Flex>
            </FormikForm>
          );
        }}
      </Formik>
    </>
  );
};

export default FinancialSettlementForm;
