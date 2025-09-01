import React from "react";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import { usePermissions } from "../../contexts/PermissionContext";

interface PermissionMenuItem {
  key: React.Key;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
  title?: string;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  children?: PermissionMenuItem[];
}

interface PermissionAwareMenuProps extends Omit<MenuProps, "items"> {
  items: PermissionMenuItem[];
}

/**
 * PermissionAwareMenu - A menu component that filters items based on user permissions
 *
 * @param items - Menu items with optional permission requirements
 * @param props - Standard Ant Design Menu props
 */
export const PermissionAwareMenu: React.FC<PermissionAwareMenuProps> = ({
  items,
  ...props
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole } =
    usePermissions();

  const filterMenuItems = (
    menuItems: PermissionMenuItem[]
  ): MenuProps["items"] => {
    return menuItems
      .filter((item) => {
        // If no permission requirements, show the item
        if (!item.permission && !item.permissions?.length) {
          return true;
        }

        // Super Admin bypass
        if (hasRole("Super Admin") || hasPermission("*")) {
          return true;
        }

        // Check single permission
        if (item.permission) {
          return hasPermission(item.permission);
        }

        // Check multiple permissions
        if (item.permissions?.length) {
          return item.requireAll
            ? hasAllPermissions(item.permissions)
            : hasAnyPermission(item.permissions);
        }

        return true;
      })
      .map((item) => ({
        ...item,
        children: item.children ? filterMenuItems(item.children) : undefined,
      }))
      .filter((item) => {
        // Remove items that have no visible children (if they were supposed to have children)
        if (item.children !== undefined) {
          return item.children.length > 0;
        }
        return true;
      });
  };

  const filteredItems = filterMenuItems(items);

  return <Menu {...props} items={filteredItems} />;
};

export default PermissionAwareMenu;
