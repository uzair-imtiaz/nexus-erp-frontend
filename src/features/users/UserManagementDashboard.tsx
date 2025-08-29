import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Tag, List, Avatar } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  getUsersApi,
  getRolesApi,
  type User,
  type Role,
} from "../../services/user.services";
import { ProtectedComponent } from "../../components/common/ProtectedComponent";

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalRoles: number;
  recentUsers: User[];
}

export const UserManagementDashboard: React.FC = () => {
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalRoles: 0,
    recentUsers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch users and roles in parallel
      const [usersResponse, rolesResponse] = await Promise.all([
        getUsersApi({ limit: 10 }),
        getRolesApi(),
      ]);

      if (usersResponse.success && rolesResponse.success) {
        const users = usersResponse.data || [];
        const roles = rolesResponse.data || [];

        const activeUsers = users.filter((user: User) => user.isActive);
        const inactiveUsers = users.filter((user: User) => !user.isActive);

        setStats({
          totalUsers: users.length,
          activeUsers: activeUsers.length,
          inactiveUsers: inactiveUsers.length,
          totalRoles: roles.length,
          recentUsers: users,
        });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedComponent permission="users.read">
      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">
            User Management Overview
          </h2>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={stats.totalUsers}
                  prefix={<TeamOutlined />}
                  loading={loading}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Active Users"
                  value={stats.activeUsers}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                  loading={loading}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Inactive Users"
                  value={stats.inactiveUsers}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: "#cf1322" }}
                  loading={loading}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Roles"
                  value={stats.totalRoles}
                  prefix={<SafetyOutlined />}
                  loading={loading}
                />
              </Card>
            </Col>
          </Row>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card
              title="Recent Users"
              size="small"
              extra={<ClockCircleOutlined className="text-gray-400" />}
            >
              <List
                loading={loading}
                dataSource={stats.recentUsers}
                renderItem={(user: User) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<UserOutlined />}
                          style={{
                            backgroundColor: user.isActive
                              ? "#87d068"
                              : "#f56a00",
                          }}
                        />
                      }
                      title={
                        <div className="flex items-center gap-2">
                          <span>
                            {user.firstName} {user.lastName}
                          </span>
                          <Tag
                            size="small"
                            color={user.isActive ? "green" : "red"}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </Tag>
                        </div>
                      }
                      description={
                        <div>
                          <div className="text-sm">{user.email}</div>
                          <div className="text-xs text-gray-500">
                            Created:{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                          {user.roles && user.roles.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {user.roles.slice(0, 2).map((role: Role) => (
                                <Tag
                                  key={role.id}
                                  size="small"
                                  color={role.isSystemRole ? "blue" : "green"}
                                >
                                  {role.name}
                                </Tag>
                              ))}
                              {user.roles.length > 2 && (
                                <Tag size="small">
                                  +{user.roles.length - 2} more
                                </Tag>
                              )}
                            </div>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Quick Actions" size="small">
              <div className="space-y-3">
                <ProtectedComponent permission="users.create">
                  <div className="p-3 border border-dashed border-gray-300 rounded text-center">
                    <UserOutlined className="text-2xl text-gray-400 mb-2 block" />
                    <div className="text-sm text-gray-600">
                      Use the "Add User" or "Invite User" buttons in the user
                      list to create new accounts
                    </div>
                  </div>
                </ProtectedComponent>

                <ProtectedComponent permission="roles.read">
                  <div className="p-3 border border-dashed border-gray-300 rounded text-center">
                    <SafetyOutlined className="text-2xl text-gray-400 mb-2 block" />
                    <div className="text-sm text-gray-600">
                      Manage roles and permissions to control user access levels
                    </div>
                  </div>
                </ProtectedComponent>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </ProtectedComponent>
  );
};
