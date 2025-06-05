import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Switch,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { TransactorFormModalProps } from "./types";

const { TextArea } = Input;

export const TransactorFormModal: React.FC<TransactorFormModalProps> = ({
  visible,
  entity,
  type,
  onSave,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const isEditing = !!entity;

  useEffect(() => {
    if (entity)
      form.setFieldsValue({
        ...entity,
        openingBalanceDate: entity?.openingBalanceDate
          ? dayjs(entity.openingBalanceDate)
          : null,
      });
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const formattedValues = {
        openingBalanceDate: values.openingBalanceDate
          ? values.openingBalanceDate.format("YYYY-MM-DD")
          : new Date().toISOString().split("T")[0],
        status: !!values.status,
        ...values,
      };

      await onSave(formattedValues);
    } finally {
      setLoading(false);
      onCancel();
    }
  };

  return (
    <Modal
      title={
        isEditing
          ? `Edit ${type === "vendor" ? "Vendor" : "Customer"}`
          : `Add New ${type === "vendor" ? "Vendor" : "Customer"}`
      }
      open={visible}
      onOk={form.submit}
      okText={entity ? "Update" : "Save"}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      width={800}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          openingBalance: 0,
          openingBalanceDate: dayjs(),
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Code"
              name="code"
              rules={[{ required: true, message: "Please enter the code!" }]}
            >
              <Input disabled={isEditing} />
            </Form.Item>

            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter the name!" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Contact Person"
              name="personName"
              rules={[
                { required: true, message: "Please enter the contact person!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Phone" name="contactNumber">
              <Input />
            </Form.Item>

            <Form.Item
              label="Opening Balance"
              name="openingBalance"
              rules={[
                {
                  required: true,
                  message: "Please enter the opening balance!",
                },
              ]}
            >
              <InputNumber style={{ width: "100%" }} min={0} precision={1} />
            </Form.Item>

            <Form.Item
              label="As of Date"
              name="openingBalanceDate"
              rules={[
                { required: true, message: "Please select the as of date!" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            {entity && (
              <Form.Item
                label="Status"
                name="status"
                rules={[
                  { required: true, message: "Please select the status!" },
                ]}
              >
                <Switch />
              </Form.Item>
            )}
          </Col>
        </Row>

        <Form.Item label="Address" name="address">
          <TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
