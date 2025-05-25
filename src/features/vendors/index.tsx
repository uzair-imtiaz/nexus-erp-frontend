import React, { useState } from "react";
import { TransactorListComponent } from "../../components/common/transactor/transactor-listing";
import {
  createVendorApi,
  deleteVendorApi,
  getVendorsApi,
  updateVendorApi,
} from "../../services/vendors.services";
import { notification } from "antd";
import { buildQueryString } from "../../utils";

export const VendorComponent: React.FC = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    nextPage: null,
    prevPage: null,
  });

  const handleAddVendor = async (values) => {
    try {
      const response = await createVendorApi(values);
      if (response?.success) {
        notification.success({ message: response?.message });
        setVendors((prev) => [...prev, response?.data]);
      } else notification.error({ message: response?.message });
    } catch (error: any) {
      notification.error({ message: error.message });
    }
  };

  const handleDeleteVendor = async (id: string) => {
    try {
      const response = await deleteVendorApi(id);
      if (response?.success) {
        notification.success({ message: response?.message });
        setVendors(vendors.filter((vendor) => vendor.id !== id));
      } else {
        notification.error({ message: response?.message });
      }
    } catch (error: any) {
      notification.error({ message: error.message });
    }
  };

  const handleEditVendor = async (id, values) => {
    try {
      const response = await updateVendorApi(id, values);
      if (response?.success) {
        notification.success({ message: response?.message });
        setVendors((prev) =>
          prev.map((vendor) => (vendor.id === id ? response?.data : vendor))
        );
      } else notification.error({ message: response?.message });
    } catch (error: any) {
      notification.error({ message: error.message });
    }
  };

  const fetchVendors = async (queryParams: Record<string, any> = {}) => {
    try {
      setLoading(true);
      const queryString = buildQueryString(queryParams);
      const response = await getVendorsApi(queryString);

      if (!response.success) {
        return notification.error({
          message: "Error",
          description: response.message,
        });
      }

      setVendors(response.data);
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
      entityType="vendor"
      entities={vendors}
      onAddTransactor={async (values) => handleAddVendor(values)}
      onDeleteTransactor={handleDeleteVendor}
      onEditTransactor={async (id, values) => handleEditVendor(id, values)}
      fetch={(queryParams?: Record<string, any>) => fetchVendors(queryParams)}
      loading={loading}
      pagination={pagination}
    />
  );
};
