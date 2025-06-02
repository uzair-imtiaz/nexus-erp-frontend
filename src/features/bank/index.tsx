import { Button, Input, notification, Space } from "antd";
import { useEffect, useState } from "react";
import {
  createBank,
  deleteBank,
  getBanks,
  updateBank,
} from "../../services/bank.services";
import { BankFormModal } from "./bank-form";
import { BankTable } from "./bank-listing";
import { buildQueryString } from "../../utils";
import {
  DownloadOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const BanksPage = () => {
  const [banks, setBanks] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingBank, setEditingBank] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    nextPage: null,
    prevPage: null,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBanks = async (queryParams: Record<string, any> = {}) => {
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
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const handleCreateOrUpdate = async (data: any) => {
    setSubmitting(true);
    try {
      if (editingBank) {
        const response = await updateBank(editingBank.id, data);
        if (response?.success) {
          notification.success({ message: response.message });
          const updatedBanks = banks.map((bank) => {
            if (bank.id === editingBank.id) {
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
    } catch (error: any) {
      notification.error({ message: error.message });
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
    } catch (error: any) {
      notification.error({ message: error.message });
    }
  };

  const handleSeach = async (value: string) => {
    try {
      if (!value) return;
      fetchBanks({ name: value });
    } catch (error: any) {
      console.log(error);
      notification.error({
        message: "Error",
        description: error?.message,
      });
    }
  };

  const handleEdit = (bank: any) => {
    setEditingBank(bank);
    setModalVisible(true);
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
            onPressEnter={() => handleSeach(searchTerm)}
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
          <Button icon={<DownloadOutlined />}>Export</Button>
          <Button icon={<UploadOutlined />}>Import</Button>
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
    </div>
  );
};

export default BanksPage;
