import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import TransactionForm from "../../components/common/transaction/transaction-form";
import { useEffect, useState } from "react";
import { addSaleApi, getSaleApi } from "../../services/sales.services";
import { notification } from "antd";
import { getCustomersApi } from "../../services/customers.services";
import { getInventories } from "../../apis";

const SaleForm = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [sale, setSale] = useState();
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [inventory, setInventory] = useState([]);

  const transactionType = searchParams.get("type") || "sale";

  const navigate = useNavigate();
  const fetchCustomers = async () => {
    try {
      const response = await getCustomersApi();
      if (response?.success) {
        setCustomers(response?.data);
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
    const fetchSale = async (id: string) => {
      try {
        setLoading(true);
        const response = await getSaleApi(id);
        if (response?.success) {
          setSale(response?.data);
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
    fetchCustomers();
    fetchInventory();
    if (id) {
      fetchSale(id);
    }
  }, [id]);

  const handleSaleSubmit = async (data: any) => {
    try {
      setSubmitLoading(true);
      const { entity, type, ...rest } = data;
      const payload = {
        ...rest,
        customerId: entity,
        type: type.includes("return") ? "RETURN" : "SALE",
      };
      const response = await addSaleApi(payload);
      if (response?.success) {
        notification.success({
          message: "Success",
          description: response.message,
        });
        navigate("/transactions#sales");
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

  return (
    <TransactionForm
      transaction={sale}
      submitLoading={submitLoading}
      type={transactionType as "sale" | "sale-return"}
      onSave={handleSaleSubmit}
      loading={loading}
      parties={customers}
      inventory={inventory}
    />
  );
};

export default SaleForm;
