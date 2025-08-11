import { LockOutlined, MailOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  notification,
  Space,
  Typography,
} from "antd";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/auth.services";

const { Title, Text } = Typography;

const LoginForm = () => {
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
      const response = await login(values);
      if (!response?.success) {
        setError("Invalid Credentials");
        setLoading(false);
        return;
      }
      notification.success({
        message: "Success",
        description: response.message,
      });
      navigate("/");
    } catch (error: any) {
      setError(error);
      notification.error({
        message: "Error",
        description: "Invalid Credentials",
      });
    } finally {
      setLoading(false);
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
        styles={{ body: { padding: "32px" } }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Logo or Brand */}
          <div style={{ textAlign: "center" }}>
            <Title level={2} style={{ marginBottom: "8px" }}>
              Welcome back
            </Title>
            <Text type="secondary">Sign in to your account</Text>
          </div>

          {/* Error message */}
          {error && <Alert message={error} type="error" showIcon />}

          {/* Login Form */}
          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            requiredMark={false}
          >
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
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            {/* Additional options */}
            <Form.Item>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Checkbox>Remember me</Checkbox>
              </div>
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
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </Form.Item>
          </Form>

          {/* Sign up link */}
          <div style={{ textAlign: "center" }}>
            <Text type="secondary">
              Don't have an account? <Link to="/register">Sign up</Link>
            </Text>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default LoginForm;
