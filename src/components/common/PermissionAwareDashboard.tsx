import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { usePermissions } from "../../contexts/PermissionContext";
import ProtectedComponent from "./ProtectedComponent";

interface DashboardWidget {
  key: string;
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  precision?: number;
  loading?: boolean;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  span?: number;
}

interface PermissionAwareDashboardProps {
  widgets: DashboardWidget[];
  title?: string;
  extra?: React.ReactNode;
}

/**
 * PermissionAwareDashboard - A dashboard component that shows widgets based on user permissions
 *
 * @param widgets - Array of dashboard widgets with permission requirements
 * @param title - Dashboard title
 * @param extra - Extra content for dashboard header
 */
export const PermissionAwareDashboard: React.FC<
  PermissionAwareDashboardProps
> = ({ widgets, title, extra }) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole } =
    usePermissions();

  const visibleWidgets = widgets.filter((widget) => {
    // If no permission requirements, show the widget
    if (!widget.permission && !widget.permissions?.length) {
      return true;
    }

    // Super Admin bypass
    if (hasRole("Super Admin") || hasPermission("*")) {
      return true;
    }

    // Check single permission
    if (widget.permission) {
      return hasPermission(widget.permission);
    }

    // Check multiple permissions
    if (widget.permissions?.length) {
      return widget.requireAll
        ? hasAllPermissions(widget.permissions)
        : hasAnyPermission(widget.permissions);
    }

    return true;
  });

  if (visibleWidgets.length === 0) {
    return (
      <Card title={title} extra={extra}>
        <div style={{ textAlign: "center", padding: "40px 0", color: "#999" }}>
          No dashboard data available for your current permissions.
        </div>
      </Card>
    );
  }

  return (
    <Card title={title} extra={extra}>
      <Row gutter={[16, 16]}>
        {visibleWidgets.map((widget) => (
          <Col key={widget.key} span={widget.span || 6}>
            <ProtectedComponent
              permission={widget.permission}
              permissions={widget.permissions}
              requireAll={widget.requireAll}
              showFallback={false}
            >
              <Card>
                <Statistic
                  title={widget.title}
                  value={widget.value}
                  prefix={widget.prefix}
                  suffix={widget.suffix}
                  precision={widget.precision}
                  loading={widget.loading}
                />
              </Card>
            </ProtectedComponent>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default PermissionAwareDashboard;
