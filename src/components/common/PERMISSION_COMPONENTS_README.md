# Permission-Aware Components

This document describes the permission-aware components that have been implemented to support role-based access control (RBAC) in the frontend application.

## Overview

The permission-aware components automatically hide, disable, or modify UI elements based on the user's permissions. This ensures that users only see and interact with features they are authorized to use.

## Components

### 1. ProtectedComponent

A wrapper component that conditionally renders children based on user permissions.

```tsx
import { ProtectedComponent } from '../../components/common';

// Single permission
<ProtectedComponent permission="users.create">
  <Button>Create User</Button>
</ProtectedComponent>

// Multiple permissions (any)
<ProtectedComponent permissions={["users.read", "users.update"]}>
  <UserForm />
</ProtectedComponent>

// Multiple permissions (all required)
<ProtectedComponent permissions={["users.read", "users.update"]} requireAll>
  <AdminPanel />
</ProtectedComponent>

// With fallback content
<ProtectedComponent
  permission="reports.read"
  fallback={<div>Access Denied</div>}
>
  <ReportsPage />
</ProtectedComponent>
```

### 2. PermissionAwareMenu

A menu component that filters menu items based on user permissions.

```tsx
import { PermissionAwareMenu } from "../../components/common";

const menuItems = [
  {
    key: "/users",
    label: "Users",
    icon: <UserOutlined />,
    permission: "users.read",
  },
  {
    key: "/reports",
    label: "Reports",
    icon: <BarChartOutlined />,
    permissions: ["reports.read", "reports.export"],
    children: [
      {
        key: "/reports/sales",
        label: "Sales Report",
        permission: "sales.read",
      },
    ],
  },
];

<PermissionAwareMenu
  items={menuItems}
  mode="vertical"
  selectedKeys={[location.pathname]}
  onClick={({ key }) => navigate(key)}
/>;
```

### 3. PermissionAwareTable

A table component that filters columns and actions based on user permissions.

```tsx
import { PermissionAwareTable } from "../../components/common";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    permission: "users.read", // Hide column if no permission
  },
  {
    title: "Salary",
    dataIndex: "salary",
    hideForRoles: ["Viewer"], // Hide for specific roles
    showForRoles: ["Admin", "HR"], // Show only for specific roles
  },
];

const actions = [
  {
    key: "edit",
    label: "Edit",
    icon: <EditOutlined />,
    permission: "users.update",
    onClick: (record) => handleEdit(record),
  },
  {
    key: "delete",
    label: "Delete",
    icon: <DeleteOutlined />,
    permission: "users.delete",
    onClick: (record) => handleDelete(record),
    danger: true,
  },
];

<PermissionAwareTable
  columns={columns}
  actions={actions}
  dataSource={data}
  rowKey="id"
/>;
```

### 4. PermissionAwareForm & PermissionAwareFormItem

Form components that can hide or make fields read-only based on permissions.

```tsx
import {
  PermissionAwareForm,
  PermissionAwareFormItem,
} from "../../components/common";

<PermissionAwareForm form={form} layout="vertical">
  <PermissionAwareFormItem
    label="Name"
    name="name"
    permission="users.update" // Can edit if has permission
    readOnlyPermission="users.read" // Read-only if only has read permission
    hideWhenNoPermission={false} // Show as read-only instead of hiding
  >
    <Input />
  </PermissionAwareFormItem>

  <PermissionAwareFormItem
    label="Salary"
    name="salary"
    permission="users.update"
    hideWhenNoPermission={true} // Hide completely if no permission
  >
    <InputNumber />
  </PermissionAwareFormItem>
</PermissionAwareForm>;
```

### 5. PermissionAwareDashboard

A dashboard component that shows widgets based on user permissions.

```tsx
import { PermissionAwareDashboard } from "../../components/common";

const widgets = [
  {
    key: "sales",
    title: "Total Sales",
    value: 125000,
    prefix: <DollarOutlined />,
    permission: "sales.read",
  },
  {
    key: "users",
    title: "Active Users",
    value: 45,
    permissions: ["users.read", "users.list"],
    requireAll: false,
  },
];

<PermissionAwareDashboard
  title="Dashboard"
  widgets={widgets}
  extra={<Button>Refresh</Button>}
/>;
```

## Permission System

### Permission Format

Permissions follow the format: `resource.action`

- **Resource**: The module or entity (e.g., `users`, `sales`, `reports`)
- **Action**: The operation (e.g., `create`, `read`, `update`, `delete`, `list`, `export`)

### Special Permissions

