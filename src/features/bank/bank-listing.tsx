import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space, Table } from "antd";

export const BankTable = ({ data, loading, onEdit, onDelete }: any) => {
  const columns = [
    { title: "Bank Code", dataIndex: "bankCode", key: "bankCode" },
    { title: "Bank Name", dataIndex: "bankName", key: "bankName" },
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
    { title: "Opening Date", dataIndex: "openingDate", key: "openingDate" },
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
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small" icon={<DeleteOutlined />} type="link" />
          </Popconfirm>
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
      pagination={{ pageSize: 10 }}
    />
  );
};
