import { LeftOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Typography,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import useItemManagerColumns from "../../hooks/formulation-columns.hook";
import { formatCurrency } from "../../utils";
import { useNavigate, useParams } from "react-router-dom";
import {
  createFormulationApi,
  getFormulationApi,
  updateFormulationApi,
} from "../../services/formulation.services";
import { getInventories } from "../../apis";
import { getByTypeUnderTopLevel } from "../../services/charts-of-accounts.services";
import { ACCOUNT_TYPE } from "../charts-of-accounts/utils";
import ItemManager from "../../components/common/item-manager/item-manager";

const { Title } = Typography;

const AddEditFormulation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inventoryItems, setInventoryItems] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [formulation, setFormulation] = useState();
  const [expenses, setExpenses] = useState([]);
  const [finishedGoods, setFinishedGoods] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();
  const {
    finishedGoodsColumns,
    rawMaterialsColumns,
    expensesColumns,
    handleItemChange,
    calculateAmount,
  } = useItemManagerColumns(form.getFieldValue("rmFactor"));

  const rmFactor = Form.useWatch("rmFactor", form) || 1;
  const isEditing = !!id;
  console.log("id", id);

  useEffect(() => {
    const recalculateQtyRequired = (items, setItems) => {
      if (items.length > 0) {
        const updatedItems = items.map((item) => ({
          ...item,
          qtyRequired:
            item.perUnit !== undefined && item.perUnit !== null
              ? rmFactor * item.perUnit
              : item.qtyRequired,
        }));
        setItems(updatedItems);
      }
    };

    const recalculateFinishedGoods = (items, setItems) => {
      if (items.length > 0) {
        const totalQuantity = items.reduce(
          (sum, item) =>
            sum +
            ((item.qtyFiPercent !== undefined
              ? (item.qtyFiPercent / 100) * rmFactor
              : 0) || 0),
          0
        );

        const updatedItems = items.map((item) => {
          const updatedQuantity =
            item.qtyFiPercent !== undefined && item.qtyFiPercent !== null
              ? (item.qtyFiPercent / 100) * rmFactor
              : item.quantity;

          const baseQty =
            updatedQuantity !== undefined &&
            item.unit &&
            item.multiUnits &&
            item.multiUnits[item.unit] !== undefined
              ? updatedQuantity * item.multiUnits[item.unit]
              : updatedQuantity;

          const costFiPercent =
            totalQuantity > 0 ? (updatedQuantity / totalQuantity) * 100 : 0;

          return {
            ...item,
            quantity: updatedQuantity,
            baseQuantity: baseQty,
            costFiPercent,
          };
        });

        setItems(updatedItems);
      }
    };

    recalculateQtyRequired(ingredients, setIngredients);
    recalculateQtyRequired(expenses, setExpenses);
    recalculateFinishedGoods(finishedGoods, setFinishedGoods);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rmFactor]);

  useEffect(() => {
    const fetchFormulation = async (id: string) => {
      try {
        setLoading(true);
        const response = await getFormulationApi(id);
        if (response?.success) {
          setFormulation(response?.data);

          // Map products (finished goods)
          setFinishedGoods(
            (response?.data?.products || []).map((item) => ({
              ...item,
              id: item.product_id, // for table rowKey
              productId: item.product_id,
              quantity: item.quantityRequired,
            }))
          );

          // Map ingredients
          setIngredients(
            (response?.data?.ingredients || []).map((item) => ({
              ...item,
              id: item.inventory_item_id,
              productId: item.inventory_item_id,
              qtyRequired: item.quantityRequired,
            }))
          );

          // Map expenses
          setExpenses(
            (response?.data?.expenses || []).map((item) => ({
              id: item.expense_account_id,
              expenseId: item.expense_account_id,
              ...item,
            }))
          );

          // Set form fields
          form.setFieldsValue({
            code: response?.data?.code,
            name: response?.data?.name,
            rmFactor: response?.data?.rmFactor,
          });
        } else {
          notification.error({
            message: "Error",
            description: response.message,
          });
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description: error,
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        const [invRes, expensesRes] = await Promise.all([
          getInventories(),
          getByTypeUnderTopLevel("Expenses", ACCOUNT_TYPE[3].value),
        ]);
        if (invRes?.success && expensesRes?.success) {
          setExpensesList(expensesRes?.data);
          setInventoryItems(invRes?.data);
        } else {
          notification.error({
            message: "Error",
            description: "Something went wrong",
          });
        }
      } catch (error) {
        notification.error({
          message: "Error",
          description: error,
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFormulation(id);
    fetchData();
  }, [id]);

  // After both formulation and available items are loaded, merge available item data into finishedGoods, ingredients, and expenses
  useEffect(() => {
    if (
      !formulation ||
      inventoryItems.length === 0 ||
      expensesList.length === 0
    )
      return;

    // Map products (finished goods)
    setFinishedGoods(
      (formulation.products || []).map((item: any) => {
        const available = inventoryItems.find(
          (i: any) => i.id === item.product_id
        );
        return {
          ...available,
          ...item,
          quantity: item.quantityRequired,
        };
      })
    );

    // Map ingredients
    setIngredients(
      (formulation.ingredients || []).map((item: any) => {
        const available = inventoryItems.find(
          (i: any) => i.id === item.inventory_item_id
        );
        return {
          ...available,
          ...item,
          qtyRequired: item.quantityRequired,
        };
      })
    );

    // Map expenses
    setExpenses(
      (formulation.expenses || []).map((item: any) => {
        const available = expensesList.find(
          (i: any) => i.id === item.expense_account_id
        );
        return {
          ...available,
          ...item,
          qtyRequired: item.quantityRequired,
        };
      })
    );

    // Set form fields
    form.setFieldsValue({
      code: formulation.code,
      name: formulation.name,
      rmFactor: formulation.rmFactor,
    });
  }, [formulation, inventoryItems, expensesList, form]);

  const onClose = () => navigate(-1);

  const finishedGoodsItems = inventoryItems.filter(
    (item) =>
      item.category === "Finished Goods" ||
      item.category === "Semi-Finished Goods"
  );
  const rawMaterialItems = inventoryItems.filter(
    (item) => item.category === "Raw Material"
  );

  // Calculate total cost from ingredients and expenses
  const ingredientsCost = ingredients.reduce(
    (sum, ing) =>
      sum +
      parseFloat(ing.qtyRequired) * parseFloat(ing.amount / ing.quantity || 0),
    0
  );
  const expensesCost = expenses.reduce(
    (sum, exp) => sum + calculateAmount(exp),
    0
  );
  const totalCost = ingredientsCost + expensesCost;

  const onFinish = async (values: any) => {
    if (finishedGoods.length === 0) {
      message.error("Please add at least one finished product");
      return;
    }
    if (ingredients.length === 0) {
      message.error("Please add at least one ingredient");
      return;
    }

    const productsPayload = finishedGoods.map((item) => ({
      product_id: parseInt(item.productId ?? item.id),
      description: item.description || "",
      qtyFiPercent: parseFloat(item.qtyFiPercent) || 0,
      unit: item.unit || "",
      costFiPercent: parseFloat(item.costFiPercent) || 0,
      baseQuantity: parseFloat(item.baseQuantity) || 0,
      quantityRequired: parseFloat(item.quantity) || 0,
    }));

    const ingredientsPayload = ingredients.map((item) => ({
      inventory_item_id: parseInt(item.productId ?? item.id),
      description: item.description || "",
      quantityRequired: parseFloat(item.qtyRequired) || 0,
      perUnit: parseFloat(item.perUnit) || 0,
      unit: item.unit || "",
    }));

    const expensesPayload = expenses.map((item) => ({
      expense_account_id: parseInt(item.expenseId ?? item.id),
      quantityRequired: parseFloat(item.qtyRequired) || 0,
      details: item.details || "",
      perUnit: parseFloat(item.perUnit) || 0,
      amount: parseFloat(item.amount) || 0,
    }));

    const payload = {
      code: values.code,
      name: values.name,
      rmFactor: parseFloat(values.rmFactor) || 1,
      products: productsPayload,
      ingredients: ingredientsPayload,
      expenses: expensesPayload,
      totalCost,
    };

    try {
      let response;
      if (isEditing) {
        response = await updateFormulationApi(id, payload);
      } else {
        response = await createFormulationApi(payload);
      }
      if (response?.success) {
        notification.success({
          message: "Success",
          description: response?.message,
        });
        navigate("/formulations");
      } else {
        notification.error({
          message: "Error",
          description: response?.message,
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error?.message,
      });
    }
  };

  return (
    <div className="p-8 mx-2">
      <Space className="mb-6">
        <Button onClick={onClose} icon={<LeftOutlined />}></Button>
        <Title level={3} style={{ margin: 0 }}>
          {isEditing ? "Edit Formulation" : "Add New Formulation"}
        </Title>
      </Space>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Formulation Code"
              name="code"
              rules={[
                { required: true, message: "Formulation code is required" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Formulation Name"
              name="name"
              rules={[
                { required: true, message: "Formulation name is required" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="RM Factor"
              name="rmFactor"
              initialValue={1}
              rules={[{ required: true, message: "RM Factor is required" }]}
            >
              <InputNumber />
            </Form.Item>
          </Col>
        </Row>

        <ItemManager
          title="Final Goods"
          items={finishedGoods}
          availableItems={finishedGoodsItems}
          columns={finishedGoodsColumns}
          onItemsChange={handleItemChange(finishedGoods, setFinishedGoods)}
          selectPlaceholder="Select Finished/Semi-Finished Product"
          addButtonText="Add Product"
          emptyText="No products added"
          showTotalCost
          disabled={loading}
        />

        <ItemManager
          title="Recipe Ingredients"
          items={ingredients}
          availableItems={rawMaterialItems}
          columns={rawMaterialsColumns}
          onItemsChange={handleItemChange(ingredients, setIngredients)}
          selectPlaceholder="Select Raw Material"
          addButtonText="Add Ingredient"
          emptyText="No ingredients added"
          disabled={loading}
          showTotalCost
        />

        <ItemManager
          title="Expenses"
          items={expenses}
          availableItems={expensesList}
          columns={expensesColumns}
          onItemsChange={handleItemChange(expenses, setExpenses)}
          selectPlaceholder="Select Expenses"
          addButtonText="Add Expense"
          disabled={loading}
          emptyText="No expenses added"
          showTotalCost
        />

        <Card>
          <Space direction="vertical" size="small">
            <Title level={5}>
              Total Formulation Cost: {formatCurrency(totalCost)}
            </Title>
          </Space>
        </Card>

        <Space className="mt-6">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            {isEditing ? "Update" : "Save"}
          </Button>
        </Space>
      </Form>
    </div>
  );
};

export default AddEditFormulation;
