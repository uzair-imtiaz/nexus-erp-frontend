import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  notification,
  Switch,
  Select,
  Space,
  Tag,
} from "antd";
import {
  createUserApi,
  updateUserApi,
  getRolesApi,
  assignRoleApi,
  removeRoleApi,
  type User,
  type Role,
  type CreateUserData,
  type UpdateUserData,
  UserInvitationData,
  inviteUserApi,
} from "../../services/user.services";

interface UserFormProps {
  visible: boolean;
  user?: User | null;
  onCancel: () => void;
  onSuccess: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  visible,
  user,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const isEditing = !!user;

  useEffect(() => {
    if (visible) {
      fetchRoles();
      if (user) {
        form.setFieldsValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          isActive: user.isActive,
        });
        setSelectedRoles(user.roles?.map((role) => role.id) || []);
      } else {
        form.resetFields();
        setSelectedRoles([]);
      }
    }
  }, [visible, user, form]);

  const fetchRoles = async () => {
    try {
      const response = await getRolesApi();
      if (response.success) {
        setRoles(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      if (isEditing) {
        // Update user
        const updateData: UpdateUserData = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          isActive: values.isActive,
        };

        const response = await updateUserApi(user!.id, updateData);
        if (!response.success) {
          throw new Error(response.message || "Failed to update user");
        }

        // Handle role changes
        const currentRoleIds = user!.roles?.map((role) => role.id) || [];
        const rolesToAdd = selectedRoles.filter(
          (roleId) => !currentRoleIds.includes(roleId)
        );
        const rolesToRemove = currentRoleIds.filter(
          (roleId) => !selectedRoles.includes(roleId)
        );

        // Add new roles
        for (const roleId of rolesToAdd) {
          await assignRoleApi(user!.id, roleId);
        }

        // Remove old roles
        for (const roleId of rolesToRemove) {
          await removeRoleApi(user!.id, roleId);
        }

        notification.success({
          message: "Success",
          description: "User updated successfully",
        });
      } else {
        console.log("values", values);
        // Create new user
        const createData: UserInvitationData = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          roleId: values.role[0],
        };

        const response = await inviteUserApi(createData);
        if (!response.success) {
          throw new Error(response.message || "Failed to create user");
        }

        notification.success({
          message: "Success",
          description: "User created successfully",
        });
      }

      onSuccess();
    } catch (error: any) {
      notification.error({
        message: "Error",
        description:
          error.message || `Failed to ${isEditing ? "update" : "create"} user`,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      title={isEditing ? "Edit User" : "Create User"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ isActive: true }}
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              { required: true, message: "Please enter first name" },
              {
                max: 150,
                message: "First name must be less than 150 characters",
              },
            ]}
          >
            <Input placeholder="Enter first name" />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[
              { required: true, message: "Please enter last name" },
              {
                max: 150,
                message: "Last name must be less than 150 characters",
              },
            ]}
          >
            <Input placeholder="Enter last name" />
          </Form.Item>
        </div>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email" },
            { max: 255, message: "Email must be less than 255 characters" },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        <Form.Item
          name="roles"
          label="Roles"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select
            mode="multiple"
            placeholder="Select roles for this user"
            value={selectedRoles}
            onChange={setSelectedRoles}
            optionLabelProp="label"
            showSearch
            filterOption={(input, option) =>
              (option?.label as string)
                ?.toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {roles.map((role) => (
              <Select.Option key={role.id} value={role.id} label={role.name}>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span>{role.name}</span>
                    {role.isSystemRole && (
                      <Tag size="small" color="blue">
                        System
                      </Tag>
                    )}
                  </div>
                  {role.description && (
                    <span className="text-xs text-gray-500">
                      {role.description}
                    </span>
                  )}
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {isEditing && (
          <>
            <Form.Item
              name="isActive"
              label="Account Status"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                className="bg-gray-300"
              />
            </Form.Item>
          </>
        )}

        <Form.Item className="mb-0 mt-6">
          <Space className="w-full justify-end">
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditing ? "Update" : "Create"} User
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
