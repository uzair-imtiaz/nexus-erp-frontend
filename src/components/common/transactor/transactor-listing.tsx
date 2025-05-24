import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Input, Modal, Space, Table } from "antd";
import React, { useState } from "react";
import { TransactorFormModal } from "./transactor-form";
import { Transactor, TransactorType } from "./types";
import { ViewTransactorModal } from "./view-transactor-modal";

interface TransactorListComponentProps {
  entities: Transactor[];
  entityType: TransactorType;
  onAddTransactor: (entity: Transactor) => void;
  onEditTransactor: (entity: Transactor) => void;
  onDeleteTransactor: (id: string) => void;
}

export const TransactorListComponent: React.FC<
  TransactorListComponentProps
> = ({
  entities,
  entityType,
  onAddTransactor,
  onEditTransactor,
  onDeleteTransactor,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentTransactor, setCurrentTransactor] = useState<Transactor | null>(
    null
  );

  // Filter entities by type and search term
  const filteredEntities = entities.filter((entity) => {
    return (
      entity.type === entityType &&
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
      render: (_: any, record: Transactor) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setCurrentTransactor(record);
              setShowViewModal(true);
            }}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setCurrentTransactor(record);
              setShowAddModal(true);
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTransactor(record.id)}
          />
        </Space>
      ),
    },
  ];

  const handleAddTransactor = (entity: Transactor) => {
    onAddTransactor(entity);
    setShowAddModal(false);
  };

  const handleDeleteTransactor = (id: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this entity?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        onDeleteTransactor(id);
      },
    });
  };

  const entityTypeCapitalized =
    entityType.charAt(0).toUpperCase() + entityType.slice(1);

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
          placeholder={`Search ${entityType}s...`}
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "250px" }}
        />
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentTransactor(null);
              setShowAddModal(true);
            }}
          >
            Add New {entityTypeCapitalized}
          </Button>
          <Button icon={<DownloadOutlined />}>Download Sample</Button>
          <Button icon={<UploadOutlined />}>Import</Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredEntities}
        rowKey="id"
        locale={{ emptyText: `No ${entityType}s found` }}
      />

      <TransactorFormModal
        visible={showAddModal}
        entity={currentTransactor}
        type={entityType}
        onSave={handleAddTransactor}
        onCancel={() => setShowAddModal(false)}
      />

      <ViewTransactorModal
        visible={showViewModal}
        entity={currentTransactor}
        onClose={() => setShowViewModal(false)}
      />
    </div>
  );
};
