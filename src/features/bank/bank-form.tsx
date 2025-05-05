import { DatePicker, Form, Input, InputNumber, Modal } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";

export const BankFormModal = ({
  visible,
  onCancel,
  onSubmit,
  loading,
  initialValues,
}: any) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        openingDate: initialValues.openingDate
          ? dayjs(initialValues.openingDate)
          : null,
      });
    } else {
      form.resetFields();
    }
  }, [initialValues]);

  const handleFinish = (values: any) => {
    onSubmit({
      ...values,
      openingDate: values.openingDate.format("YYYY-MM-DD"),
    });
    form.resetFields();
  };

  return (
    <Modal
      title={initialValues ? "Edit Bank" : "Add New Bank"}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Form layout="vertical" form={form} onFinish={handleFinish}>
        <Form.Item
          name="bankCode"
          label="Bank Code"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="bankName"
          label="Bank Name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="accountNumber"
          label="Account Number"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="iban" label="IBAN" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="currentBalance"
          label="Current Balance"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="openingDate"
          label="Opening Date"
          rules={[{ required: true }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
