import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
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
import { useEffect, useState } from "react";
import { createInventory } from "../../../apis";
import { getAccountByTypeApi } from "../../../services/charts-of-accounts.services";
import { PARENT_MAP } from "../../charts-of-accounts/utils";
import { AddEditItemModalProps } from "./types";

const { Option } = Select;

const AddEditItemModal: React.FC<AddEditItemModalProps> = ({
  item,
  setItems = () => {},
  onClose = () => {},
}) => {
  const [form] = Form.useForm();
  const [multiUnits, setMultiUnits] = useState(item?.multiUnits || []);
  const [newUnit, setNewUnit] = useState({ name: "", factor: null });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        const response = await getAccountByTypeApi(PARENT_MAP["subAccount"]);
        if (response.success) {
          setAccounts(response.data);
        } else {
          notification.error({
            message: "Error",
            description: response.message,
          });
        }
      } catch (error: any) {
        notification.error({
          message: "Error",
          description: error?.message,
        });
        console.error("Error fetching data:", error);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddUnit = () => {
    if (newUnit.name && newUnit.factor) {
      setMultiUnits([...multiUnits, newUnit]);
      setNewUnit({ name: "", factor: null });
    }
  };

  const handleRemoveUnit = (index: number) => {
    const updated = [...multiUnits];
    updated.splice(index, 1);
    setMultiUnits(updated);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const finalData = {
        ...values,
        multiUnits: multiUnits.map((unit) => ({
          name: unit.name,
          factor: Number(unit.factor),
        })),
        quantity: Number(values.quantity),
        baseRate: Number(values.baseRate),
      };
      const response = await createInventory(finalData);
      if (!response.success) {
        notification.error({
          message: "Error",
          description: response.message,
        });
      }
      form.resetFields();
      setMultiUnits([]);
      notification.success({
        message: "Success",
        description: response.message,
      });
      onClose(response.data);
    } catch (error) {
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
      render: (_, __, index) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={() => handleRemoveUnit(index)}
          type="link"
        />
      ),
    },
  ];

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
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Item Code"
              name="code"
              rules={[{ required: true, message: "Code is required" }]}
            >
              <Input type="text" name="id" />
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

            <Form.Item
              label="Account"
              name="parentId"
              rules={[{ required: true, message: "Field is required" }]}
            >
              <Select
                loading={fetchLoading}
                allowClear
                showSearch
                filterOption={(input, option) => {
                  const account = option?.data;
                  return (
                    account?.name
                      ?.toLowerCase()
                      .includes(input.toLowerCase()) ||
                    account?.code?.toLowerCase().includes(input.toLowerCase())
                  );
                }}
                optionFilterProp="children"
                optionLabelProp="label"
              >
                {accounts.map((account: any) => (
                  <Option
                    key={account.id}
                    value={account.id}
                    data={account}
                    label={account.name}
                  >
                    <div>
                      <div>{account.name}</div>
                      <div style={{ color: "gray", fontSize: "12px" }}>
                        Code: {account.code}
                      </div>
                    </div>
                  </Option>
                ))}
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

        {multiUnits.length > 0 && (
          <Table
            dataSource={multiUnits}
            columns={unitColumns}
            pagination={false}
            rowKey={(record, index) => index}
            size="small"
          />
        )}

        <Space style={{ width: "100%" }} size="large">
          <Typography.Text strong>Add Unit</Typography.Text>
          <Space.Compact style={{ width: "100%" }} size="middle">
            <Input
              placeholder="Unit Name"
              value={newUnit.name}
              onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
              style={{ width: "33%" }}
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
