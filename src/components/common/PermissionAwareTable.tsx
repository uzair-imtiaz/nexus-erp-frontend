import React, { useMemo } from "react";
import { Table, Button, Space, Tooltip } from "antd";
import type { TableProps, ColumnsType } from "antd/es/table";
import { usePermissions } from "../../contexts/PermissionContext";
import ProtectedComponent from "./ProtectedComponent";

interface PermissionColumn<T = any>
  extends NonNullable<ColumnsType<T>[number]> {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  hideForRoles?: string[];
  showForRoles?: string[];
}

interface PermissionAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  onClick: (record: any) => void;
  danger?: boolean;
  loading?: boolean;
  disabled?: (record: any) => boolean;
  tooltip?: string;
}

interface PermissionAwareTableProps<T = any>
  extends Omit<TableProps<T>, "columns"> {
  columns: PermissionColumn<T>[];
  actions?: PermissionAction[];
  actionColumnTitle?: string;
  actionColumnWidth?: number;
}

/**
 * PermissionAwareTable - A table component that filters columns and actions based on user permissions
 *
 * @param columns - Table columns with optional permission requirements
 * @param actions - Action buttons with permission requirements
 * @param actionColumnTitle - Title for the actions column
 * @param actionColumnWidth - Width for the actions column
 * @param props - Standard Ant Design Table props
 */
export const PermissionAwareTable = <T extends Record<string, any>>({
  columns,
  actions = [],
  actionColumnTitle = "Actions",
  actionColumnWidth = 120,
  ...props
}: PermissionAwareTableProps<T>) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole } =
    usePermissions();

  const filteredColumns = useMemo(() => {
    const visibleColumns = columns.filter((column) => {
      // If no permission requirements, show the column
      if (
        !column.permission &&
        !column.permissions?.length &&
        !column.hideForRoles?.length &&
        !column.showForRoles?.length
      ) {
        return true;
      }

      // Super Admin bypass
      if (hasRole("Super Admin") || hasPermission("*")) {
        return true;
      }

      // Check role-based visibility
      if (column.hideForRoles?.length) {
        const shouldHide = column.hideForRoles.some((role) => hasRole(role));
        if (shouldHide) return false;
      }

      if (column.showForRoles?.length) {
        const shouldShow = column.showForRoles.some((role) => hasRole(role));
        if (!shouldShow) return false;
      }

      // Check single permission
      if (column.permission) {
        return hasPermission(column.permission);
      }

      // Check multiple permissions
      if (column.permissions?.length) {
        return column.requireAll
          ? hasAllPermissions(column.permissions)
          : hasAnyPermission(column.permissions);
      }

      return true;
    });

    // Add actions column if there are any visible actions
    const visibleActions = actions.filter((action) => {
      if (!action.permission && !action.permissions?.length) {
        return true;
      }

      // Super Admin bypass
      if (hasRole("Super Admin") || hasPermission("*")) {
        return true;
      }

      if (action.permission) {
        return hasPermission(action.permission);
      }

      if (action.permissions?.length) {
        return action.requireAll
          ? hasAllPermissions(action.permissions)
          : hasAnyPermission(action.permissions);
      }

      return true;
    });

    if (visibleActions.length > 0) {
      const actionsColumn: ColumnsType<T>[number] = {
        title: actionColumnTitle,
        key: "actions",
        width: actionColumnWidth,
        render: (_, record) => (
          <Space size="small">
            {visibleActions.map((action) => (
              <ProtectedComponent
                key={action.key}
                permission={action.permission}
                requireAll={action.requireAll}
                showFallback={false}
              >
                <Tooltip title={action.tooltip}>
                  <Button
                    type="text"
                    size="small"
                    icon={action.icon}
                    danger={action.danger}
                    loading={action.loading}
                    disabled={action.disabled?.(record)}
                    onClick={() => action.onClick(record)}
                  >
                    {action.label}
                  </Button>
                </Tooltip>
              </ProtectedComponent>
            ))}
          </Space>
        ),
      };

      return [...visibleColumns, actionsColumn];
    }

    return visibleColumns;
  }, [
    columns,
    actions,
    actionColumnTitle,
    actionColumnWidth,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
  ]);

  return <Table {...props} columns={filteredColumns} />;
};

export default PermissionAwareTable;
