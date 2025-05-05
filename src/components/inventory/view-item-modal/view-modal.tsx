import { CloseOutlined } from "@ant-design/icons";
import { Button, Descriptions, Divider, Modal, Table, Typography } from "antd";
import { ViewItemModalProps } from "./types";

const { Title, Text } = Typography;

const ViewItemModal: React.FC<ViewItemModalProps> = ({
  item,
  onClose,
  visible,
}) => {
  const columns = [
    {
      title: "Unit Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Conversion Factor",
      key: "factor",
      render: (_, record) => (
        <span>
          1 {record.name} = {record.factor} {item.baseUnit}
        </span>
      ),
    },
    {
      title: "Equivalent Quantity",
      key: "equivalentQty",
      render: (_, record) => (
        <span>
          {(item.quantityAvailable / record.factor).toFixed(2)} {record.name}
        </span>
      ),
    },
  ];

  return (
    <Modal
      open={visible}
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Item Details</span>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={onClose}
            style={{ marginRight: -7 }}
          />
        </div>
      }
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          Close
        </Button>,
      ]}
      onCancel={onClose}
      width={800}
      closeIcon={null} // Hide default close icon since we're using a custom one
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Item Code">{item.id}</Descriptions.Item>
        <Descriptions.Item label="Name">{item.name}</Descriptions.Item>
        <Descriptions.Item label="Category">{item.category}</Descriptions.Item>
        <Descriptions.Item label="Base Unit">{item.baseUnit}</Descriptions.Item>
        <Descriptions.Item label="Quantity Available">
          {item.quantity} {item.baseUnit}
        </Descriptions.Item>
        <Descriptions.Item label="Current Rate">
          Rs. {item.baseRate.toFixed(2)} per {item.baseUnit}
        </Descriptions.Item>
        <Descriptions.Item label="Stock Value">
          Rs. {(item.quantity * item.baseRate).toFixed(2)}
        </Descriptions.Item>
      </Descriptions>

      {item?.multiUnits?.length > 0 && (
        <>
          <Divider />
          <div style={{ marginBottom: 16 }}>
            <Title level={5}>Multi Units</Title>
          </div>
          <Table
            columns={columns}
            dataSource={item.multiUnits.map((unit, index) => ({
              ...unit,
              key: index,
            }))}
            pagination={false}
            size="small"
          />
        </>
      )}
    </Modal>
  );
};

export default ViewItemModal;
