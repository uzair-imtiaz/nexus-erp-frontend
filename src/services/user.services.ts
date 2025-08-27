import { responseMetadata } from "../apis/types";
import { buildQueryString } from "../utils";
import {
  deleteCallback,
  getCallback,
  patchCallback,
  postCallback,
  putCallback,
} from "../utils/network-helper";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  lastLogin?: string;
  roles: Role[];
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  users: User[];
  description?: string;
  isSystemRole: boolean;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  resource: string;
  action: string;
  description?: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tenantName: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  isActive?: boolean;
}

export interface UserInvitationData {
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  message?: string;
}

export interface UserFilters {
  search?: string;
  is_active?: boolean;
  role_id?: string;
  page?: number;
  limit?: number;
}

export interface CreateRoleData {
  name: string;
  description?: string;
  permissionIds?: string[];
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  permissionIds?: string[];
}

export interface CloneRoleData {
  name: string;
  description?: string;
}

export interface RoleUsage {
  roleId: string;
  roleName: string;
  userCount: number;
  users: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }[];
}

// User Management APIs
export const getUsersApi = async (
  filters: UserFilters = {}
): Promise<responseMetadata> => {
  const queryString = buildQueryString(filters);
  const response: responseMetadata = await getCallback(
    `users${queryString ? `${queryString}` : ""}`
  );
  return response;
};

export const getUserApi = async (id: string): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`users/${id}`);
  return response;
};

export const createUserApi = async (
  userData: CreateUserData
): Promise<responseMetadata> => {
  const response: responseMetadata = await postCallback("users", userData);
  return response;
};

export const updateUserApi = async (
  id: string,
  userData: UpdateUserData
): Promise<responseMetadata> => {
  const response: responseMetadata = await putCallback(`users/${id}`, userData);
  return response;
};

export const inviteUserApi = async (
  invitationData: UserInvitationData
): Promise<responseMetadata> => {
  const response: responseMetadata = await postCallback(
    "users/invite",
    invitationData
  );
  return response;
};

export const activateUserApi = async (
  id: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await patchCallback(
    `users/${id}/activate`,
    {}
  );
  return response;
};

export const deactivateUserApi = async (
  id: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await patchCallback(
    `users/${id}/deactivate`,
    {}
  );
  return response;
};

export const assignRoleApi = async (
  userId: string,
  roleId: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await postCallback(
    `users/${userId}/roles`,
    { roleId }
  );
  return response;
};

export const removeRoleApi = async (
  userId: string,
  roleId: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await deleteCallback(
    `users/${userId}/roles/${roleId}`
  );
  return response;
};

export const getUserPermissionsApi = async (
  id: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(
    `users/${id}/permissions`
  );
  return response;
};

// Role Management APIs
export const getRolesApi = async (
  filters: { search?: string; page?: number; limit?: number } = {}
): Promise<responseMetadata> => {
  const queryString = buildQueryString(filters);
  const response: responseMetadata = await getCallback(
    `roles${queryString ? `${queryString}` : ""}`
  );
  return response;
};

export const getRoleApi = async (id: string): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`roles/${id}`);
  return response;
};

export const getRoleUsageApi = async (
  id: string
): Promise<responseMetadata> => {
  const response: responseMetadata = await getCallback(`roles/${id}/usage`);
  return response;
};

export const createRoleApi = async (
  roleData: CreateRoleData
): Promise<responseMetadata> => {
  const response: responseMetadata = await postCallback("roles", roleData);
  return response;
};

export const updateRoleApi = async (
  id: string,
  roleData: UpdateRoleData
): Promise<responseMetadata> => {
  const response: responseMetadata = await putCallback(`roles/${id}`, roleData);
  return response;
};

export const deleteRoleApi = async (id: string): Promise<responseMetadata> => {
  const response: responseMetadata = await deleteCallback(`roles/${id}`);
  return response;
};

export const cloneRoleApi = async (
  id: string,
  cloneData: CloneRoleData
): Promise<responseMetadata> => {
  const response: responseMetadata = await postCallback(
    `roles/${id}/clone`,
    cloneData
  );
  return response;
};

export const assignPermissionsApi = async (
  roleId: string,
  permissionIds: string[]
): Promise<responseMetadata> => {
  const response: responseMetadata = await postCallback(
    `roles/${roleId}/permissions`,
    { permissionIds }
  );
  return response;
};

export const removePermissionsApi = async (
  roleId: string,
  permissionIds: string[]
): Promise<responseMetadata> => {
  const response: responseMetadata = await postCallback(
    `roles/${roleId}/permissions/remove`,
    { permissionIds }
  );
  return response;
};

// Permission Management APIs
export const getPermissionsApi = async (
  filters: {
    search?: string;
    resource?: string;
    page?: number;
    limit?: number;
  } = {}
): Promise<responseMetadata> => {
  const queryString = buildQueryString(filters);
  const response: responseMetadata = await getCallback(
    `permissions${queryString ? `${queryString}` : ""}`
  );
  return response;
};
