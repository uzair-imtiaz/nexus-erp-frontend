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

export const UserManagement: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showInvitation, setShowInvitation] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showRoleManagement, setShowRoleManagement] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

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
    {
      key: "dashboard",
      label: (
        <span>
          <DashboardOutlined />
          Dashboard
        </span>
      ),
      children: <UserManagementDashboard />,
    },
    {
      key: "users",
      label: (
        <span>
          <UserOutlined />
          Users
        </span>
      ),
      children: (
        <UserList
          key={refreshKey}
          onCreateUser={handleCreateUser}
          onEditUser={handleEditUser}
          onViewUser={handleViewUser}
          onManageRoles={handleManageRoles}
          onInviteUser={handleInviteUser}
        />
      ),
    },
    {
      key: "roles",
      label: (
        <span>
          <TeamOutlined />
          Roles & Permissions
        </span>
      ),
      children: <RoleManagement key={refreshKey} />,
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="dashboard" items={tabItems} className="px-6" />

      {showCreateForm && (
        <UserForm
          visible={showCreateForm || showEditForm}
          user={showEditForm ? selectedUser : null}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      )}

      {showInvitation && (
        <UserInvitation
          visible={showInvitation}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      )}

      {showDetail && (
        <UserDetail
          visible={showDetail}
          user={selectedUser}
          onCancel={handleCancel}
          onEdit={handleEditUser}
          onManageRoles={handleManageRoles}
        />
      )}

      {showRoleManagement && (
        <UserRoleManagement
          visible={showRoleManagement}
          user={selectedUser}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default UserManagement;
