import React from "react";
import { ExcelImport } from "../../components/common/excel-import";
import { message } from "antd";

export const BankImport: React.FC = () => {
  const handleImportComplete = (result: any) => {
    if (result.success > 0) {
      message.success(`Successfully imported ${result.success} bank accounts`);
    }
    if (result.failed > 0) {
      message.warning(
        `${result.failed} accounts failed to import. Check the errors below.`
      );
    }
  };

  return (
    <ExcelImport
      title="Import Bank Accounts"
      endpoint="/api/banks/import"
      onImportComplete={handleImportComplete}
    />
  );
};
