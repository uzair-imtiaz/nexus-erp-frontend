import { Button, Form, Input, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import PaginatedSelect from "../../components/common/paginated-select/paginated-select";
import { getAccounts } from "../../services/charts-of-accounts.services";
import { ACCOUNT_TYPE, PARENT_MAP } from "./utils";

const { Option } = Select;

const AddAccountModal = ({
  visible = false,
  onCancel = () => {},
  onSave = (values) => {},
  loading = false,
  accountData = null,
}) => {
  const [form] = Form.useForm();
  const [selectedType, setSelectedType] = useState<string>();

  useEffect(() => {
    if (!accountData) return;
    form.setFieldsValue(accountData);
    setSelectedType(accountData.type);
  }, []);

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        onSave(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    form.setFieldsValue({ parentId: undefined });
  };

  return (
    <Modal
      title="Add New Account"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <p>Create a new account in the chart of accounts.</p>

      <Form form={form} layout="vertical">
        <Form.Item
          label="Account Level"
          name="type"
          rules={[{ required: true, message: "Please select account level" }]}
        >
          <Select placeholder="Select type" onChange={handleTypeChange}>
            {ACCOUNT_TYPE?.slice(1).map((type) => (
              <Option key={type.value} value={type.value} allowClear>
                {type.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {selectedType && selectedType !== "accountGroup" && (
          <Form.Item
            label="Parent Account"
            name="parentId"
            rules={[
              { required: true, message: "Please select a parent account" },
            ]}
          >
            <PaginatedSelect
              api={getAccounts}
              apiParams={{ types: PARENT_MAP[selectedType] }}
              queryParamName="name"
              placeholder="Select Parent Account"
              value={form.getFieldValue("parentId")}
            />
          </Form.Item>
        )}

        <div style={{ display: "flex", gap: "12px" }}>
          <Form.Item
            label="Account Name"
            name="name"
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Please enter account name" }]}
          >
            <Input placeholder="Enter account name" />
          </Form.Item>

          <Form.Item
            label="Account Code"
            name="code"
            style={{ flex: 1 }}
            rules={[{ required: true, message: "Please enter account code" }]}
          >
            <Input placeholder="Enter account code" />
          </Form.Item>
        </div>

        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
        >
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" onClick={handleSave} loading={loading}>
            Save Account
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddAccountModal;
