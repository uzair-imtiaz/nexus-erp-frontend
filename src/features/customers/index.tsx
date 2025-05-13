import React, { useState } from "react";
import { TransactorListComponent } from "../../components/common/transactor/transactor-listing";

export const CustomerComponent: React.FC = (props) => {
  const [customers, setCustomers] = useState([]);

  const handleAddCustomer = () => {};

  const handleDeleteCustomer = () => {};

  const handleEditCustomer = () => {};

  return (
    <TransactorListComponent
      entityType="customer"
      entities={customers}
      onAddTransactor={handleAddCustomer}
      onDeleteTransactor={handleDeleteCustomer}
      onEditTransactor={handleEditCustomer}
    />
  );
};
