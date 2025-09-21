import React from "react";
import { ExcelImport } from "../../components/common/excel-import";
import { message, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

interface BankImportProps {
  onImportComplete?: (result: any) => void;
}

export const BankImport: React.FC<BankImportProps> = ({ onImportComplete }) => {
  const handleImportComplete = (result: unknown) => {
    if (result.success > 0) {
      message.success(`Successfully imported ${result.success} bank accounts`);
    }
    if (result.failed > 0) {
      message.warning(
        `${result.failed} accounts failed to import. Check the errors below.`
      );
    }
    onImportComplete?.(result);
  };

  const downloadTemplate = () => {
    // Create a simple CSV template
    const headers = [
      "name",
      "account_number",
      "iban",
      "code",
      "current_balance",
      "opening_date",
    ];

    const sampleData = [
      "ABC Bank Main Branch",
      "1234567890",
      "GB29 NWBK 6016 1331 9268 19",
      "BANK-001",
      "10000.50",
      "2024-01-01",
    ];

    const csvContent = [headers.join(","), sampleData.join(",")].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bank-import-template.csv";
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
          name, account_number, iban, code, current_balance
        </div>
      </div>

      <ExcelImport
        title=""
        endpoint="/banks/import"
        onImportComplete={handleImportComplete}
      />
    </div>
  );
};
