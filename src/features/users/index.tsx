import React, { useState } from "react";
import { Tabs } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { UserList } from "./UserList";
import { UserForm } from "./UserForm";
import { UserInvitation } from "./UserInvitation";
import { UserDetail } from "./UserDetail";
import { UserRoleManagement } from "./UserRoleManagement";
import { UserManagementDashboard } from "./UserManagementDashboard";
import { RoleManagement } from "./RoleManagement";
import { type User } from "../../services/user.services";
import ProtectedComponent from "../../components/common/ProtectedComponent";
import { usePermissions } from "../../contexts/PermissionContext";

export const UserManagement: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showRoleManagement, setShowRoleManagement] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { hasPermission } = usePermissions();

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowCreateForm(true);
  };

  const handleInviteUser = () => {
    setSelectedUser(null);
    setShowInvitation(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditForm(true);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowDetail(true);
  };

  const handleManageRoles = (user: User) => {
    setSelectedUser(user);
    setShowRoleManagement(true);
  };

  const handleSuccess = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setShowInvitation(false);
    setShowDetail(false);
    setShowRoleManagement(false);
    setSelectedUser(null);
    setRefreshKey((prev) => prev + 1); // Trigger refresh
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setShowInvitation(false);
    setShowDetail(false);
    setShowRoleManagement(false);
    setSelectedUser(null);
  };

  const tabItems = [
    // Dashboard tab - visible to users with users.read permission
    ...(hasPermission("users.read")
      ? [
          {
            key: "dashboard",
            label: (
              <span>
                <DashboardOutlined />
                Dashboard
              </span>
            ),
            children: (
              <ProtectedComponent permission="users.read">
                <UserManagementDashboard />
              </ProtectedComponent>
            ),
          },
        ]
      : []),
    // Users tab - visible to users with users.read permission
    ...(hasPermission("users.read")
      ? [
          {
            key: "users",
            label: (
              <span>
                <UserOutlined />
                Users
              </span>
            ),
            children: (
              <ProtectedComponent permission="users.read">
                <UserList
                  key={refreshKey}
                  onCreateUser={handleCreateUser}
                  onEditUser={handleEditUser}
                  onViewUser={handleViewUser}
                  onManageRoles={handleManageRoles}
                  onInviteUser={handleInviteUser}
                />
              </ProtectedComponent>
            ),
          },
        ]
      : []),
    // Roles tab - visible to users with roles.read permission
    ...(hasPermission("roles.list")
      ? [
          {
            key: "roles",
            label: (
              <span>
                <TeamOutlined />
                Roles & Permissions
              </span>
            ),
            children: (
              <ProtectedComponent permission="roles.list">
                <RoleManagement key={refreshKey} />
              </ProtectedComponent>
            ),
          },
        ]
      : []),
  ];

  // If user has no permissions for any tabs, show access denied
  if (tabItems.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <h3>Access Denied</h3>
        <p>You don't have permission to access user management features.</p>
      </div>
    );
  }

  return (
    <div>
      <Tabs
        defaultActiveKey={tabItems[0]?.key || "dashboard"}
        items={tabItems}
        className="px-6"
      />

      {showCreateForm && (
        <ProtectedComponent permission="users.create">
          <UserForm
            visible={showCreateForm || showEditForm}
            user={showEditForm ? selectedUser : null}
            onCancel={handleCancel}
            onSuccess={handleSuccess}
          />
        </ProtectedComponent>
      )}

      {showInvitation && (
        <ProtectedComponent permission="users.create">
          <UserInvitation
            visible={showInvitation}
            onCancel={handleCancel}
            onSuccess={handleSuccess}
          />
        </ProtectedComponent>
      )}

      {showDetail && (
        <ProtectedComponent permission="users.read">
          <UserDetail
            visible={showDetail}
            user={selectedUser}
            onCancel={handleCancel}
            onEdit={handleEditUser}
            onManageRoles={handleManageRoles}
          />
        </ProtectedComponent>
      )}

      {showRoleManagement && (
        <ProtectedComponent permission="users.update">
          <UserRoleManagement
            visible={showRoleManagement}
            user={selectedUser}
            onCancel={handleCancel}
            onSuccess={handleSuccess}
          />
        </ProtectedComponent>
      )}
    </div>
  );
};

export default UserManagement;
