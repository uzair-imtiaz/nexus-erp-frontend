import React from "react";
import { ExcelImport } from "../../components/common/excel-import";
import { message, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

interface CustomerImportProps {
  onImportComplete?: (result: any) => void;
}

export const CustomerImport: React.FC<CustomerImportProps> = ({
  onImportComplete,
}) => {
  const handleImportComplete = (result: any) => {
    if (result.success > 0) {
      message.success(`Successfully imported ${result.success} customers`);
    }
    if (result.failed > 0) {
      message.warning(
        `${result.failed} customers failed to import. Check the errors below.`
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
      "address",
      "contact_number",
      "email",
    ];

    const sampleData = [
      "ABC Company Ltd",
      "John Doe",
      "CUST-001",
      "1000.50",
      "2024-01-01",
      "123 Main St",
      "+1234567890",
      "john@abc.com",
    ];

    const csvContent = [headers.join(","), sampleData.join(",")].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customer-import-template.csv";
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
          name, person_name, code, opening_balance, opening_balance_date
        </div>
      </div>

      <ExcelImport
        title=""
        endpoint="/customer/import"
        onImportComplete={handleImportComplete}
      />
    </div>
  );
};
