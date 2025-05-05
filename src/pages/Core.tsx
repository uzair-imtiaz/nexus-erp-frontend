import {
  BankOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  ShoppingOutlined,
  StockOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Input as AntInput,
  Button,
  DatePicker,
  Descriptions,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Table,
  Tabs,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import Banks from "../features/bank";
import Inventory from "../features/inventory/inventory";

// Define entity types
type EntityType = "vendor" | "customer";

// Define entity interface
interface Entity {
  id: string;
  name: string;
  type: EntityType;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  openingBalance: number;
  currentBalance: number;
  asOfDate: string;
}

// Mock data for entities
const mockEntities: Entity[] = [
  {
    id: "VEN-10001",
    name: "Vendor ABC",
    type: "vendor",
    contactPerson: "John Smith",
    email: "john@vendorabc.com",
    phone: "(555) 123-4567",
    address: "123 Vendor St, Supplier City, SC 12345",
    openingBalance: 0,
    currentBalance: 1490.0,
    asOfDate: "2025-01-01",
  },
  {
    id: "VEN-10002",
    name: "Vendor DEF",
    type: "vendor",
    contactPerson: "Jane Doe",
    email: "jane@vendordef.com",
    phone: "(555) 234-5678",
    address: "456 Supply Ave, Vendor Town, VT 23456",
    openingBalance: 1000.0,
    currentBalance: 4000.0,
    asOfDate: "2025-01-01",
  },
  {
    id: "VEN-10003",
    name: "Vendor GHI",
    type: "vendor",
    contactPerson: "Robert Jones",
    email: "robert@vendorghi.com",
    phone: "(555) 345-6789",
    address: "789 Material Rd, Provider City, PC 34567",
    openingBalance: 2500.0,
    currentBalance: 2500.0,
    asOfDate: "2025-01-01",
  },
  {
    id: "CUS-10001",
    name: "Customer XYZ",
    type: "customer",
    contactPerson: "Alice Johnson",
    email: "alice@customerxyz.com",
    phone: "(555) 456-7890",
    address: "101 Client Blvd, Buyer City, BC 45678",
    openingBalance: 0,
    currentBalance: 3000.0,
    asOfDate: "2025-01-01",
  },
  {
    id: "CUS-10002",
    name: "Customer UVW",
    type: "customer",
    contactPerson: "Bob Williams",
    email: "bob@customeruvw.com",
    phone: "(555) 567-8901",
    address: "202 Consumer St, Client Town, CT 56789",
    openingBalance: 500.0,
    currentBalance: 2420.0,
    asOfDate: "2025-01-01",
  },
  {
    id: "CUS-10003",
    name: "Customer RST",
    type: "customer",
    contactPerson: "Carol Brown",
    email: "carol@customerrst.com",
    phone: "(555) 678-9012",
    address: "303 Buyer Ave, Purchase City, PC 67890",
    openingBalance: 0,
    currentBalance: 0,
    asOfDate: "2025-01-01",
  },
];

interface EntityFormModalProps {
  visible: boolean;
  entity: Entity | null;
  type: EntityType;
  onSave: (entity: Entity) => void;
  onCancel: () => void;
}

const EntityFormModal: React.FC<EntityFormModalProps> = ({
  visible,
  entity,
  type,
  onSave,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const isEditing = !!entity;

  React.useEffect(() => {
    if (visible && entity) {
      form.setFieldsValue({
        ...entity,
        asOfDate: entity.asOfDate ? dayjs(entity.asOfDate) : null,
      });
    }
  }, [visible, entity, form]);

  const handleSubmit = (values: any) => {
    const formattedValues = {
      ...values,
      id: entity
        ? entity.id
        : `${type === "vendor" ? "VEN" : "CUS"}-${Math.floor(
            10000 + Math.random() * 90000
          )}`,
      type,
      asOfDate: values.asOfDate
        ? values.asOfDate.format("YYYY-MM-DD")
        : new Date().toISOString().split("T")[0],
      currentBalance: isEditing ? values.currentBalance : values.openingBalance,
    };

    onSave(formattedValues);
    form.resetFields();
  };

  return (
    <Modal
      title={
        isEditing
          ? `Edit ${type === "vendor" ? "Vendor" : "Customer"}`
          : `Add New ${type === "vendor" ? "Vendor" : "Customer"}`
      }
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          id: entity
            ? entity.id
            : `${type === "vendor" ? "VEN" : "CUS"}-${Math.floor(
                10000 + Math.random() * 90000
              )}`,
          openingBalance: 0,
          asOfDate: dayjs(),
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <Form.Item label="ID" name="id">
            <AntInput disabled />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the name!" }]}
          >
            <AntInput />
          </Form.Item>

          <Form.Item label="Contact Person" name="contactPerson">
            <AntInput />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: "email", message: "Please enter a valid email!" }]}
          >
            <AntInput />
          </Form.Item>

          <Form.Item label="Phone" name="phone">
            <AntInput />
          </Form.Item>

          <Form.Item label="Opening Balance" name="openingBalance">
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              precision={2}
              disabled={isEditing}
            />
          </Form.Item>

          <Form.Item label="As of Date" name="asOfDate">
            <DatePicker style={{ width: "100%" }} disabled={isEditing} />
          </Form.Item>

          {isEditing && (
            <Form.Item label="Current Balance" name="currentBalance">
              <InputNumber style={{ width: "100%" }} min={0} precision={2} />
            </Form.Item>
          )}
        </div>

        <Form.Item label="Address" name="address">
          <AntInput.TextArea rows={3} />
        </Form.Item>

        <Form.Item>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              gap: "8px",
              marginTop: "16px",
            }}
          >
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {isEditing ? "Update" : "Save"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

// Entity View Modal Component
interface ViewEntityModalProps {
  visible: boolean;
  entity: Entity | null;
  onClose: () => void;
}

const ViewEntityModal: React.FC<ViewEntityModalProps> = ({
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
        <Descriptions.Item label="Name">{entity.name}</Descriptions.Item>
        <Descriptions.Item label="Contact Person">
          {entity.contactPerson || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {entity.email || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Phone">
          {entity.phone || "-"}
        </Descriptions.Item>
        <Descriptions.Item label="Current Balance">
          ${entity.currentBalance.toFixed(2)}
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
            ${entity.openingBalance.toFixed(2)}
          </Typography.Title>
        </div>
        <div>
          <Typography.Text type="secondary">As of Date</Typography.Text>
          <Typography.Title level={5}>
            {new Date(entity.asOfDate).toLocaleDateString()}
          </Typography.Title>
        </div>
      </div>
    </Modal>
  );
};

// Vendor Component
interface VendorComponentProps {
  entities: Entity[];
  onAddEntity: (entity: Entity) => void;
  onEditEntity: (entity: Entity) => void;
  onDeleteEntity: (id: string) => void;
}

const VendorComponent: React.FC<VendorComponentProps> = ({
  entities,
  onAddEntity,
  onEditEntity,
  onDeleteEntity,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentEntity, setCurrentEntity] = useState<Entity | null>(null);

  // Filter vendors
  const filteredVendors = entities.filter((entity) => {
    return (
      entity.type === "vendor" &&
      (entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entity.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Contact Person",
      dataIndex: "contactPerson",
      key: "contactPerson",
      render: (text: string) => text || "-",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text: string) => text || "-",
    },
    {
      title: "Current Balance",
      dataIndex: "currentBalance",
      key: "currentBalance",
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Entity) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setCurrentEntity(record);
              setShowViewModal(true);
            }}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setCurrentEntity(record);
              setShowAddModal(true);
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDeleteEntity(record.id)}
          />
        </Space>
      ),
    },
  ];

  const handleAddVendor = (vendor: Entity) => {
    onAddEntity(vendor);
    setShowAddModal(false);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <Input
          placeholder="Search vendors..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "300px" }}
        />
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentEntity(null);
              setShowAddModal(true);
            }}
          >
            Add New Vendor
          </Button>
          <Button icon={<DownloadOutlined />}>Download Sample</Button>
          <Button icon={<UploadOutlined />}>Import</Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredVendors}
        rowKey="id"
        locale={{ emptyText: "No vendors found" }}
      />

      <EntityFormModal
        visible={showAddModal}
        entity={currentEntity}
        type="vendor"
        onSave={handleAddVendor}
        onCancel={() => setShowAddModal(false)}
      />

      <ViewEntityModal
        visible={showViewModal}
        entity={currentEntity}
        onClose={() => setShowViewModal(false)}
      />
    </div>
  );
};

