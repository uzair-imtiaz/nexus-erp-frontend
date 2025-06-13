import React from "react";
import { Modal, Descriptions, Table, Tag, Button } from "antd";
import { Transaction } from "./types";

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
      dataIndex: "productName",
      key: "productName",
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
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      render: (rate: number, record: any) =>
        `${rate.toFixed(2)} per ${record.unit}`,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => amount.toFixed(2),
    },
  ];

  return (
    <Modal
      title={`${transaction.type === "purchase" ? "Purchase" : "Sale"} Details`}
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
        <Descriptions.Item
          label={transaction.type === "purchase" ? "Vendor" : "Customer"}
        >
          {transaction.entity.name}
        </Descriptions.Item>
        <Descriptions.Item label="Notes" span={2}>
          {transaction.notes || "No notes added"}
        </Descriptions.Item>
      </Descriptions>

      <Table
        columns={columns}
        dataSource={transaction.items}
        rowKey="id"
        pagination={false}
        style={{ marginTop: 24 }}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={3} align="right" index={2}>
              <strong>Total:</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3}>
              {transaction.totalAmount.toFixed(2)}
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
    </Modal>
  );
};

export default ViewTransactionModal;
