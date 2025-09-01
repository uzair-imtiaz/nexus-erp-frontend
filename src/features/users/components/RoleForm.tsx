import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Space,
  notification,
  Transfer,
  Card,
  Divider,
} from "antd";
import {
  createRoleApi,
  updateRoleApi,
  getPermissionsApi,
  type Role,
  type Permission,
  type CreateRoleData,
  type UpdateRoleData,
} from "../../../services/user.services";

interface RoleFormProps {
  visible: boolean;
  role: Role | null;
  onCancel: () => void;
  onSuccess: () => void;
}

interface TransferItem {
  key: string;
  title: string;
  description?: string;
  resource: string;
  action: string;
}

export const RoleForm: React.FC<RoleFormProps> = ({
  visible,
  role,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const isEditing = !!role;

  useEffect(() => {
    if (visible) {
      fetchPermissions();
      if (role) {
        form.setFieldsValue({
          name: role.name,
          description: role.description,
        });
        setTargetKeys(role.permissions?.map((p) => p.id) || []);
      } else {
        form.resetFields();
        setTargetKeys([]);
      }
    }
  }, [visible, role, form]);

  const fetchPermissions = async () => {
    try {
      const response = await getPermissionsApi();
      if (response.success) {
        setPermissions(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      const roleData = {
        name: values.name,
        description: values.description,
        permissionIds: targetKeys,
      };

      let response;
      if (isEditing && role) {
        response = await updateRoleApi(role.id, roleData as UpdateRoleData);
      } else {
        response = await createRoleApi(roleData as CreateRoleData);
      }

      if (response.success) {
        notification.success({
          message: "Success",
          description: `Role ${isEditing ? "updated" : "created"} successfully`,
        });
        onSuccess();
      } else {
        notification.error({
          message: "Error",
          description:
            response.message ||
            `Failed to ${isEditing ? "update" : "create"} role`,
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description:
          error.message || `Failed to ${isEditing ? "update" : "create"} role`,
      });
    } finally {
      setLoading(false);
    }
  };

  const groupPermissionsByResource = (permissions: Permission[]) => {
    return permissions.reduce((acc, permission) => {
      if (!acc[permission.resource]) {
        acc[permission.resource] = [];
      }
      acc[permission.resource].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
  };

  const dataSource: TransferItem[] = permissions.map((permission) => ({
    key: permission.id,
    title: `${permission.resource}.${permission.action}`,
    description: permission.description,
    resource: permission.resource,
    action: permission.action,
  }));

  const renderItem = (item: TransferItem) => {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-medium">{item.resource}</span>
          <span className="text-blue-600">{item.action}</span>
        </div>
        {item.description && (
          <span className="text-xs text-gray-500 mt-1">{item.description}</span>
        )}
      </div>
    );
  };

  const filterOption = (inputValue: string, item: TransferItem) => {
    return (
      item.title.toLowerCase().includes(inputValue.toLowerCase()) ||
      item.resource.toLowerCase().includes(inputValue.toLowerCase()) ||
      item.action.toLowerCase().includes(inputValue.toLowerCase()) ||
      (item.description &&
        item.description.toLowerCase().includes(inputValue.toLowerCase()))
    );
  };

  return (
    <Modal
      title={`${isEditing ? "Edit" : "Create"} Role`}
      open={visible}
      onCancel={onCancel}
      width={900}
      footer={
        <Space>
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            type="primary"
            loading={loading}
            onClick={() => form.submit()}
          >
            {isEditing ? "Update" : "Create"} Role
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-4"
      >
        <Card size="small" title="Basic Information">
          <Form.Item
            name="name"
            label="Role Name"
            rules={[
              { required: true, message: "Please enter role name" },
              { min: 2, message: "Role name must be at least 2 characters" },
              { max: 50, message: "Role name must not exceed 50 characters" },
            ]}
          >
            <Input
              placeholder="Enter role name (e.g., Manager, Accountant)"
              disabled={role?.isSystemRole}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                max: 200,
                message: "Description must not exceed 200 characters",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Enter role description (optional)"
              rows={3}
              disabled={role?.isSystemRole}
            />
          </Form.Item>
        </Card>

        <Divider orientation="left">Permission Assignment</Divider>

        <div className="text-sm text-gray-600 mb-4">
          Select permissions to assign to this role. Permissions are grouped by
          resource (module) and action.
        </div>

        <Transfer
          dataSource={dataSource}
          titles={["Available Permissions", "Assigned Permissions"]}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={setTargetKeys}
          onSelectChange={(sourceSelectedKeys, targetSelectedKeys) => {
            setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
          }}
          render={renderItem}
          listStyle={{
            width: 400,
            height: 400,
          }}
          showSearch
          filterOption={filterOption}
          disabled={role?.isSystemRole}
        />

        {role?.isSystemRole && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
            <div className="text-sm text-blue-800">
              <strong>System Role:</strong> This is a system-defined role. You
              can view its permissions but cannot modify them.
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
          <div className="text-sm text-yellow-800">
            <strong>Permission Guidelines:</strong>
          </div>
          <ul className="text-xs text-yellow-700 mt-1 ml-4 list-disc">
            <li>
              Follow the principle of least privilege - only assign necessary
              permissions
            </li>
            <li>
              Consider the user's job responsibilities when selecting
              permissions
            </li>
            <li>
              Review permissions regularly to ensure they remain appropriate
            </li>
            <li>
              Test role permissions before assigning to users in production
            </li>
          </ul>
        </div>
      </Form>
    </Modal>
  );
};
