import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Input,
  InputNumber,
  Popconfirm,
  Select,
  Table,
} from "antd";
import { formatCurrency } from "../../../utils";

const ItemManager = ({
  title = "Items",
  items = [],
  availableItems = [],
  onItemsChange,
  showTotalCost = true,
  className = "mb-6",
  disabled = false,
  columns = [],
  addButtonText = "Add More",
  emptyText = "No items added",
  minQuantity = 0.01,
  quantityStep = 0.01,
}) => {
  const handleCellChange = (value, recordId, dataIndex) => {
    let found = {};
    const updatedItems = items.map((item) => {
      if (item.id === recordId) {
        const updatedItem = { ...item, [dataIndex]: value };

        // Auto-calculate dependent fields if needed
        if (dataIndex === "quantity" || dataIndex === "rate") {
          const quantity =
            dataIndex === "quantity" ? value : item.quantity || 0;
          const rate = dataIndex === "rate" ? value : item.rate || 0;
          updatedItem.amount = quantity * rate;
        }
        if (dataIndex === "id") {
          found = availableItems.find((item) => item.id === value);
        }
        return { ...updatedItem, ...found };
      }
      return item;
    });

    onItemsChange?.(updatedItems);
  };

  const handleRemoveItem = (itemId) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    onItemsChange?.(updatedItems);
  };

  const handleAddItem = () => {
    // const baseItem = availableItems[0] ? { ...availableItems[0] } : {};
    const newItem = {};

    columns.forEach((col) => {
      if (newItem[col.dataIndex] === undefined) {
        if (col.inputType === "number") {
          newItem[col.dataIndex] =
            col.defaultValue !== undefined ? col.defaultValue : 0;
        } else {
          newItem[col.dataIndex] =
            col.defaultValue !== undefined ? col.defaultValue : "";
        }
      }
    });
    const updatedItems = [...items, newItem];
    onItemsChange?.(updatedItems);
  };

  // Create editable columns based on the passed columns prop
  const editableColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      render: (text, record) => {
        const {
          inputType,
          dataIndex,
          options,
          getOptions,
          placeholder,
          min,
          step,
          disabled,
        } = col;

        switch (inputType) {
          case "select":
            const selectOptions = getOptions
              ? getOptions(record)
              : options || availableItems;
            return (
              <Select
                {...(text ? { value: text } : {})}
                placeholder={placeholder}
                style={{ width: "100%" }}
                onChange={(value) =>
                  handleCellChange(value, record.id, dataIndex)
                }
                disabled={disabled}
                allowClear={col.allowClear}
              >
                {selectOptions.map((option) => (
                  <Select.Option
                    key={option.code}
                    value={option.id || option.value}
                  >
                    {option.name || option.label}
                    {col.showUnit && option.unit ? ` (${option.unit})` : ""}
                  </Select.Option>
                ))}
              </Select>
            );

          case "number":
            return (
              <InputNumber
                value={text}
                min={min !== undefined ? min : minQuantity}
                step={step || quantityStep}
                placeholder={placeholder}
                style={{ width: "100%" }}
                onChange={(value) =>
                  handleCellChange(value, record.id, dataIndex)
                }
                disabled={disabled}
                precision={col.precision}
              />
            );

          case "text":
            return (
              <Input
                value={text}
                placeholder={placeholder}
                onChange={(e) =>
                  handleCellChange(e.target.value, record.id, dataIndex)
                }
                disabled={disabled}
              />
            );

          case "currency":
            return formatCurrency(text || 0);

          case "calculated":
            // For calculated fields, just display the value
            return col.formatter ? col.formatter(text, record) : text;

          default:
            return text;
        }
      },
    };
  });

  // Add action column if not already present
  const hasActionColumn = editableColumns.some((col) => col.key === "action");
  if (!hasActionColumn) {
    editableColumns.push({
      title: "Action",
      key: "action",
      width: 60,
      render: (_, record) => (
        <Popconfirm
          title="Sure to delete?"
          onConfirm={() => handleRemoveItem(record.id)}
          disabled={disabled}
        >
          <Button
            icon={<DeleteOutlined />}
            type="text"
            danger
            size="small"
            disabled={disabled}
          />
        </Popconfirm>
      ),
    });
  }

  // Calculate totals if specified
  const totals = {};
  if (showTotalCost && items.length > 0) {
    columns.forEach((col) => {
      if (col.showTotal && col.dataIndex) {
        totals[col.dataIndex] = items.reduce(
          (sum, item) => sum + (parseFloat(item[col.dataIndex]) || 0),
          0
        );
      }
    });
  }

  return (
    <Card
      title={title}
      className={className}
      style={{ width: "100%" }}
      extra={
        <Button
          icon={<PlusOutlined />}
          type="link"
          onClick={handleAddItem}
          disabled={disabled}
        >
          {addButtonText}
        </Button>
      }
    >
      <Table
        dataSource={items}
        columns={editableColumns}
        pagination={false}
        rowKey="id"
        locale={{ emptyText }}
        size="small"
        scroll={{ x: "max-content" }}
      />

      {/* Show totals row if any columns have showTotal */}
      {showTotalCost && items.length > 0 && Object.keys(totals).length > 0 && (
        <div className="mt-4">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: "bold",
              padding: "8px 0",
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <span>Total</span>
            <div style={{ display: "flex", gap: "16px" }}>
              {Object.entries(totals).map(([key, value]) => {
                const column = columns.find((col) => col.dataIndex === key);
                const displayValue =
                  column?.inputType === "currency" || column?.formatter
                    ? column.formatter
                      ? column.formatter(value)
                      : formatCurrency(value)
                    : value?.toFixed?.(2);
                return (
                  <div key={key}>
                    <span>
                      {column?.title}: {displayValue}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ItemManager;
