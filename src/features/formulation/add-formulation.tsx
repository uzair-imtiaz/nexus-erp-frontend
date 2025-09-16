import { LeftOutlined } from "@ant-design/icons";
import { Button, Space, Spin, Typography, message, notification } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormulationEditor from "../../components/common/formulation-editor/formulation-editor";
import { useInventoryAndExpenses } from "../../hooks/useExpensesAndInventory.hook";
import { getCodeApi } from "../../services/common.services";
import {
  createFormulationApi,
  getFormulationApi,
  updateFormulationApi,
} from "../../services/formulation.services";
import {
  buildExpensesPayload,
  buildIngredientsPayload,
  buildProductsPayload,
  buildQueryString,
} from "../../utils";

const { Title } = Typography;

const AddEditFormulation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formulation, setFormulation] = useState<any>();
  const [finishedGoods, setFinishedGoods] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [rmFactor, setRmFactor] = useState(1);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const { inventoryItems, expensesList, loading } = useInventoryAndExpenses();
  const isEditing = !!id;

  useEffect(() => {
    const fetchFormulation = async (id: string) => {
      try {
        setFetchLoading(true);
        const response = await getFormulationApi(id);
        if (response?.success) {
          setFormulation(response.data);
        } else {
          notification.error({
            message: "Error",
            description: response.message,
          });
        }
      } catch (err) {
        notification.error({
          message: "Error",
          description: String(err),
        });
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) fetchFormulation(id);
    else {
      // prepopulate code for new formulations
      const getCode = async () => {
        const query = buildQueryString({ entity: "FORMULATION" });
        const response = await getCodeApi(query);
        setFormulation({ code: response.data.code, rmFactor: 1 });
      };
      getCode();
    }
  }, [id]);

  const onClose = () => navigate(-1);

  const handleSave = async () => {
    if (finishedGoods.length === 0) {
      message.error("Please add at least one finished product");
      return;
    }
    if (ingredients.length === 0) {
      message.error("Please add at least one ingredient");
      return;
    }

    const payload = {
      code: formulation?.code,
      name: formulation?.name,
      rmFactor: parseFloat(rmFactor) || 1,
      products: buildProductsPayload(finishedGoods),
      ingredients: buildIngredientsPayload(ingredients),
      expenses: buildExpensesPayload(expenses),
      totalCost,
    };

    try {
      setSubmitLoading(true);
      const response = isEditing
        ? await updateFormulationApi(id, payload)
        : await createFormulationApi(payload);

      if (response?.success) {
        notification.success({
          message: "Success",
          description: response.message,
        });
        navigate("/formulations");
      } else {
        notification.error({
          message: "Error",
          description: response.message,
        });
      }
    } catch (err) {
      notification.error({
        message: "Error",
        description: String(err),
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Spin spinning={fetchLoading}>
      <div className="p-8 mx-2">
        <Space className="mb-6">
          <Button onClick={onClose} icon={<LeftOutlined />}></Button>
          <Title level={3} style={{ margin: 0 }}>
            {isEditing ? "Edit Formulation" : "Add New Formulation"}
          </Title>
        </Space>

        <FormulationEditor
          initialData={formulation}
          inventoryItems={inventoryItems}
          expensesList={expensesList}
          showHeader={true}
          loading={loading}
          onChange={({
            finishedGoods,
            ingredients,
            expenses,
            totalCost,
            rmFactor,
          }) => {
            setFinishedGoods(finishedGoods);
            setIngredients(ingredients);
            setExpenses(expenses);
            setTotalCost(totalCost);
            setRmFactor(rmFactor);
          }}
        />

        <Space className="mt-6">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" loading={submitLoading} onClick={handleSave}>
            {isEditing ? "Update" : "Save"}
          </Button>
        </Space>
      </div>
    </Spin>
  );
};

export default AddEditFormulation;
