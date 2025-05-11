import {
  BankOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  message,
  Space,
  Typography,
} from "antd";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/auth.services";

const { Title, Text } = Typography;

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      navigate("/");
    }
  }, []);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      setError("");
      const { agreement, confirmPassword, ...rest } = values;
      const response = await register(rest);
      if (!response.success) {
        setError(response.message);
        setLoading(false);
        message.error(response.message);
        return;
      }
      message.success(response.message);
      navigate("/login");
    } catch (error: any) {
      setError(error?.message);
    } finally {
      setLoading(false);
      setError("");
    }
  };

  const onFinishFailed = (errorInfo) => {
    setError("Please check your inputs and try again.");
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#f0f2f5",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          borderRadius: "8px",
        }}
        bordered={false}
        bodyStyle={{ padding: "32px" }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Logo or Brand */}
          <div style={{ textAlign: "center" }}>
            <Title level={2} style={{ marginBottom: "8px" }}>
              Create account
            </Title>
            <Text type="secondary">Sign up to get started</Text>
          </div>

          {/* Error message */}
          {error && <Alert message={error} type="error" showIcon />}

          {/* Signup Form */}
          <Form
            name="signup"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            requiredMark={false}
          >
            {/* Full Name Input */}
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                { required: true, message: "Please input your first name!" },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="First Name"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[
                { required: true, message: "Please input your last name!" },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Last Name"
                size="large"
              />
            </Form.Item>

            {/* Business Name Input */}
            <Form.Item
              label="Business Name"
              name="tenantName"
              rules={[
                { required: true, message: "Please input your business name!" },
              ]}
            >
              <Input
                prefix={<BankOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Business Name"
                size="large"
              />
            </Form.Item>

            {/* Email Input */}
            <Form.Item
              label="Email address"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            {/* Password Input */}
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 8, message: "Password must be at least 8 characters!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            {/* Confirm Password Input */}
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Confirm Password"
                size="large"
              />
            </Form.Item>

            {/* Terms and Conditions */}
            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("You must accept the terms and conditions!")
                        ),
                },
              ]}
            >
              <Checkbox>
                I agree to the <Link href="#">Terms of Service</Link> and{" "}
                <Link href="#">Privacy Policy</Link>
              </Checkbox>
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </Form.Item>
          </Form>

          {/* Login link */}
          <div style={{ textAlign: "center" }}>
            <Text type="secondary">
              Already have an account? <Link to="/login">Sign in</Link>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default RegisterForm;
