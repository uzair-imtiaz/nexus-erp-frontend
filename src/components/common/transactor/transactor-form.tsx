import { Button, DatePicker, Form, Input, InputNumber, Modal } from "antd";
import dayjs from "dayjs";
import React from "react";
import { TransactorFormModalProps } from "./types";

const { TextArea } = Input;

export const TransactorFormModal: React.FC<TransactorFormModalProps> = ({
  visible,
  entity,
  type,
  onSave,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const isEditing = !!entity;

  React.useEffect(() => {
    if (visible && entity) {
      form.setFieldsValue({
        ...entity,
        asOfDate: entity.asOfDate ? dayjs(entity.asOfDate) : null,
      });
    }
  }, [visible, entity, form]);

  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      id: entity
        ? entity.id
        : `${type === "vendor" ? "VEN" : "CUS"}-${Math.floor(
            10000 + Math.random() * 90000
          )}`,
      type,
      asOfDate: values.asOfDate
        ? values.asOfDate.format("YYYY-MM-DD")
        : new Date().toISOString().split("T")[0],
      currentBalance: isEditing ? values.currentBalance : values.openingBalance,
    };

    onSave(formattedValues);
    form.resetFields();
  };

  return (
    <Modal
      title={
        isEditing
          ? `Edit ${type === "vendor" ? "Vendor" : "Customer"}`
          : `Add New ${type === "vendor" ? "Vendor" : "Customer"}`
      }
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          id: entity
            ? entity.id
            : `${type === "vendor" ? "VEN" : "CUS"}-${Math.floor(
                10000 + Math.random() * 90000
              )}`,
          openingBalance: 0,
          asOfDate: dayjs(),
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <Form.Item label="ID" name="id">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Contact Person" name="contactPerson">
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: "email", message: "Please enter a valid email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>

          <Form.Item label="Opening Balance" name="openingBalance">
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              precision={2}
              disabled={isEditing}
            />
          </Form.Item>

          <Form.Item label="As of Date" name="asOfDate">
            <DatePicker style={{ width: "100%" }} disabled={isEditing} />
          </Form.Item>

          {isEditing && (
            <Form.Item label="Current Balance" name="currentBalance">
              <InputNumber style={{ width: "100%" }} min={0} precision={2} />
            </Form.Item>
          )}
        </div>

        <Form.Item label="Address" name="address">
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              gap: "8px",
              marginTop: "16px",
            }}
          >
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {isEditing ? "Update" : "Save"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
