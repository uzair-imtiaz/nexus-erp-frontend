import {
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SafetyCertificateOutlined,
  LoginOutlined,
} from "@ant-design/icons";
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
  Divider,
  Row,
  Col,
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
  }, [navigate]);

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
    } catch (error: unknown) {
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
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Row style={{ width: "100%", maxWidth: "1200px" }} gutter={0}>
        {/* Left Side - Branding */}
        <Col xs={0} md={12} lg={14}>
          <div
            style={{
              height: "100%",
              minHeight: "600px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px 0 0 20px",
              padding: "60px 40px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "30px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
              }}
            >
              <SafetyCertificateOutlined
                style={{ fontSize: "36px", color: "white" }}
              />
            </div>

            <Title
              level={1}
              style={{
                color: "white",
                marginBottom: "20px",
                fontSize: "2.5rem",
              }}
            >
              MintsBook
            </Title>

            <Text
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: "18px",
                lineHeight: "1.6",
              }}
            >
              Streamline your business operations with our comprehensive
              accounting solution. Manage inventory, sales, finances, and more
              in one powerful platform.
            </Text>

            <div style={{ marginTop: "40px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    background: "#4ade80",
                    borderRadius: "50%",
                    marginRight: "12px",
                  }}
                />
                <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  Real-time Analytics
                </Text>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    background: "#4ade80",
                    borderRadius: "50%",
                    marginRight: "12px",
                  }}
                />
                <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  Inventory Management
                </Text>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    background: "#4ade80",
                    borderRadius: "50%",
                    marginRight: "12px",
                  }}
                />
                <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                  Financial Reporting
                </Text>
              </div>
            </div>
          </div>
        </Col>

        {/* Right Side - Login Form */}
        <Col xs={24} md={12} lg={10}>
          <Card
            style={{
              height: "100%",
              minHeight: "600px",
              borderRadius: "0 20px 20px 0",
              border: "none",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            }}
            styles={{
              body: {
                padding: "60px 40px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              },
            }}
          >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <Title
                  level={2}
                  style={{
                    marginBottom: "8px",
                    color: "#1f2937",
                    fontSize: "2rem",
                    fontWeight: "700",
                  }}
                >
                  Welcome Back
                </Title>
                <div
                  style={{
                    width: "50px",
                    height: "3px",
                    background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                    margin: "0 auto",
                    borderRadius: "2px",
                  }}
                />
              </div>

              {/* Error Alert */}
              {error && (
                <Alert
                  message={error}
                  type="error"
                  showIcon
                  style={{
                    borderRadius: "8px",
                    border: "1px solid #fecaca",
                    background: "#fef2f2",
                  }}
                />
              )}

              {/* Login Form */}
              <Form
                name="login"
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                requiredMark={false}
                size="large"
              >
                {/* Email Input */}
                <Form.Item
                  label={
                    <span style={{ fontWeight: "500", color: "#374151" }}>
                      Email Address
                    </span>
                  }
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
                    prefix={<MailOutlined style={{ color: "#6b7280" }} />}
                    placeholder="Enter your email"
                    style={{
                      borderRadius: "8px",
                      border: "2px solid #e5e7eb",
                      padding: "12px 16px",
                      fontSize: "16px",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3b82f6";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(59, 130, 246, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </Form.Item>

                {/* Password Input */}
                <Form.Item
                  label={
                    <span style={{ fontWeight: "500", color: "#374151" }}>
                      Password
                    </span>
                  }
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined style={{ color: "#6b7280" }} />}
                    placeholder="Enter your password"
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    style={{
                      borderRadius: "8px",
                      border: "2px solid #e5e7eb",
                      padding: "12px 16px",
                      fontSize: "16px",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3b82f6";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(59, 130, 246, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e7eb";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </Form.Item>

                {/* Remember Me & Forgot Password */}
                <Form.Item style={{ marginBottom: "24px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Checkbox style={{ color: "#6b7280" }}>
                      Remember me
                    </Checkbox>
                    {/* <Link
                      to="/forgot-password"
                      style={{
                        color: "#3b82f6",
                        textDecoration: "none",
                        fontWeight: "500",
                      }}
                    >
                      Forgot password?
                    </Link> */}
                  </div>
                </Form.Item>

                {/* Submit Button */}
                <Form.Item style={{ marginBottom: "20px" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    size="large"
                    icon={!loading && <LoginOutlined />}
                    style={{
                      height: "50px",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                      border: "none",
                      fontSize: "16px",
                      fontWeight: "600",
                      boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
                    }}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </Form.Item>
              </Form>

              {/* Divider */}
              <Divider style={{ margin: "20px 0", color: "#9ca3af" }}>
                <Text style={{ color: "#9ca3af", fontSize: "14px" }}>
                  New to MintsBook?
                </Text>
              </Divider>

              {/* Sign up link */}
              <div style={{ textAlign: "center" }}>
                <Text style={{ color: "#6b7280", fontSize: "15px" }}>
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    style={{
                      color: "#3b82f6",
                      fontWeight: "600",
                      textDecoration: "none",
                    }}
                  >
                    Create one now
                  </Link>
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LoginForm;
