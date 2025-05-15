import React, { useState } from "react";
import { TransactorListComponent } from "../../components/common/transactor/transactor-listing";

export const VendorComponent: React.FC = (props) => {
  const [vendors, setVendors] = useState([]);

  const handleAddVendor = () => {};

  const handleDeleteVendor = () => {};

  const handleEditVendor = () => {};

  return (
    <TransactorListComponent
      entityType="vendor"
      entities={vendors}
      onAddTransactor={handleAddVendor}
      onDeleteTransactor={handleDeleteVendor}
      onEditTransactor={handleEditVendor}
    />
  );
};
