import {
  BankOutlined,
  CheckCircleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  message,
  notification,
  Progress,
  Row,
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
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  // Password strength calculator
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 50) return "#ef4444";
    if (strength < 75) return "#f59e0b";
    return "#10b981";
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 25) return "Very Weak";
    if (strength < 50) return "Weak";
    if (strength < 75) return "Good";
    return "Strong";
  };

  useEffect(() => {
    if (Cookies.get("accessToken")) {
      navigate("/");
    }
  }, [navigate]);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const { agreement, confirmPassword, ...rest } = values;
      const response = await register(rest);
      if (!response.success) {
        notification.error({
          message: "Error",
          description: response.message,
        });
        setLoading(false);
        message.error(response.message);
        return;
      }
      message.success(response.message);
      navigate("/login");
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    notification.error({
      description: "Please check your inputs and try again.",
      message: "Error",
    });
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "space-between",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Row style={{ width: "100%" }} gutter={0}>
        {/* Left Side - Branding */}
        <Col xs={0} md={11} lg={13}>
          <div
            style={{
              height: "100%",
              minHeight: "580px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px 0 0 20px",
              padding: "40px 30px",
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
                marginBottom: "16px",
                fontSize: "2.2rem",
              }}
            >
              Join MintsBook
            </Title>

            <Text
              style={{
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: "16px",
                lineHeight: "1.5",
                marginBottom: "30px",
              }}
            >
              Transform your business with our comprehensive accounting
              solution. Get started in minutes and experience the power of
              integrated business management.
            </Text>

            <div style={{ width: "100%", maxWidth: "300px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <CheckCircleOutlined
                  style={{
                    color: "#4ade80",
                    fontSize: "16px",
                    marginRight: "12px",
                  }}
                />
                <Text
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: "14px",
                  }}
                >
                  30-day free trial
                </Text>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <CheckCircleOutlined
                  style={{
                    color: "#4ade80",
                    fontSize: "16px",
                    marginRight: "12px",
                  }}
                />
                <Text
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: "14px",
                  }}
                >
                  No credit card required
                </Text>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <CheckCircleOutlined
                  style={{
                    color: "#4ade80",
                    fontSize: "16px",
                    marginRight: "12px",
                  }}
                />
                <Text
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: "14px",
                  }}
                >
                  24/7 customer support
                </Text>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <CheckCircleOutlined
                  style={{
                    color: "#4ade80",
                    fontSize: "16px",
                    marginRight: "12px",
                  }}
                />
                <Text
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: "14px",
                  }}
                >
                  Secure & compliant
                </Text>
              </div>
            </div>
          </div>
        </Col>

        {/* Right Side - Register Form */}
        <Col xs={24} md={12} lg={10}>
          <Card
            style={{
              height: "100%",
              minHeight: "580px",
              borderRadius: "0 20px 20px 0",
              border: "none",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            }}
            styles={{
              body: {
                padding: "24px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              },
            }}
          >
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "12px" }}>
                <Title
                  level={2}
                  style={{
                    marginBottom: "4px",
                    color: "#1f2937",
                    fontSize: "1.6rem",
                    fontWeight: "700",
                  }}
                >
                  Create Account
                </Title>
                <Text
                  style={{
                    color: "#6b7280",
                    fontSize: "14px",
                    display: "block",
                    marginBottom: "6px",
                  }}
                >
                  Start your business transformation today
                </Text>
                <div
                  style={{
                    width: "40px",
                    height: "2px",
                    background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                    margin: "0 auto",
                    borderRadius: "2px",
                  }}
                />
              </div>

              {/* Register Form */}
              <Form
                className="ml-4"
                form={form}
                name="signup"
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                requiredMark={false}
                size="middle"
              >
                {/* Name Fields Row */}
                <Row gutter={12}>
                  <Col span={24}>
                    <Form.Item
                      label={
                        <span
                          style={{
                            fontWeight: "500",
                            color: "#374151",
                            fontSize: "13px",
                          }}
                        >
                          First Name
                        </span>
                      }
                      name="firstName"
                      rules={[
                        {
                          required: true,
                          message: "Please input your first name!",
                        },
                      ]}
                      style={{ marginBottom: "12px" }}
                    >
                      <Input
                        prefix={<UserOutlined style={{ color: "#6b7280" }} />}
                        placeholder="First Name"
                        style={{
                          borderRadius: "6px",
                          border: "1px solid #d1d5db",
                          height: "36px",
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label={
                        <span
                          style={{
                            fontWeight: "500",
                            color: "#374151",
                            fontSize: "13px",
                          }}
                        >
                          Last Name
                        </span>
                      }
                      name="lastName"
                      rules={[
                        {
                          required: true,
                          message: "Please input your last name!",
                        },
                      ]}
                      style={{ marginBottom: "12px" }}
                    >
                      <Input
                        prefix={<UserOutlined style={{ color: "#6b7280" }} />}
                        placeholder="Last Name"
                        style={{
                          borderRadius: "6px",
                          border: "1px solid #d1d5db",
                          height: "36px",
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Business Name and Email Row */}
                <Row gutter={12}>
                  <Col span={24}>
                    <Form.Item
                      label={
                        <span
                          style={{
                            fontWeight: "500",
                            color: "#374151",
                            fontSize: "13px",
                          }}
                        >
                          Business Name
                        </span>
                      }
                      name="tenantName"
                      rules={[
                        {
                          required: true,
                          message: "Please input your business name!",
                        },
                      ]}
                      style={{ marginBottom: "12px" }}
                    >
                      <Input
                        prefix={<BankOutlined style={{ color: "#6b7280" }} />}
                        placeholder="Business name"
                        style={{
                          borderRadius: "6px",
                          border: "1px solid #d1d5db",
                          height: "36px",
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label={
                        <span
                          style={{
                            fontWeight: "500",
                            color: "#374151",
                            fontSize: "13px",
                          }}
                        >
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
                      style={{ marginBottom: "12px" }}
                    >
                      <Input
                        prefix={<MailOutlined style={{ color: "#6b7280" }} />}
                        placeholder="Enter your email"
                        style={{
                          borderRadius: "6px",
                          border: "1px solid #d1d5db",
                          height: "36px",
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Password Fields Row */}
                <Row gutter={12}>
                  <Col span={24}>
                    <Form.Item
                      label={
                        <span
                          style={{
                            fontWeight: "500",
                            color: "#374151",
                            fontSize: "13px",
                          }}
                        >
                          Password
                        </span>
                      }
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Please input your password!",
                        },
                        {
                          min: 8,
                          message: "Password must be at least 8 characters!",
                        },
                      ]}
                      style={{ marginBottom: "12px" }}
                    >
                      <Input.Password
                        prefix={<LockOutlined style={{ color: "#6b7280" }} />}
                        placeholder="Create password"
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                        style={{
                          borderRadius: "6px",
                          border: "1px solid #d1d5db",
                          height: "36px",
                        }}
                        onChange={(e) => {
                          const strength = calculatePasswordStrength(
                            e.target.value
                          );
                          form.setFieldValue("password", e.target.value);
                          setPasswordStrength(strength);
                        }}
                      />
                      {passwordStrength > 0 && (
                        <div style={{ marginTop: "4px" }}>
                          <Progress
                            percent={passwordStrength}
                            strokeColor={getPasswordStrengthColor(
                              passwordStrength
                            )}
                            showInfo={false}
                            // size="small"
                          />
                          <Text
                            style={{
                              fontSize: "10px",
                              color: getPasswordStrengthColor(passwordStrength),
                              fontWeight: "500",
                            }}
                          >
                            {getPasswordStrengthText(passwordStrength)}
                          </Text>
                        </div>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Form.Item
                      label={
                        <span
                          style={{
                            fontWeight: "500",
                            color: "#374151",
                            fontSize: "13px",
                          }}
                        >
                          Confirm Password
                        </span>
                      }
                      name="confirmPassword"
                      dependencies={["password"]}
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your password!",
                        },
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
                      style={{ marginBottom: "12px" }}
                    >
                      <Input.Password
                        prefix={<LockOutlined style={{ color: "#6b7280" }} />}
                        placeholder="Confirm password"
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                        style={{
                          borderRadius: "6px",
                          border: "1px solid #d1d5db",
                          height: "36px",
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

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
                              new Error(
                                "You must accept the terms and conditions!"
                              )
                            ),
                    },
                  ]}
                  style={{ marginBottom: "16px" }}
                >
                  <Checkbox style={{ color: "#6b7280", fontSize: "12px" }}>
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      style={{ color: "#3b82f6", fontWeight: "500" }}
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      style={{ color: "#3b82f6", fontWeight: "500" }}
                    >
                      Privacy Policy
                    </Link>
                  </Checkbox>
                </Form.Item>

                {/* Submit Button */}
                <Form.Item style={{ marginBottom: "12px" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    size="middle"
                    icon={!loading && <UserAddOutlined />}
                    style={{
                      height: "40px",
                      borderRadius: "6px",
                      background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                      border: "none",
                      fontSize: "14px",
                      fontWeight: "600",
                      boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
                    }}
                  >
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </Form.Item>
              </Form>

              {/* Divider */}
              <Divider style={{ margin: "12px 0", color: "#9ca3af" }}>
                <Text style={{ color: "#9ca3af", fontSize: "12px" }}>
                  Already have an account?
                </Text>
              </Divider>

              {/* Login link */}
              <div style={{ textAlign: "center" }}>
                <Text style={{ color: "#6b7280", fontSize: "13px" }}>
                  Ready to sign in?{" "}
                  <Link
                    to="/login"
                    style={{
                      color: "#3b82f6",
                      fontWeight: "600",
                      textDecoration: "none",
                    }}
                  >
                    Access your account
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

export default RegisterForm;