- `*`: Wildcard permission (grants access to everything)
- `resource.*`: Wildcard for all actions on a resource (e.g., `users.*`)

### Super Admin Bypass

Users with the "Super Admin" role or `*` permission automatically bypass all permission checks.

## Best Practices

### 1. Always Use Server-Side Validation

Frontend permission checks are for UX only. Always validate permissions on the server side.

```tsx
// ❌ Don't rely only on frontend checks
<ProtectedComponent permission="users.delete">
  <Button onClick={deleteUser}>Delete</Button>
</ProtectedComponent>;

// ✅ Also validate on server
const deleteUser = async (id) => {
  try {
    await deleteUserApi(id); // Server validates permission
  } catch (error) {
    if (error.status === 403) {
      message.error("You don't have permission to delete users");
    }
  }
};
```

### 2. Graceful Degradation

Provide meaningful fallbacks when users lack permissions.

```tsx
<ProtectedComponent
  permission="reports.export"
  fallback={
    <Tooltip title="Contact admin for export access">
      <Button disabled>Export (No Permission)</Button>
    </Tooltip>
  }
>
  <Button onClick={exportData}>Export</Button>
</ProtectedComponent>
```

### 3. Consistent Permission Naming

Use consistent naming conventions for permissions across the application.

```tsx
// ✅ Good - consistent naming
"users.create";
"users.read";
"users.update";
"users.delete";

// ❌ Bad - inconsistent naming
"create_user";
"view-user";
"editUser";
"remove_user";
```

### 4. Group Related Permissions

Use permission arrays for related functionality.

```tsx
<ProtectedComponent permissions={["sales.read", "sales.list"]}>
  <SalesTable />
</ProtectedComponent>
```

### 5. Performance Considerations

Permission checks are cached for 5 minutes. For real-time permission updates, call `refreshPermissions()`.

```tsx
import { usePermissions } from "../../contexts/PermissionContext";

const { refreshPermissions } = usePermissions();

// Refresh permissions after role change
const handleRoleUpdate = async () => {
  await updateUserRole(userId, newRole);
  await refreshPermissions(); // Refresh cached permissions
};
```

## Migration Guide

### Updating Existing Components

1. **Replace regular Menu with PermissionAwareMenu**:

```tsx
// Before
<Menu items={menuItems} />

// After
<PermissionAwareMenu items={menuItemsWithPermissions} />
```

2. **Replace regular Table with PermissionAwareTable**:

```tsx
// Before
<Table columns={columns} dataSource={data} />

// After
<PermissionAwareTable
  columns={columnsWithPermissions}
  actions={actionsWithPermissions}
  dataSource={data}
/>
```

3. **Wrap sensitive UI elements**:

```tsx
// Before
<Button onClick={deleteItem}>Delete</Button>

// After
<ProtectedComponent permission="items.delete">
  <Button onClick={deleteItem}>Delete</Button>
</ProtectedComponent>
```

### Adding Permissions to Existing Features

1. Identify the resources and actions in your feature
2. Add permission properties to menu items, table columns, and actions
3. Wrap sensitive components with ProtectedComponent
4. Test with different user roles

## Testing

### Testing Permission Components

```tsx
import { render } from "@testing-library/react";
import { PermissionProvider } from "../../contexts/PermissionContext";
import { ProtectedComponent } from "../../components/common";

const TestWrapper = ({ permissions, children }) => (
  <PermissionProvider
    value={{ permissions, hasPermission: (p) => permissions.includes(p) }}
  >
    {children}
  </PermissionProvider>
);

test("shows content when user has permission", () => {
  const { getByText } = render(
    <TestWrapper permissions={["users.read"]}>
      <ProtectedComponent permission="users.read">
        <div>Protected Content</div>
      </ProtectedComponent>
    </TestWrapper>
  );

  expect(getByText("Protected Content")).toBeInTheDocument();
});
```

## Troubleshooting

### Common Issues

1. **Component not showing despite having permission**:

   - Check if permission string matches exactly
   - Verify user has the correct role assigned
   - Check if permissions are cached (try refreshing)

2. **Super Admin not bypassing restrictions**:

   - Ensure role name is exactly "Super Admin"
   - Check if user has `*` permission

3. **Performance issues with many permission checks**:
   - Use permission caching
   - Avoid nested ProtectedComponents
   - Consider using role-based checks for better performance

### Debug Mode

Enable debug logging for permission checks:

```tsx
// In development, log permission checks
if (process.env.NODE_ENV === "development") {
  console.log("Permission check:", permission, hasPermission(permission));
}
```
