import React from "react";
import { ExcelImport } from "../../components/common/excel-import";
import { message } from "antd";

export const CustomerImport: React.FC = () => {
  const handleImportComplete = (result: any) => {
    if (result.success > 0) {
      message.success(`Successfully imported ${result.success} customers`);
    }
    if (result.failed > 0) {
      message.warning(
        `${result.failed} customers failed to import. Check the errors below.`
      );
    }
  };

  return (
    <ExcelImport
      title="Import Customers"
      endpoint="/api/customer/import"
      onImportComplete={handleImportComplete}
    />
  );
};
