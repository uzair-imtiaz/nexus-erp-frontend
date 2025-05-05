import { useEffect, useState } from "react";
import { Button, notification } from "antd";
import {
  getBanks,
  createBank,
  updateBank,
  deleteBank,
} from "../../services/bank-services";
import { BankTable } from "./bank-listing";
import { BankFormModal } from "./bank-form";

const BanksPage = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingBank, setEditingBank] = useState(null);

  const fetchBanks = async () => {
    setLoading(true);
    try {
      const res = await getBanks();
      setBanks(res.data);
    } catch {
      notification.error({ message: "Failed to fetch banks" });
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
        await updateBank(editingBank.id, data);
        notification.success({ message: "Bank updated successfully" });
      } else {
        await createBank(data);
        notification.success({ message: "Bank created successfully" });
      }
      fetchBanks();
      setModalVisible(false);
      setEditingBank(null);
    } catch {
      notification.error({ message: "Operation failed" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBank(id);
      notification.success({ message: "Bank deleted" });
      fetchBanks();
    } catch {
      notification.error({ message: "Failed to delete bank" });
    }
  };

  const handleEdit = (bank: any) => {
    setEditingBank(bank);
    setModalVisible(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Banks</h2>
        <Button
          type="primary"
          onClick={() => {
            setEditingBank(null);
            setModalVisible(true);
          }}
        >
          Add New Bank
        </Button>
      </div>

      <BankTable
        data={banks}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
