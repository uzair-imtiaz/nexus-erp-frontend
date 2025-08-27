import React, { useEffect, useState } from "react";
import {
  Modal,
  Descriptions,
  Tag,
  Space,
  Button,
  Divider,
  List,
  Card,
  Spin,
  notification,
} from "antd";
import {
  EditOutlined,
  SettingOutlined,
  UserOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import {
  getUserPermissionsApi,
  type User,
  type Permission,
} from "../../services/user.services";
import { ProtectedComponent } from "../../components/common/ProtectedComponent";

interface UserDetailProps {
  visible: boolean;
  user: User | null;
  onCancel: () => void;
  onEdit: (user: User) => void;
  onManageRoles: (user: User) => void;
}

export const UserDetail: React.FC<UserDetailProps> = ({
  visible,
  user,
  onCancel,
  onEdit,
  onManageRoles,
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  useEffect(() => {
    if (visible && user) {
      fetchUserPermissions();
    }
  }, [visible, user]);

  const fetchUserPermissions = async () => {
    if (!user) return;

    try {
      setLoadingPermissions(true);
      const response = await getUserPermissionsApi(user.id);
      if (response.success) {
        const data: string[] = response.data || [];
        const formattedPermissions: Permission[] = data.map((p, idx) => {
          const [resource, action] = p.split(".");
          return {
            id: `${user.id}-${idx}`,
            resource,
            action,
            description: `${action} permission on ${resource}`,
          };
        });
        setPermissions(formattedPermissions);
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to fetch user permissions",
      });
    } finally {
      setLoadingPermissions(false);
    }
  };

  if (!user) return null;

  // Group permissions by resource
  const groupedPermissions = permissions.reduce((acc, permission) => {
    const resource = permission.resource;
    if (!acc[resource]) {
      acc[resource] = [];
    }
    acc[resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <Modal
      title={
        <Space>
          <UserOutlined />
          User Details
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={
        <Space>
          <Button onClick={onCancel}>Close</Button>
          <ProtectedComponent permission="users.update">
            <Button
              type="default"
              icon={<SettingOutlined />}
              onClick={() => onManageRoles(user)}
            >
              Manage Roles
            </Button>
          </ProtectedComponent>
          <ProtectedComponent permission="users.update">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => onEdit(user)}
            >
              Edit User
            </Button>
          </ProtectedComponent>
        </Space>
      }
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <Card title="Basic Information" size="small">
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Name">
              {user.firstName} {user.lastName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={user.isActive ? "green" : "red"}>
                {user.isActive ? "Active" : "Inactive"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Last Login">
              <Space>
                <ClockCircleOutlined />
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleString()
                  : "Never"}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Created">
              {new Date(user.createdAt).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Updated">
              {new Date(user.updatedAt).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Roles */}
        <Card title="Assigned Roles" size="small">
          <div className="flex flex-wrap gap-2">
            {user.roles?.length > 0 ? (
              user.roles.map((role) => (
                <Tag
                  key={role.id}
                  color={role.isSystemRole ? "blue" : "green"}
                  className="mb-2"
                >
                  <Space>
                    <SafetyOutlined />
                    {role.name}
                    {role.isSystemRole && (
                      <span className="text-xs">(System)</span>
                    )}
                  </Space>
                </Tag>
              ))
            ) : (
              <span className="text-gray-500">No roles assigned</span>
            )}
          </div>
          {user.roles?.some((role) => role.description) && (
            <div className="mt-4">
              <Divider orientation="left" orientationMargin="0">
                Role Descriptions
              </Divider>
              {user.roles
                .filter((role) => role.description)
                .map((role) => (
                  <div key={role.id} className="mb-2">
                    <strong>{role.name}:</strong> {role.description}
                  </div>
                ))}
            </div>
          )}
        </Card>

        {/* Permissions */}
        <Card
          title={
            <Space>
              <SafetyOutlined />
              Effective Permissions
              {!loadingPermissions && (
                <span className="text-sm font-normal text-gray-500">
                  ({Object.keys(groupedPermissions).length} modules)
                </span>
              )}
            </Space>
          }
          size="small"
          extra={loadingPermissions && <Spin size="small" />}
        >
          {loadingPermissions ? (
            <div className="text-center py-4">
              <Spin />
              <div className="mt-2">Loading permissions...</div>
            </div>
          ) : Object.keys(groupedPermissions).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(groupedPermissions).map(([resource, perms]) => (
                <div key={resource} className="border-l-2 border-blue-200 pl-3">
                  <h4 className="font-medium text-gray-700 mb-2 capitalize flex items-center gap-2">
                    {resource.replace(/([A-Z])/g, " $1").trim()}
                    <span className="text-xs text-gray-500">
                      ({perms.length} permissions)
                    </span>
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {perms.map((permission) => (
                      <Tag
                        key={permission.id}
                        className="text-xs"
                        color={
                          permission.action === "create"
                            ? "green"
                            : permission.action === "update"
                            ? "orange"
                            : permission.action === "delete"
                            ? "red"
                            : permission.action === "read"
                            ? "blue"
                            : "default"
                        }
                        title={permission.description}
                      >
                        {permission.action}
                      </Tag>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <SafetyOutlined className="text-2xl mb-2 block" />
              <div>No permissions found</div>
              <div className="text-xs mt-1">
                This user may not have any roles assigned or roles may not have
                permissions configured.
              </div>
            </div>
          )}
        </Card>
      </div>
    </Modal>
  );
};
