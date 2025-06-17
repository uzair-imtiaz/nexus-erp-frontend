import React, { useState } from "react";
import { Form, InputNumber, Select, Button, Typography, Tooltip } from "antd";
import { Plus } from "lucide-react";
import { TransactionItem } from "./types";

const { Text } = Typography;

interface AddSaleItemFormProps {
  onAdd: (item: TransactionItem) => void;
  list: any[];
  type: "sale" | "purchase" | "sale-return" | "purchase-return";
}

const AddItemForm: React.FC<AddSaleItemFormProps> = ({ onAdd, list, type }) => {
  const [form] = Form.useForm();
  const [multiUnitOptions, setMultiUnitOptions] = useState<
    Record<string, number>
  >({});
  const [selectedBaseUnit, setSelectedBaseUnit] = useState<string>("");

  const handleProductSelect = (productId: string) => {
    const selectedProduct = list.find((item) => item.id === productId);
    if (selectedProduct) {
      form.setFieldsValue({
        rate:
          selectedProduct.amount / selectedProduct.quantity ||
          selectedProduct.baseRate,
        unit: selectedProduct.baseUnit,
      });
      setMultiUnitOptions(selectedProduct.multiUnits || {});
      setSelectedBaseUnit(selectedProduct.baseUnit);
    }
  };

  const handleAddItem = () => {
    form
      .validateFields()
      .then((values) => {
        const newItem: TransactionItem = {
          id: values.product,
          quantity: values.quantity,
          unit: values.unit,
          rate: values.rate,
          discount:
            values.discount ??
            (values.discountPercent / 100) * values.rate * values.quantity ??
            0,
          tax:
            values.tax ??
            (values.taxPercent / 100) * values.rate * values.quantity ??
            0,
        };
        onAdd(newItem);
        form.resetFields();
      })
      .catch(() => {
        // Ignore validation errors
      });
  };

  return (
    <Form
      form={form}
      layout="inline"
      // onValuesChange={handleValuesChange}
      style={{ marginBottom: 16 }}
    >
      <Form.Item
        name="product"
        rules={[{ required: true, message: "Select product" }]}
      >
        <Select
          placeholder="Product"
          style={{ width: 160 }}
          onChange={handleProductSelect}
        >
          {list.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="quantity" rules={[{ required: true, message: "Qty" }]}>
        <InputNumber placeholder="Qty" min={1} />
      </Form.Item>

      <Form.Item name="tax">
        <InputNumber placeholder="Tax" min={0} />
      </Form.Item>

      <Form.Item name="taxPercent">
        <InputNumber placeholder="Tax %" min={0} />
      </Form.Item>

      <Form.Item name="discount">
        <InputNumber placeholder="Discount" min={0} />
      </Form.Item>

      <Form.Item name="discountPercent">
        <InputNumber placeholder="Disc. %" min={0} />
      </Form.Item>

      <Form.Item name="unit" rules={[{ required: true, message: "Unit" }]}>
        <Form.Item name="unit" rules={[{ required: true, message: "Unit" }]}>
          <Select style={{ width: 150 }} placeholder="Unit">
            {Object.entries(multiUnitOptions).map(([unitName, factor]) => (
              <Select.Option
                key={unitName}
                value={unitName}
                onChange={(unitName: string) => {
                  const factor = multiUnitOptions[unitName] || 1;
                  const selectedProduct = list.find(
                    (item) => item.id === form.getFieldValue("product")
                  );
                  if (selectedProduct) {
                    const baseRate =
                      selectedProduct.amount / selectedProduct.quantity;
                    form.setFieldsValue({ rate: baseRate * factor });
                  }
                }}
              >
                <Tooltip
                  title={`1 ${unitName} = ${factor} ${selectedBaseUnit}`}
                >
                  <Text>
                    {unitName} ({factor} {selectedBaseUnit})
                  </Text>
                </Tooltip>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form.Item>

      <Form.Item name="rate" rules={[{ required: true, message: "Rate" }]}>
        <InputNumber
          placeholder="Rate"
          min={1}
          disabled={!type.includes("purchase")}
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          icon={<Plus size={14} />}
          onClick={handleAddItem}
        >
          Add
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddItemForm;
