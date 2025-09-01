import React, { useMemo } from "react";
import { Menu, MenuProps } from "antd";
import { usePermissions } from "../../contexts/PermissionContext";

interface PermissionMenuItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  permission?: string;
  permissions?: string[];
  role?: string;
  roles?: string[];
  requireAll?: boolean;
  children?: PermissionMenuItem[];
  [key: string]: any; // Allow other Menu.Item props
}

interface PermissionMenuProps extends Omit<MenuProps, "items"> {
  items: PermissionMenuItem[];
  hideUnauthorized?: boolean;
}

/**
 * Menu component that filters items based on user permissions
 *
 * @param items - Menu items with permission requirements
 * @param hideUnauthorized - Whether to hide unauthorized items (default: true)
 */
export const PermissionMenu: React.FC<PermissionMenuProps> = ({
  items,
  hideUnauthorized = true,
  ...menuProps
}) => {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isLoading,
  } = usePermissions();

  const checkItemAccess = (item: PermissionMenuItem): boolean => {
    if (isLoading) return false;

    let permissionAccess = true;
    let roleAccess = true;

    // Check permissions
    if (item.permission) {
      permissionAccess = hasPermission(item.permission);
    } else if (item.permissions && item.permissions.length > 0) {
      permissionAccess = item.requireAll
        ? hasAllPermissions(item.permissions)
        : hasAnyPermission(item.permissions);
    }

    // Check roles
    if (item.role) {
      roleAccess = hasRole(item.role);
    } else if (item.roles && item.roles.length > 0) {
      roleAccess = item.requireAll
        ? item.roles.every((r) => hasRole(r))
        : hasAnyRole(item.roles);
    }

    return permissionAccess && roleAccess;
  };

  const filterMenuItems = (
    menuItems: PermissionMenuItem[]
  ): MenuProps["items"] => {
    return menuItems
      .filter((item) => {
        // If no permission requirements, always show
        if (
          !item.permission &&
          !item.permissions &&
          !item.role &&
          !item.roles
        ) {
          return true;
        }

        // Check if user has access
        const hasAccess = checkItemAccess(item);

        // If hideUnauthorized is false, show all items (they might be disabled elsewhere)
        if (!hideUnauthorized) return true;

        return hasAccess;
      })
      .map((item) => {
        const {
          permission,
          permissions,
          role,
          roles,
          requireAll,
          children,
          ...menuItemProps
        } = item;

        // Process children recursively
        const processedChildren = children
          ? filterMenuItems(children)
          : undefined;

        return {
          ...menuItemProps,
          children: processedChildren,
        };
      });
  };

  const filteredItems = useMemo(() => {
    return filterMenuItems(items);
  }, [
    items,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isLoading,
    hideUnauthorized,
  ]);

  return <Menu {...menuProps} items={filteredItems} />;
};

export default PermissionMenu;
