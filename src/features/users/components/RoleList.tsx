import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Input,
  notification,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import { ProtectedComponent } from "../../../components/common/ProtectedComponent";
import {
  deleteRoleApi,
  getRolesApi,
  type Role,
} from "../../../services/user.services";
import { RoleCloneModal } from "./RoleCloneModal";

interface RoleListProps {
  onCreateRole: () => void;
  onEditRole: (role: Role) => void;
  onManagePermissions: (role: Role) => void;
}

export const RoleList: React.FC<RoleListProps> = ({
  onCreateRole,
  onEditRole,
  onManagePermissions,
}) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showCloneModal, setShowCloneModal] = useState(false);
  const [selectedRoleForClone, setSelectedRoleForClone] = useState<Role | null>(
    null
  );
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async (search?: string, page = 1, limit = 20) => {
    try {
      setLoading(true);
      const response = await getRolesApi({ search, page, limit });

      if (response.success) {
        const rolesData = response.data || [];
        setRoles(rolesData);

        if (response.pagination) {
          setPagination({
            current: response.pagination.page || 1,
            pageSize: response.pagination.limit || 20,
            total: response.pagination.total || 0,
          });
        }
      } else {
        notification.error({
          message: "Error",
          description: response.message || "Failed to fetch roles",
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to fetch roles",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchRoles(value, 1);
  };

  const handleDelete = async (role: Role) => {
    try {
      const response = await deleteRoleApi(role.id);
      if (response.success) {
        notification.success({
          message: "Success",
          description: "Role deleted successfully",
        });
        fetchRoles(searchText);
      } else {
        notification.error({
          message: "Error",
          description: response.message || "Failed to delete role",
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to delete role",
      });
    }
  };

  const handleTableChange = (paginationInfo: any) => {
    fetchRoles(searchText, paginationInfo.current, paginationInfo.pageSize);
  };

  const handleCloneRole = (role: Role) => {
    setSelectedRoleForClone(role);
    setShowCloneModal(true);
  };

  const handleCloneSuccess = () => {
    setShowCloneModal(false);
    setSelectedRoleForClone(null);
    fetchRoles(searchText);
  };

  const handleCloneCancel = () => {
    setShowCloneModal(false);
    setSelectedRoleForClone(null);
  };

  const columns = [
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: Role) => (
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{name}</span>
            {record.isSystemRole && (
              <Tag size="small" color="blue">
                System
              </Tag>
            )}
          </div>
          {record.description && (
            <div className="text-sm text-gray-500 mt-1">
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Permissions",
      dataIndex: "permissions",
      key: "permissions",
      render: (permissions: unknown[]) => (
        <div className="flex items-center gap-2">
          <Badge count={permissions?.length || 0} showZero color="green" />
          <span className="text-sm text-gray-500">permissions</span>
        </div>
      ),
    },
    {
      title: "Users Assigned",
      key: "userCount",
      render: (record: Role) => (
        <div className="flex items-center gap-2">
          <TeamOutlined className="text-gray-400" />
          <span>{record.users.length || 0} users</span>
        </div>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) =>
        createdAt ? new Date(createdAt).toLocaleDateString() : "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Role) => (
        <Space size="small">
          <ProtectedComponent permission="roles.update">
            <Tooltip title="Edit Role">
              <Button
                type="text"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onEditRole(record)}
              />
            </Tooltip>
          </ProtectedComponent>
          <ProtectedComponent permission="roles.update">
            <Tooltip title="Manage Permissions">
              <Button
                type="text"
                icon={<SettingOutlined />}
                size="small"
                onClick={() => onManagePermissions(record)}
              />
            </Tooltip>
          </ProtectedComponent>
          <ProtectedComponent permission="roles.create">
            <Tooltip title="Clone Role">
              <Button
                type="text"
                icon={<CopyOutlined />}
                size="small"
                onClick={() => handleCloneRole(record)}
              />
            </Tooltip>
          </ProtectedComponent>
          {!record.isSystemRole && (
            <ProtectedComponent permission="roles.delete">
              <Popconfirm
                title="Delete Role"
                description={`Are you sure you want to delete the role "${record.name}"?`}
                onConfirm={() => handleDelete(record)}
                okText="Yes"
                cancelText="No"
                disabled={record?.users?.length > 0}
              >
                <Tooltip
                  title={
                    record?.users?.length > 0
                      ? "Cannot delete role with assigned users"
                      : "Delete Role"
                  }
                >
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                    disabled={record?.users?.length > 0}
                  />
                </Tooltip>
              </Popconfirm>
            </ProtectedComponent>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Role Management</h1>
          <p className="text-gray-600 text-sm mt-1">
            Create and manage roles with specific permissions for your
            organization
          </p>
        </div>
        <ProtectedComponent permission="roles.create">
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreateRole}>
            Create Role
          </Button>
        </ProtectedComponent>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          placeholder="Search roles..."
          prefix={<SearchOutlined />}
          className="sm:w-80"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={(e) => handleSearch(e.currentTarget.value)}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={roles}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} roles`,
        }}
        onChange={handleTableChange}
        size="small"
      />

      <RoleCloneModal
        visible={showCloneModal}
        role={selectedRoleForClone}
        onCancel={handleCloneCancel}
        onSuccess={handleCloneSuccess}
      />
    </div>
  );
};
