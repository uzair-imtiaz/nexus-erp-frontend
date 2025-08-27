import React, { useEffect, useState } from "react";
import {
  Modal,
  Transfer,
  Button,
  Space,
  notification,
  Card,
  Tag,
  Divider,
} from "antd";
import {
  getRolesApi,
  assignRoleApi,
  removeRoleApi,
  type User,
  type Role,
} from "../../services/user.services";

interface UserRoleManagementProps {
  visible: boolean;
  user: User | null;
  onCancel: () => void;
  onSuccess: () => void;
}

interface TransferItem {
  key: string;
  title: string;
  description?: string;
  isSystemRole: boolean;
}

export const UserRoleManagement: React.FC<UserRoleManagementProps> = ({
  visible,
  user,
  onCancel,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    if (visible && user) {
      fetchRoles();
      setTargetKeys(user.roles?.map((role) => role.id) || []);
    }
  }, [visible, user]);

  const fetchRoles = async () => {
    try {
      const response = await getRolesApi();
      if (response.success) {
        setRoles(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const currentRoleIds = user.roles?.map((role) => role.id) || [];
      const rolesToAdd = targetKeys.filter(
        (roleId) => !currentRoleIds.includes(roleId)
      );
      const rolesToRemove = currentRoleIds.filter(
        (roleId) => !targetKeys.includes(roleId)
      );

      // Add new roles
      for (const roleId of rolesToAdd) {
        const response = await assignRoleApi(user.id, roleId);
        if (!response.success) {
          throw new Error(`Failed to assign role: ${response.message}`);
        }
      }

      // Remove old roles
      for (const roleId of rolesToRemove) {
        const response = await removeRoleApi(user.id, roleId);
        if (!response.success) {
          throw new Error(`Failed to remove role: ${response.message}`);
        }
      }

      notification.success({
        message: "Success",
        description: "User roles updated successfully",
      });

      onSuccess();
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to update user roles",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const dataSource: TransferItem[] = roles.map((role) => ({
    key: role.id,
    title: role.name,
    description: role.description,
    isSystemRole: role.isSystemRole,
  }));

  const renderItem = (item: TransferItem) => {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span>{item.title}</span>
          {item.isSystemRole && (
            <Tag size="small" color="blue">
              System
            </Tag>
          )}
        </div>
        {item.description && (
          <span className="text-xs text-gray-500 mt-1">{item.description}</span>
        )}
      </div>
    );
  };

  return (
    <Modal
      title={`Manage Roles - ${user.firstName} ${user.lastName}`}
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={
        <Space>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" loading={loading} onClick={handleSave}>
            Save Changes
          </Button>
        </Space>
      }
    >
      <div className="space-y-4">
        <Card size="small">
          <div className="text-sm text-gray-600">
            <strong>User:</strong> {user.firstName} {user.lastName} (
            {user.email})
          </div>
          <div className="text-sm text-gray-600 mt-1">
            <strong>Current Status:</strong>{" "}
            <Tag color={user.isActive ? "green" : "red"} size="small">
              {user.isActive ? "Active" : "Inactive"}
            </Tag>
          </div>
        </Card>

        <Divider orientation="left">Role Assignment</Divider>

        <div className="text-sm text-gray-600 mb-4">
          Move roles between the lists to assign or remove them from the user.
          System roles are marked with a blue tag.
        </div>

        <Transfer
          dataSource={dataSource}
          titles={["Available Roles", "Assigned Roles"]}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={setTargetKeys}
          onSelectChange={(sourceSelectedKeys, targetSelectedKeys) => {
            setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
          }}
          render={renderItem}
          listStyle={{
            width: 350,
            height: 400,
          }}
          showSearch
          filterOption={(inputValue, item) =>
            item.title.toLowerCase().includes(inputValue.toLowerCase()) ||
            (item.description &&
              item.description.toLowerCase().includes(inputValue.toLowerCase()))
          }
        />

        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
          <div className="text-sm text-yellow-800">
            <strong>Important:</strong> Role changes will take effect
            immediately after saving. The user may need to refresh their session
            to see updated permissions.
          </div>
          <div className="text-xs text-yellow-700 mt-1">
            • System roles cannot be modified but can be assigned/removed •
            Removing all roles will restrict user access significantly •
            Consider the principle of least privilege when assigning roles
          </div>
        </div>
      </div>
    </Modal>
  );
};
