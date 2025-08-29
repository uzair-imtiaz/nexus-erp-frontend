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
  Collapse,
  Badge,
} from "antd";
import {
  getPermissionsApi,
  assignPermissionsApi,
  removePermissionsApi,
  type Role,
  type Permission,
} from "../../../services/user.services";

interface PermissionAssignmentProps {
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

export const PermissionAssignment: React.FC<PermissionAssignmentProps> = ({
  visible,
  role,
  onCancel,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    if (visible && role) {
      fetchPermissions();
      setTargetKeys(role.permissions?.map((permission) => permission.id) || []);
    }
  }, [visible, role]);

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

  const handleSave = async () => {
    if (!role) return;

    try {
      setLoading(true);

      const currentPermissionIds = role.permissions?.map((p) => p.id) || [];
      const permissionsToAdd = targetKeys.filter(
        (permissionId) => !currentPermissionIds.includes(permissionId)
      );
      const permissionsToRemove = currentPermissionIds.filter(
        (permissionId) => !targetKeys.includes(permissionId)
      );

      // Add new permissions
      if (permissionsToAdd.length > 0) {
        const response = await assignPermissionsApi(role.id, permissionsToAdd);
        if (!response.success) {
          throw new Error(`Failed to assign permissions: ${response.message}`);
        }
      }

      // Remove old permissions
      if (permissionsToRemove.length > 0) {
        const response = await removePermissionsApi(
          role.id,
          permissionsToRemove
        );
        if (!response.success) {
          throw new Error(`Failed to remove permissions: ${response.message}`);
        }
      }

      notification.success({
        message: "Success",
        description: "Role permissions updated successfully",
      });

      onSuccess();
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to update role permissions",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!role) return null;

  const groupPermissionsByResource = (permissions: Permission[]) => {
    return permissions.reduce((acc, permission) => {
      if (!acc[permission.resource]) {
        acc[permission.resource] = [];
      }
      acc[permission.resource].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
  };

  const permissionGroups = groupPermissionsByResource(permissions);

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
          <Tag color="blue" size="small">
            {item.resource}
          </Tag>
          <span className="font-medium">{item.action}</span>
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

  const getResourceStats = () => {
    const stats: Record<string, { total: number; assigned: number }> = {};

    Object.keys(permissionGroups).forEach((resource) => {
      const resourcePermissions = permissionGroups[resource];
      const assignedCount = resourcePermissions.filter((p) =>
        targetKeys.includes(p.id)
      ).length;

      stats[resource] = {
        total: resourcePermissions.length,
        assigned: assignedCount,
      };
    });

    return stats;
  };

  const resourceStats = getResourceStats();

  return (
    <Modal
      title={`Manage Permissions - ${role.name}`}
      open={visible}
      onCancel={onCancel}
      width={1000}
      footer={
        <Space>
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            type="primary"
            loading={loading}
            onClick={handleSave}
            disabled={role.isSystemRole}
          >
            Save Changes
          </Button>
        </Space>
      }
    >
      <div className="space-y-4">
        <Card size="small">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">
                <strong>Role:</strong> {role.name}
                {role.isSystemRole && (
                  <Tag color="blue" size="small" className="ml-2">
                    System Role
                  </Tag>
                )}
              </div>
              {role.description && (
                <div className="text-sm text-gray-500 mt-1">
                  {role.description}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-blue-600">
                {targetKeys.length}
              </div>
              <div className="text-xs text-gray-500">permissions assigned</div>
            </div>
          </div>
        </Card>

        {role.isSystemRole && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <div className="text-sm text-blue-800">
              <strong>System Role:</strong> This is a system-defined role. You
              can view its permissions but cannot modify them.
            </div>
          </div>
        )}

        <Divider orientation="left">Permission Overview by Module</Divider>

        <Collapse size="small" className="mb-4">
          <Collapse.Panel header="Permission Summary by Resource" key="summary">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(resourceStats).map(([resource, stats]) => (
                <Card key={resource} size="small" className="text-center">
                  <div className="font-medium capitalize">{resource}</div>
                  <div className="mt-2">
                    <Badge
                      count={`${stats.assigned}/${stats.total}`}
                      color={stats.assigned === stats.total ? "green" : "blue"}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </Collapse.Panel>
        </Collapse>

        <Divider orientation="left">Permission Assignment</Divider>

        <div className="text-sm text-gray-600 mb-4">
          Move permissions between the lists to assign or remove them from the
          role. Permissions are organized by resource (module) and action.
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
            width: 450,
            height: 500,
          }}
          showSearch
          filterOption={filterOption}
          disabled={role.isSystemRole}
        />

        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
          <div className="text-sm text-yellow-800">
            <strong>Important:</strong> Permission changes will affect all users
            assigned to this role.
          </div>
          <div className="text-xs text-yellow-700 mt-1">
            • Changes take effect immediately after saving • Users may need to
            refresh their session to see updated permissions • Consider the
            impact on existing workflows before removing permissions • Test
            permission changes in a non-production environment first
          </div>
        </div>
      </div>
    </Modal>
  );
};
