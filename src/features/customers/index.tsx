import React, { useState } from "react";
import { TransactorListComponent } from "../../components/common/transactor/transactor-listing";
import {
  createCustomerApi,
  deleteCustomerApi,
  getCustomersApi,
  updateCustomerApi,
} from "../../services/customers.services";
import { notification } from "antd";
import { buildQueryString } from "../../utils";

export const CustomerComponent: React.FC = (props) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    nextPage: null,
    prevPage: null,
  });

  const handleAddCustomer = async (values) => {
    try {
      const response = await createCustomerApi(values);
      if (response?.success) {
        notification.success({ message: response?.message });
        setCustomers((prev) => [...prev, response?.data]);
      } else notification.error({ message: response?.message });
    } catch (error: any) {
      notification.error({ message: error.message });
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      const response = await deleteCustomerApi(id);
      if (response?.success) {
        notification.success({ message: response?.message });
        setCustomers(customers.filter((customer) => customer.id !== id));
      } else {
        notification.error({ message: response?.message });
      }
    } catch (error: any) {
      notification.error({ message: error.message });
    }
  };

  const handleEditCustomer = async (id, values) => {
    try {
      const response = await updateCustomerApi(id, values);
      if (response?.success) {
        notification.success({ message: response?.message });
        setCustomers((prev) =>
          prev.map((customer) =>
            customer.id === id ? response?.data : customer
          )
        );
      } else notification.error({ message: response?.message });
    } catch (error: any) {
      notification.error({ message: error.message });
    }
  };

  const fetchCustomers = async (queryParams: Record<string, any> = {}) => {
    try {
      setLoading(true);
      const queryString = buildQueryString(queryParams);
      const response = await getCustomersApi(queryString);

      if (!response.success) {
        return notification.error({
          message: "Error",
          description: response.message,
        });
      }

      setCustomers(response.data);
      setPagination(response.pagination);
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TransactorListComponent
      entityType="customer"
      entities={customers}
      onAddTransactor={async (values) => handleAddCustomer(values)}
      onDeleteTransactor={handleDeleteCustomer}
      onEditTransactor={async (id, values) => handleEditCustomer(id, values)}
      fetch={(queryParams?: Record<string, any>) => fetchCustomers(queryParams)}
      loading={loading}
      pagination={pagination}
    />
  );
};
