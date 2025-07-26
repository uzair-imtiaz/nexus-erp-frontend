import React, { useState, useRef } from "react";
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

  const productSelectRef = useRef<any>(null);

  const handleProductSelect = (productId: string) => {
    const selectedProduct = list.find((item) => item.id === productId);
    if (selectedProduct) {
      form.setFieldsValue({
        rate: selectedProduct?.sellingRate,
        unit: selectedProduct.baseUnit,
        buyingRate: selectedProduct?.baseRate,
      });
      setMultiUnitOptions(selectedProduct.multiUnits || {});
      setSelectedBaseUnit(selectedProduct.baseUnit);
    }
  };

  const handleAddItem = () => {
    form.validateFields().then((values) => {
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
      setSelectedBaseUnit("");
      setTimeout(() => {
        productSelectRef.current?.focus();
      }, 0);
    });
  };

  return (
    <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
      <Form.Item
        label="Product"
        name="product"
        rules={[{ required: true, message: "Select product" }]}
      >
        <Select
          ref={productSelectRef}
          placeholder="Product"
          style={{ width: 160 }}
          onChange={handleProductSelect}
          showSearch
        >
          {list.map((item) => (
            <Select.Option key={item.id} value={item.id}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Qty"
        name="quantity"
        rules={[{ required: true, message: "Qty" }]}
      >
        <InputNumber placeholder="Qty" min={1} />
      </Form.Item>

      <Form.Item
        label={type === "purchase" ? "Purchase Rate" : "Selling Rate"}
        name="rate"
        rules={[{ required: true, message: "Enter rate" }]}
      >
        <InputNumber
          placeholder={type === "purchase" ? "Purchase Rate" : "Selling Rate"}
          precision={2}
        />
      </Form.Item>

      <Form.Item label="Tax" name="tax">
        <InputNumber placeholder="Tax" min={0} />
      </Form.Item>

      <Form.Item label="Tax %" name="taxPercent">
        <InputNumber placeholder="Tax %" min={0} />
      </Form.Item>

      <Form.Item label="Discount" name="discount">
        <InputNumber placeholder="Discount" min={0} />
      </Form.Item>

      <Form.Item label="Disc. %" name="discountPercent">
        <InputNumber placeholder="Disc. %" min={0} />
      </Form.Item>

      <Form.Item
        label="Unit"
        name="unit"
        rules={[{ required: true, message: "Unit" }]}
      >
        <Select
          style={{ width: 150 }}
          placeholder="Unit"
          onChange={(unitName: string) => {
            form.setFieldsValue({ unit: unitName });
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
          {Object.entries(multiUnitOptions).map(([unitName, factor]) => (
            <Select.Option key={unitName} value={unitName}>
              <Tooltip title={`1 ${unitName} = ${factor} ${selectedBaseUnit}`}>
                <Text>
                  {unitName} ({factor} {selectedBaseUnit})
                </Text>
              </Tooltip>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Buying Rate" name={"buyingRate"}>
        <InputNumber placeholder="Buying Rate" precision={2} disabled />
      </Form.Item>

      <Form.Item>
        <Button
          shape="circle"
          style={{ marginTop: 29 }}
          icon={<Plus />}
          onClick={handleAddItem}
        />
      </Form.Item>
    </Form>
  );
};

export default AddItemForm;
