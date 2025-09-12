import { Button, Descriptions, Modal, Tag } from "antd";
import React from "react";
import { formatCurrency } from "../../../utils";
import { Payment } from "./types";

interface ViewPaymentModalProps {
  payment: Payment;
  onClose: () => void;
}

const ViewPaymentModal: React.FC<ViewPaymentModalProps> = ({
  payment,
  onClose,
}) => {
  return (
    <Modal
      title="Payment Details"
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
        <Descriptions.Item label="Payment ID">{payment.id}</Descriptions.Item>
        <Descriptions.Item label="Date">
          {new Date(payment.date).toLocaleDateString()}
        </Descriptions.Item>
        <Descriptions.Item label="Type">
          <Tag color="blue">Payment</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Vendor">
          {payment.vendor?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Bank">{payment.bank?.name}</Descriptions.Item>
        <Descriptions.Item label="Total Amount">
          {formatCurrency(payment.amount)}
        </Descriptions.Item>
        <Descriptions.Item label="Vendor Advance Balance">
          {formatCurrency(payment.vendor?.advanceBalance)}
        </Descriptions.Item>
        <Descriptions.Item label="Notes">
          {payment.notes || "No notes added"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ViewPaymentModal;
