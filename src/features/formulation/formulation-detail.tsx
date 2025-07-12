import { Descriptions, Divider, Table, Typography } from "antd";
import { formatCurrency } from "../../utils";

interface FormulationDetailProps {
  formulation: any;
  batchSize?: number;
}

const FormulationDetail: React.FC<FormulationDetailProps> = ({
  formulation,
  batchSize = 1,
}) => {
  const totalProductionCost =
    batchSize * parseFloat(formulation.totalCost ?? 0);

  // Columns for products (finished/semi-finished goods)
  const productColumns = [
    { title: "Product", dataIndex: "name", key: "name" },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      render: (v: string) => v || "-",
    },
    {
      title: "Quantity Required",
      dataIndex: "quantityRequired",
      key: "quantityRequired",
      render: (v: number) => v * batchSize,
    },
    {
      title: "Unit Cost",
      key: "unitCost",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: any) => {
        const costFiPercent = parseFloat(record.costFiPercent);

        const quantity = record.quantityRequired * batchSize;

        const unitCost =
          ((costFiPercent / 100) * totalProductionCost) /
          parseFloat(quantity || "0");
        return <span>{formatCurrency(unitCost)}</span>;
      },
    },
    {
      title: "Cost %",
      dataIndex: "costFiPercent",
      key: "costFiPercent",
      render: (v: number) => (v != null ? v.toFixed(2) + "%" : "-"),
    },
    {
      title: "Base Quantity",
      dataIndex: "baseQuantity",
      key: "baseQuantity",
      render: (v: number) => v * batchSize,
    },
  ];

  // Columns for ingredients (raw materials)
  const ingredientColumns = [
    {
      title: "Raw Material",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
      render: (v: string) => v || "-",
    },
    {
      title: "Quantity Required",
      dataIndex: "quantityRequired",
      key: "qtyRequired",
      render: (v: number) => v * batchSize,
    },
    {
      title: "Available Quantity",
      dataIndex: "availableQuantity",
      key: "availableQuantity",
      render: (v: number) => v || "-",
    },
    {
      title: "Per Unit",
      dataIndex: "perUnit",
      key: "perUnit",
      render: (v: number) => v || "-",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (v: string) => v || "-",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (v: number) => <span>{formatCurrency(v)}</span>,
    },
  ];

  // Columns for expenses
  const expenseColumns = [
    { title: "Expense", dataIndex: "name", key: "name" },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      render: (v: string) => v || "-",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (v: number) => <span>{formatCurrency(v)}</span>,
    },
    {
      title: "Per Unit",
      dataIndex: "perUnit",
      key: "perUnit",
      render: (v: number) => v || "-",
    },
    {
      title: "Quantity Required",
      dataIndex: "quantityRequired",
      key: "qtyRequired",
      render: (v: number) => v * batchSize,
    },
  ];

  return (
    <>
      {batchSize > 1 && (
        <Typography.Title
          level={5}
          style={{ margin: "16px 0", color: "#1677ff" }}
        >
          Total Production Cost: {formatCurrency(totalProductionCost)}
        </Typography.Title>
      )}
      <Descriptions bordered column={2} size="middle">
        <Descriptions.Item label="Formulation Code">
          {formulation.code || formulation.id}
        </Descriptions.Item>
        <Descriptions.Item label="Formulation Name">
          {formulation.name}
        </Descriptions.Item>
        <Descriptions.Item label="RM Factor">
          {formulation.rmFactor ?? "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Total Cost">
          {formatCurrency(formulation?.totalCost)}
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left" style={{ marginTop: 24 }}>
        Final Goods
      </Divider>
      <Table
        dataSource={formulation.products || []}
        columns={productColumns}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rowKey={(row: any) => row.product_id || row.id}
        pagination={false}
        size="small"
        locale={{ emptyText: "No products" }}
        style={{ marginBottom: 24 }}
      />

      <Divider orientation="left">Ingredients</Divider>
      <Table
        dataSource={formulation.ingredients || []}
        columns={ingredientColumns}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rowKey={(row: any) => row.inventory_item_id || row.id}
        pagination={false}
        size="small"
        locale={{ emptyText: "No ingredients" }}
        style={{ marginBottom: 24 }}
      />

      <Divider orientation="left">Expenses</Divider>
      <Table
        dataSource={formulation.expenses || []}
        columns={expenseColumns}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rowKey={(row: any) => row.expense_account_id || row.id}
        pagination={false}
        size="small"
        locale={{ emptyText: "No expenses" }}
        style={{ marginBottom: 24 }}
      />
    </>
  );
};

export default FormulationDetail;
