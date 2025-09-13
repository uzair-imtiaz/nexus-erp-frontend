import { useMemo } from "react";
import { formatCurrency } from "../utils";

const useItemManagerColumns = (rmFactor) => {
  // Finished Goods columns
  const finishedGoodsColumns = useMemo(
    () => [
      {
        title: "Product / Services",
        dataIndex: "id",
        key: "productId",
        editable: true,
        inputType: "select",
        placeholder: "Select Product",
        showUnit: true,
        width: "20%",
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        editable: true,
        inputType: "text",
        placeholder: "Enter description",
      },
      {
        title: "QTY FI %",
        dataIndex: "qtyFiPercent",
        key: "qtyFiPercent",
        editable: true,
        inputType: "number",
        min: 0,
        step: 0.01,
        precision: 2,
        defaultValue: 0.0,
      },
      {
        title: "Unit",
        dataIndex: "unit",
        key: "unit",
        editable: true,
        inputType: "select",
        placeholder: "Select Unit",
        getOptions: (record) => {
          return record
            ? Object.entries(record.multiUnits || {}).map(([key, value]) => ({
                label: `${key} ${value} (${record.baseUnit})`,
                value: key,
              }))
            : [];
        },
        render: (text, record) => record.unit || "-",
      },
      {
        title: "Qty",
        dataIndex: "quantity",
        key: "quantity",
        editable: true,
        inputType: "number",
        showTotal: true,
        min: 0,
        step: 0.01,
        precision: 2,
        defaultValue: 0.0,
      },
      {
        title: "Base Unit",
        dataIndex: "baseUnit",
        key: "baseUnit",
      },
      {
        title: "Cost FI %",
        dataIndex: "costFiPercent",
        key: "costFiPercent",
        editable: true,
        inputType: "number",
        disabled: true,
        showTotal: true,
        min: 0,
        step: 0.01,
        precision: 2,
        defaultValue: 0.0,
      },
      {
        title: "Base Qty",
        dataIndex: "baseQuantity",
        key: "baseQuantity",
        editable: true,
        inputType: "number",
        min: 0,
        step: 0.01,
        precision: 2,
        defaultValue: 0,
      },
    ],
    []
  );

  // Raw Materials columns
  const rawMaterialsColumns = useMemo(
    () => [
      {
        title: "Product / Services",
        dataIndex: "id",
        key: "productId",
        editable: true,
        inputType: "select",
        placeholder: "Select Product",
        showUnit: true,
        width: "20%",
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        editable: true,
        inputType: "text",
        placeholder: "Enter description",
      },
      {
        title: "Base Unit",
        dataIndex: "baseUnit",
        key: "baseUnit",
      },
      {
        title: "Stock in hand",
        dataIndex: "quantity",
        key: "quantity",
      },
      {
        title: "Per Unit",
        dataIndex: "perUnit",
        key: "perUnit",
        editable: true,
        inputType: "number",
        min: 0,
        step: 0.01,
        precision: 2,
        defaultValue: 1.0,
      },
      {
        title: "Qty required",
        dataIndex: "qtyRequired",
        key: "qtyRequired",
        editable: true,
        inputType: "number",
        min: 0,
        step: 0.01,
        precision: 2,
        defaultValue: 1,
      },
      {
        title: "Amount",
        dataIndex: "totalAmount",
        key: "totalAmount",
        render: (_: number, record) =>
          formatCurrency(
            parseFloat(record.qtyRequired) *
              parseFloat(
                record.baseRate || record.amount / record.quantity || 0
              )
          ),
      },
    ],
    [rmFactor]
  );

  // Non Stock (Expenses) columns
  const expensesColumns = useMemo(
    () => [
      {
        title: "Expense",
        dataIndex: "id",
        key: "expenseId",
        editable: true,
        inputType: "select",
        placeholder: "Select Expense",
        width: "20%",
      },
      {
        title: "Details",
        dataIndex: "details",
        key: "details",
        editable: true,
        inputType: "text",
        placeholder: "Enter details",
      },
      {
        title: "Per Unit",
        dataIndex: "perUnit",
        key: "perUnit",
        editable: true,
        inputType: "number",
        min: 0,
        step: 0.01,
        precision: 2,
        defaultValue: 1.0,
      },
      {
        title: "Rate",
        dataIndex: "debitAmount",
        key: "dbtAmount",
        render: (amount: number) => parseFloat(amount).toFixed(2),
      },
      {
        title: "Qty Required",
        dataIndex: "qtyRequired",
        key: "qtyRequired",
        editable: true,
        inputType: "number",
        min: 0,
        step: 0.01,
        precision: 2,
        defaultValue: 1.0,
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        render: (amount: number, record) =>
          formatCurrency(calculateAmount(record)),
      },
    ],
    [rmFactor]
  );

  // Helper function to calculate amounts
  const calculateAmount = (item) => {
    const qtyPerUnit = parseFloat(item.qtyPerUnit) || 1;
    const rate = parseFloat(item.debitAmount) || 0;
    const qtyRequired = parseFloat(item.qtyRequired) || 1;
    return qtyPerUnit * rate * qtyRequired;
  };

  const handleRawMaterialCalculations = (item, prevItem) => {
    let newItem = { ...item };

    if (item.hasOwnProperty("perUnit") && item.hasOwnProperty("qtyRequired")) {
      if (
        prevItem?.perUnit !== item?.perUnit &&
        prevItem?.qtyRequired === item?.qtyRequired
      ) {
        newItem.qtyRequired =
          parseFloat(rmFactor) * (parseFloat(item.perUnit) || 0);
      } else if (
        prevItem?.qtyRequired !== item?.qtyRequired &&
        prevItem?.perUnit === item?.perUnit
      ) {
        newItem.perUnit =
          (parseFloat(item.qtyRequired) || 0) / (parseFloat(rmFactor) || 1);
      } else {
        newItem.qtyRequired =
          parseFloat(rmFactor) * (parseFloat(item.perUnit) || 0);
      }
    }

    return newItem;
  };

  const handleFinishedGoodsCalculations = (item) => {
    const newItem = { ...item };
    if (item.qtyFiPercent) {
      newItem.quantity =
        (parseFloat(item.qtyFiPercent) / 100) * parseFloat(rmFactor);
    }
    if (newItem.quantity !== undefined) {
      newItem.baseQuantity =
        newItem.quantity * (parseFloat(item.multiUnits?.[newItem?.unit]) || 1);
    }

    return newItem;
  };

  const handleItemChange = (items, onItemsChange) => {
    return (updatedItems) => {
      // Calculate quantities for all items
      const itemsWithQuantities = updatedItems.map((item, idx) => {
        let newItem = { ...item };

        if (item.hasOwnProperty("perUnit")) {
          newItem = handleRawMaterialCalculations(item, items[idx]);
        }

        if (item.hasOwnProperty("qtyFiPercent")) {
          newItem = handleFinishedGoodsCalculations(newItem);
        }
        return newItem;
      });

      // Calculate total quantity and assign costFiPercent to ensure sum = 100
      const totalQuantity = itemsWithQuantities.reduce((sum, item) => {
        return item.quantity !== undefined && !isNaN(item.quantity)
          ? sum + parseFloat(item.quantity)
          : sum;
      }, 0);

      // Assign costFiPercent to each item
      const itemsWithCalculations = itemsWithQuantities.map((item) => {
        const newItem = { ...item };
        if (item.hasOwnProperty("qtyFiPercent")) {
          newItem.costFiPercent =
            totalQuantity > 0
              ? (parseFloat(item.quantity) / totalQuantity) * 100
              : 0;
        }
        return newItem;
      });

      onItemsChange(itemsWithCalculations);
    };
  };

  const getColumns = (type: "finishedGoods" | "rawMaterials" | "expenses") => {
    switch (type) {
      case "finishedGoods":
        return finishedGoodsColumns;
      case "rawMaterials":
        return rawMaterialsColumns;
      case "expenses":
        return expensesColumns;
      default:
        return [];
    }
  };

  return {
    finishedGoodsColumns,
    rawMaterialsColumns,
    expensesColumns,
    getColumns,
    calculateAmount,
    handleItemChange,
  };
};

export default useItemManagerColumns;
