import { Button, Input, Modal, notification, Space } from "antd";
import { useEffect, useState } from "react";
import {
  createBank,
  deleteBank,
  getBanks,
  updateBank,
} from "../../services/bank-services";
import { BankFormModal } from "./bank-form";
import { BankImport } from "./bank-import";
import { BankTable } from "./bank-listing";
import { buildQueryString } from "../../utils";
import {
  DownloadOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";

interface Bank {
  id: string;
  name: string;
  accountNumber: string;
  iban: string;
  code: string;
  currentBalance: number;
  openingDate: string;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

const BanksPage = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    nextPage: null,
    prevPage: null,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBanks = async (queryParams: Record<string, unknown> = {}) => {
    try {
      setLoading(true);
      const queryString = buildQueryString(queryParams);
      const response = await getBanks(queryString);

      if (!response.success) {
        return notification.error({
          message: "Error",
          description: response.message,
        });
      }

      setBanks(response.data);
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

  useEffect(() => {
    fetchBanks();
  }, []);

  const handleCreateOrUpdate = async (data: Partial<Bank>) => {
    setSubmitting(true);
    try {
      if (editingBank) {
        const response = await updateBank(editingBank.id, data);
        if (response?.success) {
          notification.success({ message: response.message });
          const updatedBanks = banks.map((bank) => {
            if (bank.id === editingBank?.id) {
              return response.data;
            }
            return bank;
          });
          setBanks(updatedBanks);
        }
      } else {
        const response = await createBank(data);
        if (!response.success) {
          notification.error({ message: response.message });
          return;
        }
        notification.success({ message: response.message });
        setBanks([...banks, response.data]);
      }
      // fetchBanks();
      setModalVisible(false);
      setEditingBank(null);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      notification.error({ message: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteBank(id);
      if (!response.success) {
        notification.error({ message: response.message });
        return;
      }
      notification.success({ message: response.message });
      const updatedBanks = banks.filter((bank) => bank.id !== id);
      setBanks(updatedBanks);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      notification.error({ message: errorMessage });
    }
  };

  const handleSearch = async (value: string) => {
    try {
      if (!value) return;
      fetchBanks({ name: value });
    } catch (error: unknown) {
      console.log(error);
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      notification.error({
        message: "Error",
        description: errorMessage,
      });
    }
  };

  const handleEdit = (bank: Bank) => {
    setEditingBank(bank);
    setModalVisible(true);
  };

  const handleImportComplete = (result: ImportResult) => {
    if (result.success > 0) {
      // Refresh the bank list after successful import
      fetchBanks();
    }
    setImportModalVisible(false);
  };

  return (
    <div className="space-y-6">
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
        direction="horizontal"
      >
        <Space wrap>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 250 }}
            onPressEnter={() => handleSearch(searchTerm)}
          />
        </Space>
        <Space wrap>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingBank(null);
              setModalVisible(true);
            }}
          >
            Add New Bank
          </Button>
          {/* <Button icon={<DownloadOutlined />}>Export</Button> */}
          <Button
            icon={<UploadOutlined />}
            onClick={() => setImportModalVisible(true)}
          >
            Import
          </Button>
        </Space>
      </Space>

      <BankTable
        data={banks}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pagination={pagination}
        fetchItems={fetchBanks}
      />

      {modalVisible && (
        <BankFormModal
          visible={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingBank(null);
          }}
          onSubmit={handleCreateOrUpdate}
          loading={submitting}
          initialValues={editingBank}
        />
      )}

      <Modal
        title="Import Banks"
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        footer={null}
        width={800}
      >
        <BankImport onImportComplete={handleImportComplete} />
      </Modal>
    </div>
  );
};

export default BanksPage;
