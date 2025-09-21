import React, { useState } from "react";
import { Modal } from "antd";
import { TransactorListComponent } from "../../components/common/transactor/transactor-listing";
import {
  createVendorApi,
  deleteVendorApi,
  getVendorsApi,
  updateVendorApi,
} from "../../services/vendors.services";
import { VendorImport } from "../vendor/vendor-import";
import { notification } from "antd";
import { buildQueryString } from "../../utils";

interface Vendor {
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

export const VendorComponent: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
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

  const handleAddVendor = async (values: Partial<Vendor>) => {
    try {
      const response = await createVendorApi(values);
      if (response?.success) {
        notification.success({ message: response?.message });
        setVendors((prev) => [...prev, response?.data]);
      } else notification.error({ message: response?.message });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      notification.error({ message: errorMessage });
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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      notification.error({ message: errorMessage });
    }
  };

  const handleEditVendor = async (id: string, values: Partial<Vendor>) => {
    try {
      const response = await updateVendorApi(id, values);
      if (response?.success) {
        notification.success({ message: response?.message });
        setVendors((prev) =>
          prev.map((vendor) => (vendor.id === id ? response?.data : vendor))
        );
      } else notification.error({ message: response?.message });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      notification.error({ message: errorMessage });
    }
  };

  const fetchVendors = async (queryParams: Record<string, unknown> = {}) => {
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
      // Refresh the vendor list after successful import
      fetchVendors();
    }
    setImportModalVisible(false);
  };

  return (
    <>
      <TransactorListComponent
        entityType="vendor"
        entities={vendors}
        onAddTransactor={async (values) => handleAddVendor(values)}
        onDeleteTransactor={handleDeleteVendor}
        onEditTransactor={async (id, values) => handleEditVendor(id, values)}
        onImport={() => setImportModalVisible(true)}
        fetch={(queryParams?: Record<string, unknown>) =>
          fetchVendors(queryParams)
        }
        loading={loading}
        pagination={pagination}
      />

      <Modal
        title="Import Vendors"
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        footer={null}
        width={800}
      >
        <VendorImport onImportComplete={handleImportComplete} />
      </Modal>
    </>
  );
};
