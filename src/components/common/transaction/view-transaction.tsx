import React from "react";
import { Modal, Descriptions, Table, Tag, Button } from "antd";
import { Transaction } from "./types";
import { formatCurrency } from "../../../utils";
import { InventoryItem } from "../../../features/inventory/types";

interface ViewTransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
}

const ViewTransactionModal: React.FC<ViewTransactionModalProps> = ({
  transaction,
  onClose,
}) => {
  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (_: any, record: any) => (
        <>
          {record.quantity} {record.unit}
          {record.unitConversionFactor !== 1 && (
            <span style={{ color: "#999", marginLeft: 4 }}>
              ({record.baseQuantity} in base unit)
            </span>
          )}
        </>
      ),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      render: (rate: number, record: unknown) =>
        `${formatCurrency(rate)} per ${record.unit}`,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_: number, record: InventoryItem) =>
        formatCurrency(record.quantity * record.rate),
    },
  ];

  return (
    <Modal
      title={`${
        transaction.type?.includes("purchase") ? "Purchase" : "Sale"
      } Details`}
      open
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={900}
    >
      <Descriptions column={2} bordered size="middle">
        <Descriptions.Item label="Transaction ID">
          {transaction.id}
        </Descriptions.Item>
        <Descriptions.Item label="Date">
          {new Date(transaction.date).toLocaleDateString()}
        </Descriptions.Item>
        <Descriptions.Item label="Type">
          <Tag
            color={transaction.type?.includes("purchase") ? "blue" : "green"}
          >
            {transaction.type?.charAt(0).toUpperCase() +
              transaction.type?.slice(1)}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item
          label={transaction.type?.includes("purchase") ? "Vendor" : "Customer"}
        >
          {transaction.type?.includes("purchase")
            ? transaction.vendor?.name
            : transaction.customer?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Total Amount">
          {formatCurrency(transaction.totalAmount)}
        </Descriptions.Item>
        <Descriptions.Item label="Notes">
          {transaction.notes || "No notes added"}
        </Descriptions.Item>
      </Descriptions>

      {transaction.inventories && transaction.inventories.length > 0 ? (
        <Table
          columns={columns}
          dataSource={transaction.inventories}
          rowKey="id"
          pagination={false}
          style={{ marginTop: 24 }}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={5} align="right" index={2}>
                <strong>Total:</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5}>
                {formatCurrency(transaction.totalAmount)}
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      ) : (
        <div style={{ marginTop: 24, textAlign: "center", color: "#999" }}>
          No items available for this transaction
        </div>
      )}
    </Modal>
  );
};

export default ViewTransactionModal;
