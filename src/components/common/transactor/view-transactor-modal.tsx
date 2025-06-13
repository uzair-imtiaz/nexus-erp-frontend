import { Button, Descriptions, Divider, Modal, Typography } from "antd";
import React from "react";
import { ViewTransactorModalProps } from "./types";
import dayjs from "dayjs";
import { formatCurrency } from "../../../utils";

export const ViewTransactorModal: React.FC<ViewTransactorModalProps> = ({
  visible,
  entity,
  onClose,
}) => {
  if (!entity) return null;

  return (
    <Modal
      title={`${entity.type === "vendor" ? "Vendor" : "Customer"} Details`}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={700}
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="ID">{entity.id}</Descriptions.Item>
        <Descriptions.Item label="Code">{entity.code}</Descriptions.Item>
        <Descriptions.Item label="Name">{entity.name}</Descriptions.Item>
        <Descriptions.Item label="Contact Person">
          {entity.contactPerson || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {entity.email || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Phone">
          {entity.contactNumber || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Address" span={2}>
          {entity.address || "-"}
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <Typography.Text type="secondary">Opening Balance</Typography.Text>
          <Typography.Title level={5}>
            {formatCurrency(entity.openingBalance)}
          </Typography.Title>
        </div>
        <div>
          <Typography.Text type="secondary">As of Date</Typography.Text>
          <Typography.Title level={5}>
            {dayjs(entity.openingBalanceDate).format("YYYY-MM-DD")}
          </Typography.Title>
        </div>
      </div>
    </Modal>
  );
};
