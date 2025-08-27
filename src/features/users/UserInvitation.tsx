import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, notification, Select, Space } from "antd";
import {
  inviteUserApi,
  getRolesApi,
  type Role,
  type UserInvitationData,
} from "../../services/user.services";

interface UserInvitationProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const UserInvitation: React.FC<UserInvitationProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    if (visible) {
      fetchRoles();
      form.resetFields();
    }
  }, [visible, form]);

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

      const invitationData: UserInvitationData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        roleId: values.roleId,
        message: values.message,
      };

      const response = await inviteUserApi(invitationData);
      if (!response.success) {
        throw new Error(response.message || "Failed to send invitation");
      }

      notification.success({
        message: "Success",
        description: "User invitation sent successfully",
      });

      onSuccess();
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message || "Failed to send invitation",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Invite User"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-700">
          An invitation email will be sent to the user with instructions to set
          up their account. They will be able to create their password and
          access the system with the assigned role.
        </p>
      </div>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
          label="Email Address"
          rules={[
            { required: true, message: "Please enter email address" },
            { type: "email", message: "Please enter a valid email address" },
            { max: 255, message: "Email must be less than 255 characters" },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        <Form.Item
          name="roleId"
          label="Assign Role"
          rules={[{ required: true, message: "Please select a role" }]}
          extra="The user will be assigned this role upon accepting the invitation"
        >
          <Select
            placeholder="Select a role for the user"
            showSearch
            optionLabelProp="label"
            filterOption={(input, option) =>
              (option?.label as string)
                ?.toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {roles.map((role) => (
              <Select.Option key={role.id} value={role.id} label={role.name}>
                <div className="flex flex-col py-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{role.name}</span>
                    {role.isSystemRole && (
                      <Tag size="small" color="blue">
                        System
                      </Tag>
                    )}
                  </div>
                  {role.description && (
                    <span className="text-xs text-gray-500 mt-1">
                      {role.description}
                    </span>
                  )}
                </div>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="message"
          label="Personal Message (Optional)"
          rules={[
            { max: 500, message: "Message must be less than 500 characters" },
          ]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Add a personal message to include in the invitation email..."
          />
        </Form.Item>

        <Form.Item className="mb-0 mt-6">
          <Space className="w-full justify-end">
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Send Invitation
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
