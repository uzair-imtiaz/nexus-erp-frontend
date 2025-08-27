import { DashboardOutlined, TeamOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import React, { useState } from "react";
import { type Role } from "../../services/user.services";
import { PermissionAssignment } from "./components/PermissionAssignment";
import { RoleForm } from "./components/RoleForm";
import { RoleList } from "./components/RoleList";
import { RoleUsageDashboard } from "./components/RoleUsageDashboard";

export const RoleManagement: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPermissionAssignment, setShowPermissionAssignment] =
    useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateRole = () => {
    setSelectedRole(null);
    setShowCreateForm(true);
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setShowEditForm(true);
  };

  const handleManagePermissions = (role: Role) => {
    setSelectedRole(role);
    setShowPermissionAssignment(true);
  };

  const handleSuccess = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setShowPermissionAssignment(false);
    setSelectedRole(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setShowPermissionAssignment(false);
    setSelectedRole(null);
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
      children: <RoleUsageDashboard key={refreshKey} />,
    },
    {
      key: "roles",
      label: (
        <span>
          <TeamOutlined />
          Roles
        </span>
      ),
      children: (
        <RoleList
          key={refreshKey}
          onCreateRole={handleCreateRole}
          onEditRole={handleEditRole}
          onManagePermissions={handleManagePermissions}
        />
      ),
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="dashboard" items={tabItems} className="px-6" />

      {(showCreateForm || showEditForm) && (
        <RoleForm
          visible={showCreateForm || showEditForm}
          role={showEditForm ? selectedRole : null}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      )}

      {showPermissionAssignment && (
        <PermissionAssignment
          visible={showPermissionAssignment}
          role={selectedRole}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

export default RoleManagement;
