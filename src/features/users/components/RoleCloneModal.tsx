import React, { useState } from "react";
import { Modal, Form, Input, Button, Space, notification } from "antd";
import { cloneRoleApi, type Role } from "../../../services/user.services";

interface RoleCloneModalProps {
  visible: boolean;
  role: Role | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export const RoleCloneModal: React.FC<RoleCloneModalProps> = ({
  visible,
  role,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    if (!role) return;

    try {
      setLoading(true);

      const response = await cloneRoleApi(role.id, {
        name: values.name,
        description: values.description,
      });

      if (response.success) {
        notification.success({
          message: "Success",
          description: "Role cloned successfully",
        });
        form.resetFields();
        onSuccess();
      } else {
        notification.error({
          message: "Error",
          description: response.message || "Failed to clone role",
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to clone role",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!role) return null;

  return (
    <Modal
      title={`Clone Role - ${role.name}`}
      open={visible}
      onCancel={onCancel}
      footer={
        <Space>
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            type="primary"
            loading={loading}
            onClick={() => form.submit()}
          >
            Clone Role
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: `${role.name} (Copy)`,
          description: role.description
            ? `Copy of ${role.description}`
            : `Copy of ${role.name}`,
        }}
      >
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="text-sm text-blue-800">
            <strong>Cloning:</strong> {role.name}
          </div>
          <div className="text-xs text-blue-600 mt-1">
            The new role will inherit all permissions from the original role.
          </div>
        </div>

        <Form.Item
          name="name"
          label="New Role Name"
          rules={[
            { required: true, message: "Please enter role name" },
            { min: 2, message: "Role name must be at least 2 characters" },
            { max: 50, message: "Role name must not exceed 50 characters" },
          ]}
        >
          <Input placeholder="Enter new role name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { max: 200, message: "Description must not exceed 200 characters" },
          ]}
        >
          <Input.TextArea
            placeholder="Enter role description (optional)"
            rows={3}
          />
        </Form.Item>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
          <div className="text-sm text-yellow-800">
            <strong>Note:</strong> The cloned role will be created as a custom
            role with the same permissions as the original. You can modify its
            permissions after creation.
          </div>
        </div>
      </Form>
    </Modal>
  );
};
