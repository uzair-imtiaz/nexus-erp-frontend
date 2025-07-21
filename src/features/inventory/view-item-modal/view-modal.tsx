import { CloseOutlined } from "@ant-design/icons";
import { Button, Descriptions, Divider, Modal, Table, Typography } from "antd";
import { ViewItemModalProps } from "./types";

const { Title } = Typography;

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
      title: "Equivalent Quantity Available",
      key: "equivalentQty",
      render: (_, record) => (
        <span>
          {(item.quantity / record.factor).toFixed(2)} {record.name}
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
      closeIcon={null}
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Item Code">{item.id}</Descriptions.Item>
        <Descriptions.Item label="Name">{item.name}</Descriptions.Item>
        <Descriptions.Item label="Category">{item.category}</Descriptions.Item>
        <Descriptions.Item label="Base Unit">{item.baseUnit}</Descriptions.Item>
        <Descriptions.Item label="Quantity Available">
          {item.quantity} {item.baseUnit}
        </Descriptions.Item>
        <Descriptions.Item label="Buying Rate">
          Rs. {item.baseRate.toFixed(2)} per {item.baseUnit}
        </Descriptions.Item>
        <Descriptions.Item label="Selling Rate">
          Rs. {item.sellingRate.toFixed(2)} per {item.baseUnit}
        </Descriptions.Item>
        <Descriptions.Item label="Stock Value">
          Rs. {(item.quantity * item.baseRate).toFixed(2)}
        </Descriptions.Item>
      </Descriptions>

      {item?.multiUnits && Object.keys(item.multiUnits).length > 0 && (
        <>
          <Divider />
          <div style={{ marginBottom: 16 }}>
            <Title level={5}>Multi Units</Title>
          </div>
          <Table
            columns={columns}
            dataSource={Object.entries(item.multiUnits).map(
              ([name, factor], index) => ({
                key: index,
                name,
                factor,
              })
            )}
            pagination={false}
            size="small"
          />
        </>
      )}
    </Modal>
  );
};

export default ViewItemModal;
