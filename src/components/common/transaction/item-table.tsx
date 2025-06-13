import React, { useMemo } from "react";
import { Table, Button, Popconfirm, Typography } from "antd";
import { Trash2 } from "lucide-react";
import { TransactionItem } from "../../purchase-sale/types";
import { formatCurrency } from "../../../utils";

const { Text } = Typography;

interface ItemTableProps {
  items: TransactionItem[];
  onRemove: (index: number) => void;
}

const ItemTable: React.FC<ItemTableProps> = ({ items, onRemove }) => {
  const dataSource = useMemo(() => {
    return items.map((item, idx) => ({
      ...item,
      key: idx,
      amount: item.quantity * item.rate - item.discount + item.tax,
    }));
  }, [items]);

  const totalAmount = useMemo(() => {
    return dataSource.reduce((total, item) => total + item.amount, 0);
  }, [dataSource]);

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        render: (text: string) => <Text>{text}</Text>,
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
      },
      {
        title: "Unit",
        dataIndex: "unit",
        key: "unit",
      },
      {
        title: "Rate",
        dataIndex: "rate",
        key: "rate",
        render: (rate: number) => rate.toFixed(2),
      },
      {
        title: "Discount",
        dataIndex: "discount",
        key: "discount",
        render: (discount: number) => discount.toFixed(2),
      },
      {
        title: "Tax",
        dataIndex: "tax",
        key: "tax",
        render: (tax: number) => tax.toFixed(2),
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
        render: (amount: number) => formatCurrency(amount),
      },
      {
        title: "Actions",
        key: "actions",
        render: (_: unknown, _record: TransactionItem, index: number) => (
          <Popconfirm
            title="Are you sure you want to remove this item?"
            onConfirm={() => onRemove(index)}
          >
            <Button type="text" danger icon={<Trash2 size={16} />} />
          </Popconfirm>
        ),
      },
    ],
    [onRemove]
  );

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      bordered
      size="middle"
      style={{ marginBottom: 24 }}
      scroll={{ x: "max-content" }}
      summary={() => (
        <Table.Summary fixed>
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={6} index={0}>
              <strong>Total Amount</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={7} colSpan={2}>
              <strong>{formatCurrency(totalAmount)}</strong>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        </Table.Summary>
      )}
    />
  );
};

export default ItemTable;
