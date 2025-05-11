import { Spin } from "antd";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
/**
 * ProtectedRoute - Component that protects routes requiring authentication
 *
 * This component verifies if a user is authenticated by checking for a valid token
 * in localStorage. If the token is not present, it redirects to the login page.
 *
 * @returns {JSX.Element} - The protected route content or redirect
 */
const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

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
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading spinner while checking authentication
  if (isLoading) {
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

  // Redirect to login if not authenticated, otherwise render the protected content
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
