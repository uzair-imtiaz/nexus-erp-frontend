import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Input, notification, Popconfirm, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import { TransactorFormModal } from "./transactor-form";
import { Transactor, TransactorType } from "./types";
import { ViewTransactorModal } from "./view-transactor-modal";
import { formatCurrency } from "../../../utils";

interface TransactorListComponentProps {
  entities: Transactor[];
  entityType: TransactorType;
  onAddTransactor: (entity: Transactor) => void;
  onEditTransactor: (id: string, entity: Transactor) => Promise<void>;
  onDeleteTransactor: (id: string) => void;
  onImport?: () => void;
  fetch: (queryParams?: Record<string, unknown>) => void;
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export const TransactorListComponent: React.FC<
  TransactorListComponentProps
> = ({
  entities,
  entityType,
  onAddTransactor,
  onEditTransactor,
  onDeleteTransactor,
  onImport,
  fetch,
  loading,
  pagination,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentTransactor, setCurrentTransactor] = useState<Transactor | null>(
    null
  );

  useEffect(() => {
    fetch();
  }, []);

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Contact Person",
      dataIndex: "personName",
      key: "personName",
      render: (text: string) => text || "-",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (text: string) => text || "-",
    },
    {
      title: "Opening Balance",
      dataIndex: "openingBalance",
      key: "openingBalance",
      render: (text: number) => formatCurrency(text),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Transactor) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              setCurrentTransactor(record);
              setShowViewModal(true);
            }}
          />
          {/* <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setCurrentTransactor(record);
              setShowAddModal(true);
            }}
          />
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => onDeleteTransactor(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" icon={<DeleteOutlined />} type="link" danger />
          </Popconfirm> */}
        </Space>
      ),
    },
  ];

  const handleSeach = async (value: string) => {
    try {
      if (!value) return;
      fetch({ name: value });
    } catch (error: unknown) {
      console.log(error);
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      notification.error({
        message: "Error",
        description: errorMessage,
      });
    }
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
          onPressEnter={() => handleSeach(searchTerm)}
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
          {onImport && (
            <Button icon={<UploadOutlined />} onClick={onImport}>
              Import
            </Button>
          )}
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={entities}
        rowKey="id"
        locale={{ emptyText: `No ${entityType}s found` }}
        bordered
        size="small"
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        onChange={(paginationConfig) => {
          fetch({
            page: paginationConfig.current,
            limit: paginationConfig.pageSize,
          });
        }}
      />

      {showAddModal && (
        <TransactorFormModal
          visible={showAddModal}
          entity={currentTransactor}
          type={entityType}
          onSave={async (values) =>
            currentTransactor
              ? onEditTransactor(currentTransactor?.id, values)
              : onAddTransactor(values)
          }
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {showViewModal && (
        <ViewTransactorModal
          visible={showViewModal}
          entity={currentTransactor}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
};
