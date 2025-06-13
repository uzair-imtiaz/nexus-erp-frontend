import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Row,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import { useState } from "react";
import { createInventory, updateInventory } from "../../../apis";
import { responseMetadata } from "../../../apis/types";
import { AddEditItemModalProps } from "./types";
import { suggestedUnits } from "../constants/index.constants";

const { Option } = Select;

const AddEditItemModal: React.FC<AddEditItemModalProps> = ({
  item,
  setItems = () => {},
  onClose = () => {},
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [multiUnits, setMultiUnits] = useState<Record<string, number>>(
    item?.multiUnits || {}
  );
  const [newUnit, setNewUnit] = useState<{
    name: string;
    factor: number | null;
  }>({ name: "", factor: null });
  const [loading, setLoading] = useState(false);

  const handleAddUnit = () => {
    if (!newUnit.name.trim()) {
      notification.warning({ message: "Unit name is required" });
      return;
    }
    if (newUnit.factor == null || isNaN(newUnit.factor)) {
      notification.warning({ message: "Conversion factor is required" });
      return;
    }
    if (multiUnits[newUnit.name]) {
      notification.warning({ message: "This unit is already added" });
      return;
    }
    setMultiUnits({ ...multiUnits, [newUnit.name]: newUnit.factor });
    setNewUnit({ name: "", factor: null });
  };

  const handleRemoveUnit = (name: string) => {
    const updated = { ...multiUnits };
    delete updated[name];
    setMultiUnits(updated);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const finalData = {
        ...values,
        multiUnits,
        quantity: Number(values.quantity),
        baseRate: Number(values.baseRate),
      };
      const response: responseMetadata = item?.code
        ? await updateInventory(item.id, finalData)
        : await createInventory(finalData);
      if (!response.success) {
        notification.error({
          message: "Error",
          description: response.message,
        });
      }
      form.resetFields();
      setMultiUnits({});
      notification.success({
        message: "Success",
        description: response.message,
      });
      onClose();
      onSuccess(response.data);
    } catch (error: any) {
      console.error("Form validation failed:", error);
      notification.error({
        message: "Error",
        description: error?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const unitColumns = [
    {
      title: "Unit Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Conversion Factor",
      key: "factor",
      render: (_, record) =>
        `1 ${record.name} = ${record.factor} ${
          form.getFieldValue("baseUnit") || ""
        }`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={() => handleRemoveUnit(record.name)}
          type="link"
        />
      ),
    },
  ];

  const unitDataSource = Object.entries(multiUnits).map(([name, factor]) => ({
    name,
    factor,
  }));

  return (
    <Modal
      title={item ? "Edit Item" : "Add New Item"}
      open
      onCancel={onClose}
      onOk={handleSubmit}
      okText={item ? "Save Changes" : "Add Item"}
      okButtonProps={{ loading }}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          id: item?.id || "",
          name: item?.name || "",
          category: item?.category || "Raw Material",
          baseUnit: item?.baseUnit || "",
          quantity: item?.quantity || 0,
          baseRate: item?.baseRate || 0,
          code: item?.code || "",
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Item Code"
              name="code"
              rules={[{ required: true, message: "Code is required" }]}
            >
              <Input type="text" name="id" disabled={!!item} />
            </Form.Item>

            <Form.Item
              label="Item Name"
              name="name"
              rules={[{ required: true, message: "Item name is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="Raw Material">Raw Material</Option>
                <Option value="Semi-Finished Goods">Semi-Finished Goods</Option>
                <Option value="Finished Goods">Finished Goods</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Base Unit"
              name="baseUnit"
              rules={[{ required: true, message: "Base unit is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Quantity Available"
              name="quantity"
              initialValue={0}
            >
              <InputNumber min={0} step={1} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Current Rate"
              name="baseRate"
              rules={[{ required: true, message: "Rate is required" }]}
            >
              <InputNumber min={0} step={1} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Multi Units</Divider>

        {unitDataSource.length > 0 && (
          <Table
            dataSource={unitDataSource}
            columns={unitColumns}
            pagination={false}
            rowKey={(record) => record.name}
            size="small"
          />
        )}

        <Space style={{ width: "100%" }} size="large">
          <Typography.Text strong>Add Unit</Typography.Text>
          <Space.Compact style={{ width: "100%" }} size="middle">
            <AutoComplete
              options={suggestedUnits
                .filter((u) => !multiUnits[u]) // remove already added units
                .map((unit) => ({ value: unit }))}
              placeholder="Unit Name"
              value={newUnit.name}
              onChange={(val) => setNewUnit({ ...newUnit, name: val })}
              style={{ width: "33%" }}
              filterOption={(inputValue, option) =>
                option?.value
                  ?.toLowerCase()
                  .includes(inputValue.toLowerCase()) ?? false
              }
            />
            <InputNumber
              placeholder="Conversion Factor"
              min={0.01}
              step={0.01}
              value={newUnit.factor}
              onChange={(val) => setNewUnit({ ...newUnit, factor: val })}
              style={{ width: "33%" }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddUnit}
              style={{ width: "34%" }}
            >
              Add Unit
            </Button>
          </Space.Compact>
        </Space>
      </Form>
    </Modal>
  );
};

export default AddEditItemModal;
