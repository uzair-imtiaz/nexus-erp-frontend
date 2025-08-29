import {
  EyeOutlined,
  SafetyOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Empty,
  notification,
  Progress,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  getRolesApi,
  type Role,
  type RoleUsage,
} from "../../../services/user.services";

export const RoleUsageDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [stats, setStats] = useState({
    totalRoles: 0,
    systemRoles: 0,
    customRoles: 0,
    totalUsers: 0,
    activeRoles: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all roles
        const rolesResponse = await getRolesApi({ limit: 1000 });
        if (rolesResponse.success) {
          const rolesData: Role[] = rolesResponse.data || [];
          setRoles(rolesData);

          // Calculate statistics
          const totalUsers = rolesData.reduce(
            (sum, role) => sum + role.users.length,
            0
          );
          const activeRoles = rolesData.filter(
            (role) => role.users.length > 0
          ).length;

          const systemRolesLength = rolesData.filter(
            (r: Role) => r.isSystemRole
          ).length;

          setStats({
            totalRoles: rolesData.length,
            systemRoles: systemRolesLength,
            customRoles: rolesData.length - systemRolesLength,
            totalUsers: totalUsers,
            activeRoles: activeRoles,
          });
        } else {
          notification.error({
            message: "Error",
            description: rolesResponse.message,
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleViewUsers = (roles: Role) => {
    // TODO: Implement view users functionality
    console.log("View users for role:", roles.users);
  };

  const getUsagePercentage = (userCount: number) => {
    if (stats.totalUsers === 0) return 0;
    return Math.round((userCount / stats.totalUsers) * 100);
  };

  const columns = [
    {
      title: "Role Name",
      key: "name",
      render: (role: Role) => {
        return (
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{role.name}</span>
              {role?.isSystemRole && <Tag color="blue">System</Tag>}
            </div>
            {role?.description && (
              <div className="text-sm text-gray-500 mt-1">
                {role.description}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Users Assigned",
      key: "userCount",
      render: (role: Role) => (
        <div className="flex items-center gap-2">
          <TeamOutlined className="text-gray-400" />
          <span className="font-medium">{role.users.length}</span>
        </div>
      ),
    },
    {
      title: "Usage %",
      key: "percentage",
      render: (record: RoleUsage) => {
        const percentage = getUsagePercentage(record.users.length);
        return (
          <Progress
            percent={percentage}
            size="small"
            status={percentage > 0 ? "active" : "normal"}
            format={(percent) => `${percent}%`}
          />
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Role) => (
        <Space size="small">
          <Tooltip title="View Assigned Users">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewUsers(record)}
              disabled={record.users.length === 0}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Role Usage Dashboard</h1>
        <p className="text-gray-600 text-sm mt-1">
          Overview of role assignments and usage across your organization
        </p>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Roles"
              value={stats.totalRoles}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="System Roles"
              value={stats.systemRoles}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Custom Roles"
              value={stats.customRoles}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Roles"
              value={stats.activeRoles}
              suffix={`/ ${stats.totalRoles}`}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Role Usage Details" className="mb-6">
        {stats.activeRoles > 0 ? (
          <Table
            columns={columns}
            dataSource={roles}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} roles`,
            }}
            size="small"
          />
        ) : (
          <Empty
            description="No role usage data available"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Role Distribution" size="small">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>System Roles</span>
                <div className="flex items-center gap-2">
                  <Progress
                    percent={
                      stats.totalRoles > 0
                        ? Math.round(
                            (stats.systemRoles / stats.totalRoles) * 100
                          )
                        : 0
                    }
                    size="small"
                    showInfo={false}
                    strokeColor="#52c41a"
                  />
                  <span className="text-sm font-medium">
                    {stats.systemRoles}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Custom Roles</span>
                <div className="flex items-center gap-2">
                  <Progress
                    percent={
                      stats.totalRoles > 0
                        ? Math.round(
                            (stats.customRoles / stats.totalRoles) * 100
                          )
                        : 0
                    }
                    size="small"
                    showInfo={false}
                    strokeColor="#722ed1"
                  />
                  <span className="text-sm font-medium">
                    {stats.customRoles}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Usage Summary" size="small">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Roles in Use</span>
                <div className="flex items-center gap-2">
                  <Progress
                    percent={
                      stats.totalRoles > 0
                        ? Math.round(
                            (stats.activeRoles / stats.totalRoles) * 100
                          )
                        : 0
                    }
                    size="small"
                    showInfo={false}
                    strokeColor="#fa8c16"
                  />
                  <span className="text-sm font-medium">
                    {stats.activeRoles}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Unused Roles</span>
                <div className="flex items-center gap-2">
                  <Progress
                    percent={
                      stats.totalRoles > 0
                        ? Math.round(
                            ((stats.totalRoles - stats.activeRoles) /
                              stats.totalRoles) *
                              100
                          )
                        : 0
                    }
                    size="small"
                    showInfo={false}
                    strokeColor="#f5222d"
                  />
                  <span className="text-sm font-medium">
                    {stats.totalRoles - stats.activeRoles}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
