import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table } from "antd";
import dayjs from "dayjs";

export const BankTable = ({
  data,
  loading,
  onEdit,
  onDelete,
  pagination,
  fetchItems,
}: any) => {
  const columns = [
    { title: "Bank Code", dataIndex: "code", key: "code" },
    { title: "Bank Name", dataIndex: "name", key: "name" },
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    { title: "IBAN", dataIndex: "iban", key: "iban" },
    {
      title: "Current Balance",
      dataIndex: "currentBalance",
      key: "currentBalance",
    },
    {
      title: "Opening Date",
      dataIndex: "openingDate",
      key: "openingDate",
      render: (openingDate: any) => dayjs(openingDate).format("DD-MMM-YY"),
    },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            size="small"
            onClick={() => onEdit(record)}
            icon={<EditOutlined />}
            type="link"
          />
          {/* <Popconfirm
            title="Are you sure?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small" icon={<DeleteOutlined />} type="link" />
          </Popconfirm> */}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      size="small"
      pagination={pagination}
      onChange={(pagination) => {
        fetchItems({ page: pagination.current, limit: pagination.pageSize });
      }}
      bordered
    />
  );
};
