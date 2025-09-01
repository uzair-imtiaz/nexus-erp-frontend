import React from "react";
import { render, screen } from "@testing-library/react";
import { UserManagementDashboard } from "../UserManagementDashboard";
import { PermissionContext } from "../../../contexts/PermissionContext";

// Mock the services
jest.mock("../../../services/user.services", () => ({
  getUsersApi: jest.fn().mockResolvedValue({
    success: true,
    data: [
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        isActive: true,
        roles: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  }),
  getRolesApi: jest.fn().mockResolvedValue({
    success: true,
    data: [
      {
        id: "1",
        name: "Admin",
        isSystemRole: true,
        permissions: [],
      },
    ],
  }),
}));

const mockPermissionContext = {
  permissions: ["users.read", "users.create", "users.update"],
  hasPermission: (permission: string) => true,
  hasAnyPermission: (permissions: string[]) => true,
  hasAllPermissions: (permissions: string[]) => true,
};

const renderWithPermissions = (component: React.ReactElement) => {
  return render(
    <PermissionContext.Provider value={mockPermissionContext}>
      {component}
    </PermissionContext.Provider>
  );
};

describe("UserManagementDashboard", () => {
  it("renders dashboard with statistics", async () => {
    renderWithPermissions(<UserManagementDashboard />);

    expect(screen.getByText("User Management Overview")).toBeInTheDocument();
    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("Active Users")).toBeInTheDocument();
    expect(screen.getByText("Inactive Users")).toBeInTheDocument();
    expect(screen.getByText("Total Roles")).toBeInTheDocument();
  });

  it("renders recent users section", async () => {
    renderWithPermissions(<UserManagementDashboard />);

    expect(screen.getByText("Recent Users")).toBeInTheDocument();
  });

  it("renders quick actions section", async () => {
    renderWithPermissions(<UserManagementDashboard />);

    expect(screen.getByText("Quick Actions")).toBeInTheDocument();
  });
});
