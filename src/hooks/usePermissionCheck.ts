import { useMemo } from "react";
import { usePermissions } from "../contexts/PermissionContext";

interface UsePermissionCheckOptions {
  permission?: string;
  permissions?: string[];
  role?: string;
  roles?: string[];
  requireAll?: boolean;
}

/**
 * Hook for checking permissions and roles with memoization
 * Useful for components that need to perform permission checks frequently
 */
export const usePermissionCheck = (options: UsePermissionCheckOptions) => {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isLoading,
  } = usePermissions();

  const {
    permission,
    permissions = [],
    role,
    roles = [],
    requireAll = false,
  } = options;

  const hasAccess = useMemo(() => {
    if (isLoading) return false;

    let permissionAccess = true;
    let roleAccess = true;

    // Check permissions
    if (permission) {
      permissionAccess = hasPermission(permission);
    } else if (permissions.length > 0) {
      permissionAccess = requireAll
        ? hasAllPermissions(permissions)
        : hasAnyPermission(permissions);
    }

    // Check roles
    if (role) {
      roleAccess = hasRole(role);
    } else if (roles.length > 0) {
      roleAccess = requireAll
        ? roles.every((r) => hasRole(r))
        : hasAnyRole(roles);
    }

    return permissionAccess && roleAccess;
  }, [
    permission,
    permissions,
    role,
    roles,
    requireAll,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isLoading,
  ]);

  return {
    hasAccess,
    isLoading,
  };
};

/**
 * Hook for checking if user can perform CRUD operations on a resource
 */
export const useResourcePermissions = (resource: string) => {
  const { hasPermission } = usePermissions();

  return useMemo(
    () => ({
      canCreate: hasPermission(`${resource}.create`),
      canRead: hasPermission(`${resource}.read`),
      canUpdate: hasPermission(`${resource}.update`),
      canDelete: hasPermission(`${resource}.delete`),
      canList: hasPermission(`${resource}.list`),
      canExport: hasPermission(`${resource}.export`),
      canApprove: hasPermission(`${resource}.approve`),
      hasFullAccess: hasPermission(`${resource}.*`) || hasPermission("*"),
    }),
    [resource, hasPermission]
  );
};

/**
 * Hook for checking admin-level permissions
 */
export const useAdminPermissions = () => {
  const { hasRole, hasPermission } = usePermissions();

  return useMemo(
    () => ({
      isSuperAdmin: hasRole("Super Admin") || hasPermission("*"),
      isAdmin: hasRole("Admin") || hasRole("Super Admin"),
      isManager:
        hasRole("Manager") || hasRole("Admin") || hasRole("Super Admin"),
      canManageUsers: hasPermission("users.*") || hasPermission("*"),
      canManageRoles: hasPermission("roles.*") || hasPermission("*"),
      canViewReports:
        hasPermission("reports.read") ||
        hasPermission("reports.*") ||
        hasPermission("*"),
    }),
    [hasRole, hasPermission]
  );
};
