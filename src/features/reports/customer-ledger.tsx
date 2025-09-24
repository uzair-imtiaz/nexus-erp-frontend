import React from "react";
import EntityLedger from "./entity-ledger";

const CustomerLedger: React.FC = () => {
  return <EntityLedger entityType="customer" title="Customer Ledger Report" />;
};

export default CustomerLedger;
