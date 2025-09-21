import React from "react";
import { ExcelImport } from "../../components/common/excel-import";
import { message, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

interface VendorImportProps {
  onImportComplete?: (result: ImportResult) => void;
}

export const VendorImport: React.FC<VendorImportProps> = ({
  onImportComplete,
}) => {
  const handleImportComplete = (result: ImportResult) => {
    if (result.success > 0) {
      message.success(`Successfully imported ${result.success} vendors`);
    }
    if (result.failed > 0) {
      message.warning(
        `${result.failed} vendors failed to import. Check the errors below.`
      );
    }
    onImportComplete?.(result);
  };

  const downloadTemplate = () => {
    // Create a simple CSV template
    const headers = [
      "name",
      "person_name",
      "code",
      "opening_balance",
      "opening_balance_date",
      "status",
      "address",
      "contact_number",
      "email",
    ];

    const sampleData = [
      "XYZ Suppliers Ltd",
      "Jane Smith",
      "VEND-001",
      "2000.00",
      "2024-01-01",
      "true",
      "456 Oak Ave",
      "+0987654321",
      "jane@xyz.com",
    ];

    const csvContent = [headers.join(","), sampleData.join(",")].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vendor-import-template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <Button
          icon={<DownloadOutlined />}
          onClick={downloadTemplate}
          style={{ marginBottom: "16px" }}
        >
          Download Template
        </Button>
        <div style={{ fontSize: "12px", color: "#666" }}>
          Download the template to see the required format. Required fields:
          name, person_name, code, opening_balance, opening_balance_date, status
        </div>
      </div>

      <ExcelImport
        title=""
        endpoint="/vendor/import"
        onImportComplete={handleImportComplete}
      />
    </div>
  );
};
