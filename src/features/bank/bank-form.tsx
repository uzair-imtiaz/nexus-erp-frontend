import { DatePicker, Form, Input, InputNumber, Modal, Row, Col } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { buildQueryString } from "../../utils";
import { getCodeApi } from "../../services/common.services";

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

  useEffect(() => {
    const getCode = async () => {
      const query = buildQueryString({ entity: "BANK" });
      const response = await getCodeApi(query);
      form.setFieldValue("code", response.data.code);
    };
    if (form.getFieldValue("code")) {
      return;
    }
    if (!initialValues) {
      getCode();
    }
  }, []);

  const handleFinish = async (values: any) => {
    const { code, ...rest } = values;
    await onSubmit({
      ...rest,
      openingDate: values.openingDate.format("YYYY-MM-DD"),
      ...(!initialValues && { code }),
    });
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="code"
              label="Bank Code"
              rules={[{ required: true }]}
            >
              <Input disabled={initialValues} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Bank Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="accountNumber"
              label="Account Number"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="iban" label="IBAN" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="currentBalance"
              label="Current Balance"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="openingDate"
              label="Opening Date"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
