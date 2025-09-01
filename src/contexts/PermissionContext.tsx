import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  permissions: string[];
  roles: string[];
}

interface JwtPayload {
  email: string;
  sub: string;
  tenantId: string;
  permissions: string[];
  roles: string[];
  isActive: boolean;
  exp: number;
  iat: number;
}

interface PermissionContextType {
  user: User | null;
  permissions: string[];
  roles: string[];
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  refreshPermissions: () => Promise<void>;
  clearPermissions: () => void;
}

const PermissionContext = createContext<PermissionContextType | null>(null);

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
};

interface PermissionProviderProps {
  children: React.ReactNode;
}

export const PermissionProvider: React.FC<PermissionProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cache permissions in localStorage with expiration
  const CACHE_KEY = "user_permissions_cache";
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const getCachedPermissions = (): {
    permissions: string[];
    roles: string[];
    user: User;
  } | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();

      if (now - timestamp > CACHE_DURATION) {
        localStorage.removeItem(CACHE_KEY);
        return null;
      }

      return data;
    } catch {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  };

  const setCachedPermissions = (data: {
    permissions: string[];
    roles: string[];
    user: User;
  }) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn("Failed to cache permissions:", error);
    }
  };

  const loadPermissionsFromToken = (): boolean => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) return false;

      const decoded = jwtDecode<JwtPayload>(token);

      // Check if token is expired
      if (decoded.exp * 1000 < Date.now()) {
        return false;
      }

      const userData: User = {
        id: decoded.sub,
        email: decoded.email,
        firstName: "",
        lastName: "",
        permissions: decoded.permissions || [],
        roles: decoded.roles || [],
      };

      setUser(userData);
      setPermissions(decoded.permissions || []);
      setRoles(decoded.roles || []);

      // Cache the permissions
      setCachedPermissions({
        permissions: decoded.permissions || [],
        roles: decoded.roles || [],
        user: userData,
      });

      return true;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return false;
    }
  };

  const loadPermissions = async () => {
    setIsLoading(true);

    try {
      // First try to load from cache
      const cached = getCachedPermissions();
      if (cached) {
        setUser(cached.user);
        setPermissions(cached.permissions);
        setRoles(cached.roles);
        setIsLoading(false);
        return;
      }

      // If no cache, try to load from token
      const tokenLoaded = loadPermissionsFromToken();
      if (!tokenLoaded) {
        // Clear everything if token is invalid
        clearPermissions();
      }
    } catch (error) {
      console.error("Failed to load permissions:", error);
      clearPermissions();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPermissions = async (): Promise<void> => {
    // Clear cache and reload from token
    localStorage.removeItem(CACHE_KEY);
    await loadPermissions();
  };

  const clearPermissions = () => {
    setUser(null);
    setPermissions([]);
    setRoles([]);
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem("user");
    // Note: Cookies are cleared by the backend or axios interceptor
  };

  // Permission checking functions
  const hasPermission = (permission: string): boolean => {
    if (!permissions.length) return false;

    // Check for wildcard permissions
    if (permissions.includes("*")) return true;

    // Check for exact match
    if (permissions.includes(permission)) return true;

    // Check for wildcard resource permissions (e.g., 'accounts.*' matches 'accounts.create')
    const [resource, action] = permission.split(".");
    if (resource && permissions.includes(`${resource}.*`)) return true;

    return false;
  };

  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.some((permission) => hasPermission(permission));
  };

  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    return requiredPermissions.every((permission) => hasPermission(permission));
  };

  const hasRole = (role: string): boolean => {
    return roles.includes(role);
  };

  const hasAnyRole = (requiredRoles: string[]): boolean => {
    return requiredRoles.some((role) => hasRole(role));
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  const value: PermissionContextType = {
    user,
    permissions,
    roles,
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    refreshPermissions,
    clearPermissions,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export { PermissionContext };
