import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Collapse,
  Input,
  Select,
  Table,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  getPermissionsApi,
  getRolesApi,
  type Permission,
  type Role,
} from "../../../services/user.services";
import "./PermissionMatrix.css";

interface MatrixData {
  permissionId: string;
  resource: string;
  action: string;
  description?: string;
  [roleId: string]: unknown; // Dynamic role columns
}

export const PermissionMatrix: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [matrixData, setMatrixData] = useState<MatrixData[]>([]);
  const [filteredData, setFilteredData] = useState<MatrixData[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [resourceFilter, setResourceFilter] = useState<string>("");
  const [searchText, setSearchText] = useState("");
  const [showOnlyAssigned, setShowOnlyAssigned] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [matrixData, selectedRoles, resourceFilter, searchText, showOnlyAssigned]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [rolesResponse, permissionsResponse] = await Promise.all([
        getRolesApi({ limit: 1000 }),
        getPermissionsApi({ limit: 1000 }),
      ]);

      if (rolesResponse.success && permissionsResponse.success) {
        const rolesData = rolesResponse.data || [];
        const permissionsData = permissionsResponse.data || [];

        setRoles(rolesData);
        setPermissions(permissionsData);
        setSelectedRoles(rolesData.map((role: Role) => role.id));

        // Build matrix data
        const matrix = permissionsData.map((permission: Permission) => {
          const row: MatrixData = {
            permissionId: permission.id,
            resource: permission.resource,
            action: permission.action,
            description: permission.description,
          };

          // Add role columns
          rolesData.forEach((role: Role) => {
            row[role.id] =
              role.permissions?.some((p) => p.id === permission.id) || false;
          });

          return row;
        });

        setMatrixData(matrix);
      }
    } catch (error) {
      console.error("Failed to fetch matrix data:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...matrixData];

    // Filter by search text
    if (searchText) {
      filtered = filtered.filter(
        (item) =>
          item.resource.toLowerCase().includes(searchText.toLowerCase()) ||
          item.action.toLowerCase().includes(searchText.toLowerCase()) ||
          (item.description &&
            item.description.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    // Filter by resource
    if (resourceFilter) {
      filtered = filtered.filter((item) => item.resource === resourceFilter);
    }

    // Filter by assigned permissions only
    if (showOnlyAssigned) {
      filtered = filtered.filter((item) =>
        selectedRoles.some((roleId) => item[roleId] === true)
      );
    }

    setFilteredData(filtered);
  };

  const getUniqueResources = () => {
    return [...new Set(permissions.map((p) => p.resource))].sort();
  };

  const getRoleColumns = () => {
    return roles
      .filter((role) => selectedRoles.includes(role.id))
      .map((role) => ({
        title: (
          <div className="text-center">
            <div className="font-medium">{role.name}</div>
            {role.isSystemRole && (
              <Tag color="blue" className="mt-1">
                System
              </Tag>
            )}
          </div>
        ),
        dataIndex: role.id,
        key: role.id,
        width: 120,
        align: "center" as const,
        render: (hasPermission: boolean) => (
          <div className="flex justify-center">
            {hasPermission ? (
              <div
                className="w-4 h-4 bg-green-500 rounded-full"
                title="Has Permission"
              />
            ) : (
              <div
                className="w-4 h-4 bg-gray-200 rounded-full"
                title="No Permission"
              />
            )}
          </div>
        ),
      }));
  };

  const baseColumns = [
    {
      title: "Resource",
      dataIndex: "resource",
      key: "resource",
      width: 120,
      fixed: "left" as const,
      render: (resource: string) => (
        <Tag color="blue" className="capitalize">
          {resource}
        </Tag>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 100,
      fixed: "left" as const,
      render: (action: string) => (
        <span className="font-medium capitalize">{action}</span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 200,
      fixed: "left" as const,
      render: (description: string) => (
        <span className="text-sm text-gray-600">{description || "-"}</span>
      ),
    },
  ];

  const columns = [...baseColumns, ...getRoleColumns()];

  const handleRoleSelection = (roleIds: string[]) => {
    setSelectedRoles(roleIds);
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export matrix data");
  };

  const getPermissionSummary = () => {
    const summary: Record<
      string,
      { total: number; assigned: Record<string, number> }
    > = {};

    getUniqueResources().forEach((resource) => {
      const resourcePermissions = filteredData.filter(
        (item) => item.resource === resource
      );
      summary[resource] = {
        total: resourcePermissions.length,
        assigned: {},
      };

      selectedRoles.forEach((roleId) => {
        const assignedCount = resourcePermissions.filter(
          (item) => item[roleId]
        ).length;
        summary[resource].assigned[roleId] = assignedCount;
      });
    });

    return summary;
  };

  const permissionSummary = getPermissionSummary();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Permission Matrix</h1>
        <p className="text-gray-600 text-sm mt-1">
          Compare permissions across roles and identify access patterns
        </p>
      </div>

      <Card className="mb-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Input
              placeholder="Search permissions..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-64"
              allowClear
            />

            <Select
              placeholder="Filter by resource"
              value={resourceFilter}
              onChange={setResourceFilter}
              className="w-48"
              allowClear
            >
              {getUniqueResources().map((resource) => (
                <Select.Option key={resource} value={resource}>
                  <span className="capitalize">{resource}</span>
                </Select.Option>
              ))}
            </Select>

            <Checkbox
              checked={showOnlyAssigned}
              onChange={(e) => setShowOnlyAssigned(e.target.checked)}
            >
              Show only assigned permissions
            </Checkbox>

            <Button
              icon={<DownloadOutlined />}
              onClick={handleExport}
              className="ml-auto"
            >
              Export Matrix
            </Button>
          </div>

          <div>
            <div className="mb-2 text-sm font-medium">
              Select Roles to Compare:
            </div>
            <Select
              mode="multiple"
              placeholder="Select roles to display"
              value={selectedRoles}
              onChange={handleRoleSelection}
              className="w-full"
              maxTagCount="responsive"
            >
              {roles.map((role) => (
                <Select.Option key={role.id} value={role.id}>
                  <div className="flex items-center gap-2">
                    {role.name}
                    {role.isSystemRole && (
                      <span className="text-xs text-blue-500">(System)</span>
                    )}
                  </div>
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      <Collapse className="mb-6">
        <Collapse.Panel header="Permission Summary by Resource" key="summary">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(permissionSummary).map(([resource, data]) => (
              <Card key={resource} size="small">
                <div className="text-center">
                  <div className="font-medium capitalize mb-2">{resource}</div>
                  <div className="text-sm text-gray-600 mb-3">
                    {data.total} total permissions
                  </div>
                  <div className="space-y-1">
                    {selectedRoles.slice(0, 3).map((roleId) => {
                      const role = roles.find((r) => r.id === roleId);
                      const assignedCount = data.assigned[roleId] || 0;
                      const percentage =
                        data.total > 0
                          ? Math.round((assignedCount / data.total) * 100)
                          : 0;

                      return (
                        <div
                          key={roleId}
                          className="flex justify-between items-center text-xs"
                        >
                          <span className="truncate">{role?.name}</span>
                          <span className="font-medium">{percentage}%</span>
                        </div>
                      );
                    })}
                    {selectedRoles.length > 3 && (
                      <div className="text-xs text-gray-400">
                        +{selectedRoles.length - 3} more roles
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Collapse.Panel>
      </Collapse>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="permissionId"
          loading={loading}
          scroll={{ x: 800 + selectedRoles.length * 120 }}
          pagination={{
            pageSize: 50,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} permissions`,
          }}
          size="small"
          className="permission-matrix-table"
        />
      </Card>

      <div className="mt-4 text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full" />
            <span>Has Permission</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded-full" />
            <span>No Permission</span>
          </div>
        </div>
      </div>
    </div>
  );
};