// Customer Component
interface CustomerComponentProps {
  entities: Entity[];
  onAddEntity: (entity: Entity) => void;
  onEditEntity: (entity: Entity) => void;
  onDeleteEntity: (id: string) => void;
}

const CustomerComponent: React.FC<CustomerComponentProps> = ({
  entities,
  onAddEntity,
  onEditEntity,
  onDeleteEntity,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentEntity, setCurrentEntity] = useState<Entity | null>(null);

  // Filter customers
  const filteredCustomers = entities.filter((entity) => {
    return (
      entity.type === "customer" &&
      (entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entity.id.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Contact Person",
      dataIndex: "contactPerson",
      key: "contactPerson",
      render: (text: string) => text || "-",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text: string) => text || "-",
    },
    {
      title: "Current Balance",
      dataIndex: "currentBalance",
      key: "currentBalance",
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Entity) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setCurrentEntity(record);
              setShowViewModal(true);
            }}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setCurrentEntity(record);
              setShowAddModal(true);
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDeleteEntity(record.id)}
          />
        </Space>
      ),
    },
  ];

  const handleAddCustomer = (customer: Entity) => {
    onAddEntity(customer);
    setShowAddModal(false);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <Input
          placeholder="Search customers..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "300px" }}
        />
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentEntity(null);
              setShowAddModal(true);
            }}
          >
            Add New Customer
          </Button>
          <Button icon={<DownloadOutlined />}>Download Sample</Button>
          <Button icon={<UploadOutlined />}>Import</Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredCustomers}
        rowKey="id"
        locale={{ emptyText: "No customers found" }}
      />

      <EntityFormModal
        visible={showAddModal}
        entity={currentEntity}
        type="customer"
        onSave={handleAddCustomer}
        onCancel={() => setShowAddModal(false)}
      />

      <ViewEntityModal
        visible={showViewModal}
        entity={currentEntity}
        onClose={() => setShowViewModal(false)}
      />
    </div>
  );
};

