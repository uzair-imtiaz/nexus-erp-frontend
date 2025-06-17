import {
  Alert,
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Typography,
} from "antd";
import Title from "antd/es/typography/Title";
import dayjs from "dayjs";
import React, { useState } from "react";
import AddItemForm from "./add-item-form";
import ItemTable from "./item-table";
import { Transaction } from "./types";

const { Text } = Typography;

interface TransactionFormProps {
  transaction?: Transaction;
  parties: any[];
  type: "sale" | "sale-return" | "purchase" | "purchase-return";
  onSave: (transaction: Transaction) => void;
  inventory: any[];
  submitLoading?: boolean;
  loading?: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  type,
  onSave,
  parties,
  inventory,
  submitLoading,
  loading,
}) => {
  const isEditing = !!transaction;
  const transType =
    type?.split("-")[0]?.charAt(0).toUpperCase() + type.slice(1);

  const [form] = Form.useForm();
  const [items, setItems] = useState(transaction ? transaction.items : []);
  const [error, setError] = useState<string | null>(null);

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (items.length === 0) {
          setError("Please add at least one sale item.");
          return;
        }
        setError(null);
        onSave({
          ...values,
          items,
          type,
        });
      })
      .catch(() => {
        setError("Please fill all required fields.");
      });
  };

  if (loading) return <Spin />;

  return (
    <>
      <div
        style={{
          background: "linear-gradient(90deg, #1B4D3E, #34A58E)",
          padding: 16,
          borderRadius: "8px 8px 0 0",
          color: "#fff",
        }}
      >
        <Title level={4} style={{ color: "#fff", margin: 0 }}>
          {isEditing ? `Edit ${transType}` : `New ${transType}`}
        </Title>
        <Text style={{ color: "#cbd5e1" }}>
          {isEditing
            ? `Update existing ${type} transaction`
            : `Create a new ${type} record`}
        </Text>
      </div>

      <div style={{ padding: 24 }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            date: transaction ? dayjs(transaction.date) : dayjs(),
            entity: transaction?.entity,
            notes: transaction?.notes || "",
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: "Please select date" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item label="Ref" name={"ref"}>
                <Input placeholder="Enter Ref" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={type === "sale" ? "Customer" : "Vendor"}
                name="entity"
                rules={[{ required: true, message: "Please select an option" }]}
              >
                <Select placeholder="Select option">
                  {parties.map((party) => (
                    <Select.Option key={party.id} value={party.id}>
                      {party.name} ({party.code})
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Text strong style={{ display: "block", marginBottom: 8 }}>
            Add Sale Item
          </Text>
          <AddItemForm
            onAdd={(item) => setItems([...items, item])}
            list={inventory}
            type={type}
          />

          {!!items?.length && (
            <>
              <Divider />
              <Text strong>{transType} Items</Text>
              <ItemTable items={items} onRemove={handleRemoveItem} />
            </>
          )}

          <Form.Item label="Notes" name="notes">
            <Input.TextArea
              rows={3}
              placeholder="Add any additional notes here..."
            />
          </Form.Item>

          {error && (
            <Alert
              type="error"
              message={error}
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={submitLoading}
            >
              {isEditing ? `Update ${transType}` : `Create ${transType}`}
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default TransactionForm;
