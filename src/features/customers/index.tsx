import React, { useState } from "react";
import { Modal } from "antd";
import { TransactorListComponent } from "../../components/common/transactor/transactor-listing";
import {
  createCustomerApi,
  deleteCustomerApi,
  getCustomersApi,
  updateCustomerApi,
} from "../../services/customers.services";
import { CustomerImport } from "../customer/customer-import";
import { notification } from "antd";
import { buildQueryString } from "../../utils";

interface Customer {
  id: string;
  name: string;
  personName: string;
  address?: string;
  contactNumber?: string;
  code: string;
  email?: string;
  openingBalance: number;
  openingBalanceDate: string;
  status: boolean;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

export const CustomerComponent: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    nextPage: null,
    prevPage: null,
  });

  const handleAddCustomer = async (values: Partial<Customer>) => {
    try {
      const response = await createCustomerApi(values);
      if (response?.success) {
        notification.success({ message: response?.message });
        setCustomers((prev) => [...prev, response?.data]);
      } else notification.error({ message: response?.message });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      notification.error({ message: errorMessage });
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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      notification.error({ message: errorMessage });
    }
  };

  const handleEditCustomer = async (id: string, values: Partial<Customer>) => {
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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      notification.error({ message: errorMessage });
    }
  };

  const fetchCustomers = async (queryParams: Record<string, unknown> = {}) => {
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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      notification.error({
        message: "Error",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImportComplete = (result: ImportResult) => {
    if (result.success > 0) {
      // Refresh the customer list after successful import
      fetchCustomers();
    }
    setImportModalVisible(false);
  };

  return (
    <>
      <TransactorListComponent
        entityType="customer"
        entities={customers}
        onAddTransactor={async (values) => handleAddCustomer(values)}
        onDeleteTransactor={handleDeleteCustomer}
        onEditTransactor={async (id, values) => handleEditCustomer(id, values)}
        onImport={() => setImportModalVisible(true)}
        fetch={(queryParams?: Record<string, unknown>) =>
          fetchCustomers(queryParams)
        }
        loading={loading}
        pagination={pagination}
      />

      <Modal
        title="Import Customers"
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        footer={null}
        width={800}
      >
        <CustomerImport onImportComplete={handleImportComplete} />
      </Modal>
    </>
  );
};
