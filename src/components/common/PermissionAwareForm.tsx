import type { FormProps } from "antd";
import { Form, FormItemProps } from "antd";
import React, { cloneElement, isValidElement } from "react";
import { usePermissions } from "../../contexts/PermissionContext";

interface PermissionFormItemProps extends FormItemProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  readOnlyPermission?: string;
  readOnlyPermissions?: string[];
  hideWhenNoPermission?: boolean;
  children?: React.ReactNode;
}

/**
 * PermissionAwareFormItem - A form item that can be hidden or made read-only based on permissions
 *
 * @param permission - Single permission required to edit this field
 * @param permissions - Multiple permissions (any or all required)
 * @param requireAll - If true, all permissions must be present
 * @param readOnlyPermission - Permission that makes field read-only instead of hidden
 * @param readOnlyPermissions - Multiple permissions for read-only mode
 * @param hideWhenNoPermission - If true, hide field when no permission. If false, make read-only
 * @param children - Form field component
 * @param props - Standard Form.Item props
 */
export const PermissionAwareFormItem: React.FC<PermissionFormItemProps> = ({
  permission,
  permissions = [],
  requireAll = false,
  readOnlyPermission,
  readOnlyPermissions = [],
  hideWhenNoPermission = false,
  children,
  ...props
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole } =
    usePermissions();

  // Check if user has edit permissions
  const hasEditPermission = () => {
    // Super Admin bypass
    if (hasRole("Super Admin") || hasPermission("*")) {
      return true;
    }

    if (permission) {
      return hasPermission(permission);
    }

    if (permissions.length > 0) {
      return requireAll
        ? hasAllPermissions(permissions)
        : hasAnyPermission(permissions);
    }

    return true; // No permission requirements
  };

  // Check if user has read-only permissions
  const hasReadOnlyPermission = () => {
    if (!readOnlyPermission && !readOnlyPermissions.length) {
      return false;
    }

    // Super Admin bypass
    if (hasRole("Super Admin") || hasPermission("*")) {
      return true;
    }

    if (readOnlyPermission) {
      return hasPermission(readOnlyPermission);
    }

    if (readOnlyPermissions.length > 0) {
      return requireAll
        ? hasAllPermissions(readOnlyPermissions)
        : hasAnyPermission(readOnlyPermissions);
    }

    return false;
  };

  const canEdit = hasEditPermission();
  const canView = hasReadOnlyPermission();

  // If no edit permission and should hide, don't render
  if (!canEdit && hideWhenNoPermission && !canView) {
    return null;
  }

  // If no edit permission but has read permission or should show as read-only
  if (!canEdit && (canView || !hideWhenNoPermission)) {
    // Make the field read-only
    const readOnlyChildren = isValidElement(children)
      ? cloneElement(children as React.ReactElement, {
          disabled: true,
          readOnly: true,
        })
      : children;

    return <Form.Item {...props}>{readOnlyChildren}</Form.Item>;
  }

  // User has edit permission, render normally
  return <Form.Item {...props}>{children}</Form.Item>;
};

interface PermissionAwareFormProps extends FormProps {
  children: React.ReactNode;
}

/**
 * PermissionAwareForm - A form wrapper that provides permission context
 */
export const PermissionAwareForm: React.FC<PermissionAwareFormProps> = ({
  children,
  ...props
}) => {
  return <Form {...props}>{children}</Form>;
};

export default PermissionAwareForm;
