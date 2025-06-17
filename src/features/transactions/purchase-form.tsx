import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import TransactionForm from "../../components/common/transaction/transaction-form";
import { useEffect, useState } from "react";
import {
  addPurchaseApi,
  getPurchaseApi,
} from "../../services/purchase.services";
import { notification } from "antd";
import { getVendorsApi } from "../../services/vendors.services";
import { getInventories } from "../../apis";

const PurchaseForm = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [purchase, setPurchase] = useState();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [inventory, setInventory] = useState([]);

  const navigate = useNavigate();

  const fetchVendors = async () => {
    try {
      const response = await getVendorsApi("");
      if (response?.success) {
        setVendors(response?.data);
      } else {
        notification.error({
          message: "Error",
          description: response.message,
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error?.message,
      });
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await getInventories("");
      if (response?.success) {
        setInventory(response?.data);
      } else {
        notification.error({
          message: "Error",
          description: response.message,
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error?.message,
      });
    }
  };

  useEffect(() => {
    const fetchPurchase = async (id: string) => {
      try {
        setLoading(true);
        const response = await getPurchaseApi(id);
        if (response?.success) {
          setPurchase(response?.data);
        } else {
          notification.error({
            message: "Error",
            description: response.message,
          });
        }
      } catch (error: any) {
        notification.error({
          message: "Error",
          description: error?.message,
        });
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
    fetchInventory();
    if (id) {
      fetchPurchase(id);
    }
  }, [id]);

  const handlePurchaseSubmit = async (data: any) => {
    try {
      setSubmitLoading(true);
      const { entity, type, ...rest } = data;
      const payload = {
        ...rest,
        vendorId: entity,
        type: type.includes("return") ? "RETURN" : "PURCHASE",
      };
      const response = await addPurchaseApi(payload);
      if (response?.success) {
        notification.success({
          message: "Success",
          description: response.message,
        });
        navigate("/transactions#purchases");
      } else {
        notification.error({
          message: "Error",
          description: response.message,
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error?.message,
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const transactionType = searchParams.get("type") || "purchase";

  return (
    <TransactionForm
      transaction={purchase}
      submitLoading={submitLoading}
      type={transactionType as "purchase" | "purchase-return"}
      onSave={handlePurchaseSubmit}
      loading={loading}
      parties={vendors}
      inventory={inventory}
    />
  );
};

export default PurchaseForm;
