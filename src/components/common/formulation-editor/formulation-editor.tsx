// FormulationEditor.tsx  (replace your current file)
import {
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Typography,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import useItemManagerColumns from "../../../hooks/formulation-columns.hook";
import {
  formatCurrency,
  mapExpenses,
  mapFinishedGoods,
  mapIngredients,
} from "../../../utils";
import ItemManager from "../item-manager/item-manager";

const { Title } = Typography;

interface FormulationEditorProps {
  initialData?: any;
  inventoryItems: any[];
  expensesList: any[];
  loading: boolean;
  batchSize?: number;
  repetition?: number;
  onChange?: (data: {
    finishedGoods: any[];
    ingredients: any[];
    expenses: any[];
    totalCost: number;
    rmFactor: number;
  }) => void;
  showHeader?: boolean;
}

const FormulationEditor: React.FC<FormulationEditorProps> = ({
  initialData,
  inventoryItems,
  expensesList,
  onChange,
  batchSize = 1,
  repetition = 1,
  showHeader = true,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [finishedGoods, setFinishedGoods] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);

  const {
    finishedGoodsColumns,
    rawMaterialsColumns,
    expensesColumns,
    handleItemChange,
    calculateAmount,
  } = useItemManagerColumns(form.getFieldValue("rmFactor"));

  const rmFactor = Form.useWatch("rmFactor", form) || 1;

  // track whether we've initialized from a particular initialData id
  const initializedForIdRef = useRef<string | number | null>(null);

  // Initialize from initialData ONCE per initialData.id (defensive)
  useEffect(() => {
    if (!initialData || loading) return;

    const id = initialData?.id ?? initialData?.code ?? null;
    // if same id already initialized, skip (prevents overwriting on inventory/expenses updates)
    if (id && initializedForIdRef.current === id) return;

    // Defensive mapping: always pass arrays and deep clone to avoid shared references
    const mappedFinished = mapFinishedGoods(
      initialData.products ?? [],
      inventoryItems ?? []
    );
    const mappedIngredients = mapIngredients(
      initialData.ingredients ?? [],
      inventoryItems ?? []
    );
    const mappedExpenses = mapExpenses(
      initialData.expenses ?? [],
      expensesList ?? []
    );

    setFinishedGoods(
      Array.isArray(mappedFinished) ? mappedFinished.map((i) => ({ ...i })) : []
    );
    setIngredients(
      Array.isArray(mappedIngredients)
        ? mappedIngredients.map((i) => ({ ...i }))
        : []
    );
    setExpenses(
      Array.isArray(mappedExpenses) ? mappedExpenses.map((i) => ({ ...i })) : []
    );

    // set header fields
    const rm = initialData.rmFactor ?? 1;
    if (showHeader) {
      form.setFieldsValue({
        code: initialData.code,
        name: initialData.name,
        rmFactor: rm,
      });
    } else {
      form.setFieldsValue({
        rmFactor: rm,
      });
    }

    if (id) initializedForIdRef.current = id;
    // intentionally only depend on initialData identity — don't re-run when inventoryItems/expensesList update
  }, [initialData, form, showHeader, loading]);

  // Recalculate quantities when rmFactor changes — but don't overwrite arrays if they're empty already
  useEffect(() => {
    setIngredients((prev) => {
      if (!Array.isArray(prev) || prev.length === 0) return prev;
      return prev.map((item) => {
        const baseQty =
          item.perUnit !== undefined && item.perUnit !== null
            ? rmFactor * item.perUnit
            : item.qtyRequired;

        return {
          ...item,
          qtyRequired: baseQty * batchSize,
        };
      });
    });

    setExpenses((prev) => {
      if (!Array.isArray(prev) || prev.length === 0) return prev;
      return prev.map((item) => {
        const baseQty =
          item.perUnit !== undefined && item.perUnit !== null
            ? rmFactor * item.perUnit
            : item.qtyRequired;

        return {
          ...item,
          qtyRequired: baseQty * batchSize,
        };
      });
    });

    setFinishedGoods((prev) => {
      if (!Array.isArray(prev) || prev.length === 0) return prev;

      const totalQuantity = prev.reduce(
        (sum, item) =>
          sum +
          ((item.qtyFiPercent !== undefined
            ? (item.qtyFiPercent / 100) * rmFactor
            : 0) || 0) *
            batchSize,
        0
      );

      return prev.map((item) => {
        const updatedQuantity =
          item.qtyFiPercent !== undefined && item.qtyFiPercent !== null
            ? (item.qtyFiPercent / 100) * rmFactor * batchSize
            : item.quantity * batchSize;

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
    });
  }, [rmFactor, batchSize]); // 🔑 add dependencies

  // Compute costs and push up
  useEffect(() => {
    const ingredientsCost = (ingredients || []).reduce(
      (sum, ing) =>
        sum + parseFloat(ing.qtyRequired || 0) * parseFloat(ing.baseRate || 0),
      0
    );
    const expensesCost = (expenses || []).reduce(
      (sum, exp) => sum + calculateAmount(exp),
      0
    );
    const totalCost = ingredientsCost + expensesCost;

    onChange?.({
      finishedGoods,
      ingredients,
      expenses,
      totalCost,
      rmFactor,
    });
    // we do want to call this whenever the arrays or rmFactor change
  }, [
    finishedGoods,
    ingredients,
    expenses,
    rmFactor,
    calculateAmount,
    onChange,
  ]);

  const finishedGoodsItems = (inventoryItems || []).filter(
    (i) =>
      i.category === "Finished Goods" || i.category === "Semi-Finished Goods"
  );
  const rawMaterialItems = (inventoryItems || []).filter(
    (i) => i.category === "Raw Material"
  );

  return (
    <Form form={form} layout="vertical">
      {showHeader && (
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Formulation Code"
              name="code"
              rules={[
                { required: true, message: "Formulation code is required" },
              ]}
            >
              <Input placeholder="Enter formulation code" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Formulation Name (Optional)" name="name">
              <Input placeholder="Enter formulation name" />
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
      )}

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
        emptyText="No expenses added"
        showTotalCost
      />

      <Card>
        <Space direction="vertical" size="small">
          <Title level={5}>
            Total Formulation Cost:{" "}
            {formatCurrency(
              (ingredients || []).reduce(
                (sum, ing) =>
                  sum +
                  parseFloat(ing.qtyRequired || 0) *
                    parseFloat(ing.baseRate || 0),
                0
              ) +
                (expenses || []).reduce(
                  (sum, exp) => sum + calculateAmount(exp),
                  0
                )
            )}
          </Title>
        </Space>
      </Card>
    </Form>
  );
};

export default FormulationEditor;
