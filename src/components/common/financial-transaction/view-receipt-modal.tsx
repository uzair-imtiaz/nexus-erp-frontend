import { Button, Descriptions, Modal, Tag } from "antd";
import React from "react";
import { formatCurrency } from "../../../utils";
import { Receipt } from "./types";

interface ViewReceiptModalProps {
  receipt: Receipt;
  onClose: () => void;
}

const ViewReceiptModal: React.FC<ViewReceiptModalProps> = ({
  receipt,
  onClose,
}) => {
  console.log("receipt ", receipt);
  return (
    <Modal
      title="Receipt Details"
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
        <Descriptions.Item label="Receipt ID">{receipt.id}</Descriptions.Item>
        <Descriptions.Item label="Date">
          {new Date(receipt.date).toLocaleDateString()}
        </Descriptions.Item>
        <Descriptions.Item label="Type">
          <Tag color="green">Receipt</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Customer">
          {receipt.customer?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Bank">{receipt.bank?.name}</Descriptions.Item>
        <Descriptions.Item label="Total Amount">
          {formatCurrency(receipt.amount)}
        </Descriptions.Item>
        <Descriptions.Item label="Customer Advance Balance">
          {formatCurrency(receipt.customer?.advanceBalance)}
        </Descriptions.Item>
        <Descriptions.Item label="Notes">
          {receipt.notes || "No notes added"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ViewReceiptModal;
