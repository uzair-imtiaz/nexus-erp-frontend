import { Spin, Result, Button } from "antd";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { usePermissions } from "../../contexts/PermissionContext";

interface PermissionProtectedRouteProps {
  permission?: string;
  permissions?: string[];
  role?: string;
  roles?: string[];
  requireAll?: boolean;
  fallbackPath?: string;
}

/**
 * PermissionProtectedRoute - Component that protects routes requiring specific permissions or roles
 *
 * This component first verifies authentication, then checks if the user has the required
 * permissions or roles to access the route. If not, it shows an access denied page.
 *
 * @param permission - Single permission required to access the route
 * @param permissions - Array of permissions (user needs any or all based on requireAll)
 * @param role - Single role required to access the route
 * @param roles - Array of roles (user needs any or all based on requireAll)
 * @param requireAll - If true, user must have ALL specified permissions/roles
 * @param fallbackPath - Path to redirect to when access is denied (optional)
 * @returns {JSX.Element} - The protected route content, access denied page, or redirect
 */
const PermissionProtectedRoute: React.FC<PermissionProtectedRouteProps> = ({
  permission,
  permissions = [],
  role,
  roles = [],
  requireAll = false,
  fallbackPath,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isLoading: isPermissionLoading,
  } = usePermissions();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = Cookies.get("accessToken");
        if (!token) {
          setIsAuthenticated(false);
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Check if user has required permissions/roles
  const hasAccess = () => {
    if (isPermissionLoading) return false;

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
  };

  // Show loading spinner while checking authentication or permissions
  if (isAuthLoading || isPermissionLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check permissions/roles access
  if (!hasAccess()) {
    if (fallbackPath) {
      return <Navigate to={fallbackPath} replace />;
    }

    return (
      <div style={{ padding: "50px" }}>
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <Button type="primary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  // Render the protected content
  return <Outlet />;
};

export default PermissionProtectedRoute;
