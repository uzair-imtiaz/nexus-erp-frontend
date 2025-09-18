import React from "react";
import { ExcelImport } from "../../components/common/excel-import";
import { message } from "antd";

export const VendorImport: React.FC = () => {
  const handleImportComplete = (result: any) => {
    if (result.success > 0) {
      message.success(`Successfully imported ${result.success} vendors`);
    }
    if (result.failed > 0) {
      message.warning(
        `${result.failed} vendors failed to import. Check the errors below.`
      );
    }
  };

  return (
    <ExcelImport
      title="Import Vendors"
      endpoint="/api/vendor/import"
      onImportComplete={handleImportComplete}
    />
  );
};
