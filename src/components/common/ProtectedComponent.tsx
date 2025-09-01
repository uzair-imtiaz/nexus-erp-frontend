import React, { useMemo } from "react";
import { usePermissions } from "../../contexts/PermissionContext";

interface ProtectedComponentProps {
  permission?: string;
  role?: string;
  roles?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  showFallback?: boolean;
}

/**
 * ProtectedComponent - Conditionally renders children based on user permissions or roles
 *
 * Super Admin Bypass: Users with 'super_admin' role or '*' permission automatically get access
 *
 * @param permission - Single permission to check
 * @param permissions - Array of permissions to check
 * @param role - Single role to check
 * @param roles - Array of roles to check
 * @param requireAll - If true, user must have ALL specified permissions/roles. If false, user needs ANY
 * @param fallback - Component to render when access is denied
 * @param showFallback - If true, shows fallback when access denied. If false, renders nothing
 * @param children - Content to render when access is granted
 */
export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  permission,
  role,
  roles = [],
  requireAll = false,
  fallback = null,
  showFallback = true,
  children,
}) => {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    permissions,
    hasAnyRole,
    isLoading,
  } = usePermissions();

  const hasAccess = useMemo(() => {
    // If still loading, deny access
    if (isLoading) return false;

    // Super Admin bypass: If user has super_admin role or wildcard permissions, grant access
    if (hasRole("Super Admin") || hasPermission("*")) {
      return true;
    }

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

    // Both permission and role checks must pass
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

  if (hasAccess) {
    return <>{children}</>;
  }

  return showFallback ? <>{fallback}</> : null;
};

export default ProtectedComponent;