// Core Component
const Core = () => {
  const [entities, setEntities] = useState<Entity[]>(mockEntities);
  const [activeTab, setActiveTab] = useState<string>("vendor");

  const handleAddEntity = (newEntity: Entity) => {
    setEntities([...entities, newEntity]);
    message.success(
      `${
        newEntity.type === "vendor" ? "Vendor" : "Customer"
      } added successfully!`
    );
  };

  const handleEditEntity = (updatedEntity: Entity) => {
    setEntities(
      entities.map((entity) =>
        entity.id === updatedEntity.id ? updatedEntity : entity
      )
    );
    message.success(
      `${
        updatedEntity.type === "vendor" ? "Vendor" : "Customer"
      } updated successfully!`
    );
  };

  const handleDeleteEntity = (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this entity?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        setEntities(entities.filter((entity) => entity.id !== id));
        message.success("Entity deleted successfully!");
      },
    });
  };

  const items = [
    {
      key: "vendor",
      label: (
        <span>
          <ShoppingOutlined /> Vendors
        </span>
      ),
      children: (
        <VendorComponent
          entities={entities}
          onAddEntity={handleAddEntity}
          onEditEntity={handleEditEntity}
          onDeleteEntity={handleDeleteEntity}
        />
      ),
    },
    {
      key: "customer",
      label: (
        <span>
          <UserOutlined /> Customers
        </span>
      ),
      children: (
        <CustomerComponent
          entities={entities}
          onAddEntity={handleAddEntity}
          onEditEntity={handleEditEntity}
          onDeleteEntity={handleDeleteEntity}
        />
      ),
    },
    {
      key: "bank",
      label: (
        <span>
          <BankOutlined /> Banks
        </span>
      ),
      children: <Banks />,
    },
    {
      key: "inventory",
      label: (
        <span>
          <StockOutlined /> Inventory
        </span>
      ),
      children: <Inventory />,
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Tabs defaultActiveKey="vendor" items={items} onChange={setActiveTab} />
    </div>
  );
};

export default Core;
