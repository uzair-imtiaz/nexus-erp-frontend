import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Flex,
  Input,
  notification,
  Popconfirm,
  Select,
  Space,
  Table,
} from "antd";
import { useEffect, useState } from "react";
import { deleteInventory, getInventories } from "../../apis";
import AddEditItemModal from "./add-edit-modal/add-edit-modal";
import { InventoryItem } from "./types";
import ViewItemModal from "./view-item-modal/view-modal";
import { buildQueryString, formatCurrency } from "../../utils";

const Inventory = () => {
  const { Option } = Select;
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    nextPage: null,
    prevPage: null,
  });

  const fetchItems = async (queryParams: Record<string, any> = {}) => {
    try {
      setLoading(true);
      const queryString = buildQueryString(queryParams);
      const response = await getInventories(queryString);

      if (!response.success) {
        return notification.error({
          message: "Error",
          description: response.message,
        });
      }

      setItems(response.data);
      setPagination(response.pagination);
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEditItem = (item: InventoryItem) => {
    setCurrentItem(item);
    setShowAddModal(true);
  };

  const handleViewItem = (item: InventoryItem) => {
    setCurrentItem(item);
    setShowViewModal(true);
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const response = await deleteInventory(id);
      if (response?.success) {
        notification.success({ message: response?.message });
        fetchItems();
      } else {
        notification.error({
          message: "Error",
          description: response.message,
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error?.message,
      });
      console.error("Error fetching data:", error);
    }
  };

  const handleSeach = async (value: string) => {
    try {
      if (!value) return;
      fetchItems({ name: value });
    } catch (error: any) {
      console.log(error);
      notification.error({
        message: "Error",
        description: error?.message,
      });
    }
  };

  const columns = [
    {
      title: "Item Code",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Base Unit",
      dataIndex: "baseUnit",
      key: "baseUnit",
    },
    {
      title: "Stock Qty",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Rate",
      dataIndex: "baseRate",
      key: "baseRate",
      render: (value: number) => `${value?.toFixed(2)}`,
    },
    {
      title: "Stock Value",
      key: "stockValue",
      render: (_, record) => formatCurrency(record?.amount),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Flex>
          <Button
            icon={<EyeOutlined />}
            type="link"
            onClick={() => handleViewItem(record)}
            size="small"
          />
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleEditItem(record)}
            size="small"
          />
          {/* <Popconfirm
            title="Are you sure?"
            onConfirm={() => handleDeleteItem(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              size="small"
              icon={<DeleteOutlined />}
              type="link"
              danger
              disabled={record?.systemGenerated}
            />
          </Popconfirm> */}
        </Flex>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
        direction="horizontal"
      >
        <Space wrap>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 250 }}
            onPressEnter={() => handleSeach(searchTerm)}
          />
          <Select
            value={categoryFilter}
            onChange={setCategoryFilter}
            style={{ width: 200 }}
          >
            <Option value="all">All Categories</Option>
            <Option value="Raw Material">Raw Materials</Option>
            <Option value="Semi-Finished Goods">Semi-Finished Goods</Option>
            <Option value="Finished Goods">Finished Goods</Option>
          </Select>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() =>
              fetchItems({ name: searchTerm, category: categoryFilter })
            }
          >
            Search
          </Button>
        </Space>
        <Space wrap>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentItem(null);
              setShowAddModal(true);
            }}
          >
            Add New Item
          </Button>
          <Button icon={<DownloadOutlined />}>Export</Button>
          <Button icon={<UploadOutlined />}>Import</Button>
        </Space>
      </Space>

      <Table
        columns={columns}
        dataSource={items}
        rowKey="id"
        size="small"
        pagination={{
          current: pagination?.page,
          pageSize: pagination?.limit,
          total: pagination?.total,
          showSizeChanger: true,
        }}
        onChange={(pagination) => {
          fetchItems({ page: pagination.current, limit: pagination.pageSize });
        }}
        loading={loading}
        locale={{ emptyText: "No inventory items found." }}
      />

      {showAddModal && (
        <AddEditItemModal
          item={currentItem}
          onClose={() => {
            setShowAddModal(false);
          }}
          onSuccess={(item, isEdit) => {
            setItems((prevItems) => {
              if (isEdit) {
                return prevItems.map((i) => (i.id === item.id ? item : i));
              }
              return [...prevItems, item];
            });
          }}
        />
      )}

      {showViewModal && currentItem && (
        <ViewItemModal
          item={currentItem}
          onClose={() => setShowViewModal(false)}
          visible={showViewModal}
        />
      )}
    </div>
  );
};

export default Inventory;
