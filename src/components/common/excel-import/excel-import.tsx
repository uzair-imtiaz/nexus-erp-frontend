import React, { useState } from "react";
import { Upload, Button, Typography, Space, message } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import Cookies from "js-cookie";

const { Title, Text } = Typography;

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

interface JobResponse {
  jobId: string;
  message: string;
}

interface JobStatus {
  id: string;
  state: string;
  progress: number;
  result?: ImportResult;
  failedReason?: string;
  createdAt: string;
  processedAt?: string;
  finishedAt?: string;
}

interface ExcelImportProps {
  title: string;
  endpoint: string;
  templateUrl?: string;
  onImportComplete?: (result: ImportResult) => void;
}

export const ExcelImport: React.FC<ExcelImportProps> = ({
  title,
  endpoint,
  templateUrl,
  onImportComplete,
}) => {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [polling, setPolling] = useState(false);

  const baseURL =
    import.meta.env.MODE === "production"
      ? `${import.meta.env.VITE_APP_API_URL}/api`
      : "http://localhost:3001/api";

  const uploadProps: UploadProps = {
    name: "file",
    action: `${baseURL}${endpoint}`,
    headers: {
      authorization: `Bearer ${
        Cookies.get("accessToken") || Cookies.get("token") || ""
      }`,
      "x-tenant-id": Cookies.get("tenantId") || "",
    },
    accept: ".xlsx,.xls",
    showUploadList: false,
    beforeUpload: (file) => {
      const isExcel =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel";
      if (!isExcel) {
        message.error("You can only upload Excel files!");
        return false;
      }
      return true;
    },
    onChange: (info) => {
      if (info.file.status === "uploading") {
        setUploading(true);
        setResult(null);
      }
      if (info.file.status === "done") {
        setUploading(false);
        const response = info.file.response;
        if (response?.success && response.data?.jobId) {
          message.success("Import job started successfully");
          startPolling(response.data.jobId);
        } else {
          message.error(response?.message || "Import failed");
        }
      }
      if (info.file.status === "error") {
        setUploading(false);
        message.error("Upload failed. Please try again.");
        console.error("Upload failed:", info.file.error);
      }
    },
  };

  const downloadTemplate = () => {
    if (templateUrl) {
      window.open(templateUrl, "_blank");
    }
  };

  const startPolling = (jobId: string) => {
    setPolling(true);
    setJobStatus(null);
    setResult(null);

    const pollInterval = setInterval(async () => {
      try {
        const statusEndpoint = endpoint.replace(
          "/import",
          `/import/status/${jobId}`
        );
        const response = await fetch(`${baseURL}${statusEndpoint}`, {
          headers: {
            authorization: `Bearer ${
              Cookies.get("accessToken") || Cookies.get("token") || ""
            }`,
            "x-tenant-id": Cookies.get("tenantId") || "",
          },
        });

        const statusData = await response.json();

        if (statusData.success) {
          const status: JobStatus = statusData.data;
          setJobStatus(status);

          if (status.state === "completed") {
            clearInterval(pollInterval);
            setPolling(false);
            setResult(status.result || null);
            onImportComplete?.(
              status.result || { success: 0, failed: 0, errors: [] }
            );
            message.success("Import completed successfully");
          } else if (status.state === "failed") {
            clearInterval(pollInterval);
            setPolling(false);
            message.error(
              `Import failed: ${status.failedReason || "Unknown error"}`
            );
          }
        }
      } catch (error) {
        console.error("Error polling job status:", error);
      }
    }, 2000); // Poll every 2 seconds

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      setPolling(false);
    }, 300000);
  };

  return (
    <div
      style={{
        padding: "24px",
        border: "1px solid #d9d9d9",
        borderRadius: "8px",
      }}
    >
      <Title level={4}>{title}</Title>

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {templateUrl && (
          <div>
            <Text type="secondary">
              Download the template first to see the required format:
            </Text>
            <br />
            <Button
              icon={<DownloadOutlined />}
              onClick={downloadTemplate}
              style={{ marginTop: "8px" }}
            >
              Download Template
            </Button>
          </div>
        )}

        <div>
          <Text strong>Upload Excel File:</Text>
          <br />
          <Upload {...uploadProps}>
            <Button
              icon={<UploadOutlined />}
              loading={uploading || polling}
              disabled={polling}
              style={{ marginTop: "8px" }}
            >
              {uploading
                ? "Uploading..."
                : polling
                ? "Processing..."
                : "Select Excel File"}
            </Button>
          </Upload>
        </div>

        {jobStatus && (
          <div>
            <Text strong>Import Progress:</Text>
            <div style={{ marginTop: "8px" }}>
              <div>Status: {jobStatus.state}</div>
              {jobStatus.progress > 0 && (
                <div style={{ marginTop: "8px" }}>
                  <div>Progress: {jobStatus.progress}%</div>
                  <div
                    style={{
                      width: "100%",
                      backgroundColor: "#f0f0f0",
                      borderRadius: "4px",
                      marginTop: "4px",
                    }}
                  >
                    <div
                      style={{
                        width: `${jobStatus.progress}%`,
                        backgroundColor: "#1890ff",
                        height: "8px",
                        borderRadius: "4px",
                        transition: "width 0.3s ease",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {result && (
          <div>
            <Title level={5}>Import Results:</Title>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Text strong>Successfully imported: </Text>
                <Text style={{ color: "#52c41a" }}>
                  {result.success} records
                </Text>
              </div>

              {result.failed > 0 && (
                <div>
                  <Text strong>Failed: </Text>
                  <Text style={{ color: "#ff4d4f" }}>
                    {result.failed} records
                  </Text>
                </div>
              )}

              {result.errors.length > 0 && (
                <div>
                  <Text strong>Errors:</Text>
                  <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
                    {result.errors.slice(0, 10).map((error, index) => (
                      <li
                        key={index}
                        style={{ color: "#ff4d4f", marginBottom: "4px" }}
                      >
                        {error}
                      </li>
                    ))}
                    {result.errors.length > 10 && (
                      <li style={{ color: "#666" }}>
                        ... and {result.errors.length - 10} more errors
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </Space>
          </div>
        )}
      </Space>
    </div>
  );
};
