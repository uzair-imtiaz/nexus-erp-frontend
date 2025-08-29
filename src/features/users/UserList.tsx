import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Table,
  Space,
  Tag,
  Popconfirm,
  notification,
  Select,
  Tooltip,
  Switch,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  UserAddOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { ProtectedComponent } from "../../components/common/ProtectedComponent";
import {
  getUsersApi,
  activateUserApi,
  deactivateUserApi,
  getRolesApi,
  type User,
  type Role,
  type UserFilters,
} from "../../services/user.services";

interface UserListProps {
  onCreateUser: () => void;
  onEditUser: (user: User) => void;
  onViewUser: (user: User) => void;
  onManageRoles: (user: User) => void;
  onInviteUser?: () => void;
}

export const UserList: React.FC<UserListProps> = ({
  onCreateUser,
  onEditUser,
  onViewUser,
  onManageRoles,
  onInviteUser,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<UserFilters>({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async (newFilters: UserFilters = {}) => {
    try {
      setLoading(true);
      const queryFilters = { ...filters, ...newFilters };
      const response = await getUsersApi(queryFilters);

      if (response.success) {
        setUsers(response.data || []);
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
          description: response.message || "Failed to fetch users",
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to fetch users",
      });
    } finally {
      setLoading(false);
    }
  };
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

  const handleStatusToggle = async (user: User, checked: boolean) => {
    try {
      const response = checked
        ? await activateUserApi(user.id)
        : await deactivateUserApi(user.id);

      if (response.success) {
        notification.success({
          message: "Success",
          description: `User ${
            checked ? "activated" : "deactivated"
          } successfully`,
        });
        fetchUsers();
      } else {
        notification.error({
          message: "Error",
          description: response.message || "Failed to update user status",
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to update user status",
      });
    }
  };

  const handleSearch = (value: string) => {
    const newFilters = { ...filters, search: value, page: 1 };
    setFilters(newFilters);
    fetchUsers(newFilters);
  };

  const handleRoleFilter = (roleId: string) => {
    const newFilters = { ...filters, role_id: roleId || undefined, page: 1 };
    setFilters(newFilters);
    fetchUsers(newFilters);
  };

  const handleStatusFilter = (isActive: boolean | undefined) => {
    const newFilters = { ...filters, is_active: isActive, page: 1 };
    setFilters(newFilters);
    fetchUsers(newFilters);
  };

  const handleTableChange = (paginationInfo: any) => {
    const newFilters = {
      ...filters,
      page: paginationInfo.current,
      limit: paginationInfo.pageSize,
    };
    setFilters(newFilters);
    fetchUsers(newFilters);
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      render: (record: User) => (
        <div>
          <div className="font-medium">
            {record.firstName} {record.lastName}
          </div>
          <div className="text-sm text-gray-500">{record.email}</div>
        </div>
      ),
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (roles: Role[]) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {roles?.length > 0 ? (
            roles.map((role) => (
              <Tag
                key={role.id}
                color={role.isSystemRole ? "blue" : "green"}
                className="text-xs"
                title={role.description || role.name}
              >
                {role.name}
              </Tag>
            ))
          ) : (
            <span className="text-gray-400 text-xs">No roles assigned</span>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, record: User) => (
        <ProtectedComponent permission="users.update">
          <Switch
            checked={isActive}
            onChange={(checked) => handleStatusToggle(record, checked)}
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            size="small"
          />
        </ProtectedComponent>
      ),
    },
    {
      title: "Last Login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (lastLogin: string) =>
        lastLogin ? new Date(lastLogin).toLocaleDateString() : "Never",
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: User) => (
        <Space size="small">
          <ProtectedComponent permission="users.read">
            <Tooltip title="View Details">
              <Button
                type="text"
                icon={<EyeOutlined />}
                size="small"
                onClick={() => onViewUser(record)}
              />
            </Tooltip>
          </ProtectedComponent>
          <ProtectedComponent permission="users.update">
            <Tooltip title="Edit User">
              <Button
                type="text"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onEditUser(record)}
              />
            </Tooltip>
          </ProtectedComponent>
          <ProtectedComponent permission="roles.assign">
            <Tooltip title="Manage Roles">
              <Button
                type="text"
                icon={<SettingOutlined />}
                size="small"
                onClick={() => onManageRoles(record)}
              />
            </Tooltip>
          </ProtectedComponent>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage user accounts, roles, and permissions for your organization
          </p>
        </div>
        <Space wrap>
          <ProtectedComponent permission="users.create">
            <Button
              type="default"
              icon={<UserAddOutlined />}
              onClick={onInviteUser}
            >
              Invite User
            </Button>
          </ProtectedComponent>
          <ProtectedComponent permission="users.create">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onCreateUser}
            >
              Add User
            </Button>
          </ProtectedComponent>
        </Space>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Input
          placeholder="Search by name or email..."
          prefix={<SearchOutlined />}
          className="sm:w-80"
          onPressEnter={(e) => handleSearch(e.currentTarget.value)}
          allowClear
        />
        <Select
          placeholder="Filter by role"
          className="sm:w-48"
          allowClear
          onChange={handleRoleFilter}
          showSearch
          optionFilterProp="children"
        >
          {roles.map((role) => (
            <Select.Option key={role.id} value={role.id}>
              <div className="flex items-center gap-2">
                {role.name}
                {role.isSystemRole && (
                  <span className="text-xs text-blue-500">(System)</span>
                )}
              </div>
            </Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Filter by status"
          className="sm:w-36"
          allowClear
          onChange={handleStatusFilter}
        >
          <Select.Option value={true}>
            <span className="text-green-600">Active</span>
          </Select.Option>
          <Select.Option value={false}>
            <span className="text-red-600">Inactive</span>
          </Select.Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} users`,
        }}
        onChange={handleTableChange}
        size="small"
        // className="bg-white rounded-lg shadow"
      />
    </div>
  );
};
