import React from "react";
import { usePermissionCheck } from "../../hooks/usePermissionCheck";
import { Result, Spin } from "antd";

interface WithPermissionsOptions {
  permission?: string;
  permissions?: string[];
  role?: string;
  roles?: string[];
  requireAll?: boolean;
  fallback?: React.ComponentType;
  loadingComponent?: React.ComponentType;
}

/**
 * Higher-order component that wraps a component with permission checking
 *
 * @param WrappedComponent - The component to wrap with permission checking
 * @param options - Permission checking options
 * @returns A new component that only renders if permissions are satisfied
 */
export function withPermissions<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithPermissionsOptions
) {
  const {
    permission,
    permissions,
    role,
    roles,
    requireAll = false,
    fallback: FallbackComponent,
    loadingComponent: LoadingComponent,
  } = options;

  const WithPermissionsComponent: React.FC<P> = (props) => {
    const { hasAccess, isLoading } = usePermissionCheck({
      permission,
      permissions,
      role,
      roles,
      requireAll,
    });

    if (isLoading) {
      if (LoadingComponent) {
        return <LoadingComponent />;
      }
      return (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "20px" }}
        >
          <Spin size="large" />
        </div>
      );
    }

    if (!hasAccess) {
      if (FallbackComponent) {
        return <FallbackComponent />;
      }
      return (
        <Result
          status="403"
          title="Access Denied"
          subTitle="You don't have permission to view this content."
        />
      );
    }

    return <WrappedComponent {...props} />;
  };

  WithPermissionsComponent.displayName = `withPermissions(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithPermissionsComponent;
}

/**
 * Utility function to create permission-protected components quickly
 */
export const createProtectedComponent = <P extends object>(
  component: React.ComponentType<P>,
  permission: string,
  fallback?: React.ComponentType
) => {
  return withPermissions(component, { permission, fallback });
};

/**
 * Utility function to create role-protected components quickly
 */
export const createRoleProtectedComponent = <P extends object>(
  component: React.ComponentType<P>,
  role: string,
  fallback?: React.ComponentType
) => {
  return withPermissions(component, { role, fallback });
};
