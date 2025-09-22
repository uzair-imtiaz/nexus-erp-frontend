import React from "react";
import { ExcelImport } from "../../components/common/excel-import";
import { message, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

interface InventoryImportProps {
  onImportComplete?: (result: any) => void;
}

export const InventoryImport: React.FC<InventoryImportProps> = ({
  onImportComplete,
}) => {
  const handleImportComplete = (result: any) => {
    if (result.success > 0) {
      message.success(
        `Successfully imported ${result.success} inventory items`
      );
    }
    if (result.failed > 0) {
      message.warning(
        `${result.failed} items failed to import. Check the errors below.`
      );
    }
    onImportComplete?.(result);
  };

  const downloadTemplate = () => {
    // Create a simple CSV template
    const headers = [
      "name",
      "code",
      "quantity",
      "base_rate",
      "selling_rate",
      "category",
      "base_unit",
      "opening_date",
    ];

    const sampleData = [
      "Product A",
      "PRO-001",
      "100",
      "10.50",
      "15.00",
      "Electronics",
      "pcs",
      "2024-01-01",
    ];

    const csvContent = [headers.join(","), sampleData.join(",")].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory-import-template.csv";
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
          name, code, quantity, base_rate
        </div>
      </div>

      <ExcelImport
        title=""
        endpoint="/inventory/import"
        onImportComplete={handleImportComplete}
      />
    </div>
  );
};
