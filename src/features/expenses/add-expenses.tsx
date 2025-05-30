import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Flex,
  Input,
  InputNumber,
  Select,
  Table,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { ExpenseRow } from "./types";

const { Option } = Select;

const AddExpenses = () => {
  const [rows, setRows] = useState<ExpenseRow[]>([
    {
      key: 1,
      date: dayjs(),
      refNo: "",
      mode: "",
      nominalAccount: "",
      project: "",
      details: "",
      amount: 0,
    },
  ]);

  const addRow = () => {
    const newRow: ExpenseRow = {
      key: Date.now(),
      date: dayjs(),
      refNo: "",
      mode: "",
      nominalAccount: "",
      project: "",
      details: "",
      amount: 0,
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (key: number) => {
    setRows(rows.filter((row) => row.key !== key));
  };

  const handleChange = (
    value: string | number | Dayjs | null,
    key: number,
    dataIndex: keyof ExpenseRow
  ) => {
    const updatedRows = rows.map((row) =>
      row.key === key ? { ...row, [dataIndex]: value } : row
    );
    setRows(updatedRows);
  };

  const totalAmount = rows.reduce(
    (sum, row) => sum + Number(row.amount || 0),
    0
  );

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (_: unknown, record: ExpenseRow) => (
        <DatePicker
          value={record.date}
          onChange={(date) => handleChange(date, record.key, "date")}
        />
      ),
    },
    {
      title: "Ref. No.",
      dataIndex: "refNo",
      render: (_: unknown, record: ExpenseRow) => (
        <Input
          value={record.refNo}
          onChange={(e) => handleChange(e.target.value, record.key, "refNo")}
        />
      ),
    },
    {
      title: "Mode",
      dataIndex: "mode",
      render: (_: unknown, record: ExpenseRow) => (
        <Input
          value={record.mode}
          onChange={(e) => handleChange(e.target.value, record.key, "mode")}
        />
      ),
    },
    {
      title: "Nominal Account",
      dataIndex: "nominalAccount",
      render: (_: unknown, record: ExpenseRow) => (
        <Input
          value={record.nominalAccount}
          onChange={(e) =>
            handleChange(e.target.value, record.key, "nominalAccount")
          }
        />
      ),
    },
    {
      title: "Project",
      dataIndex: "project",
      render: (_: unknown, record: ExpenseRow) => (
        <Input
          value={record.project}
          onChange={(e) => handleChange(e.target.value, record.key, "project")}
        />
      ),
    },
    {
      title: "Details",
      dataIndex: "details",
      render: (_: unknown, record: ExpenseRow) => (
        <Input
          value={record.details}
          onChange={(e) => handleChange(e.target.value, record.key, "details")}
        />
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (_: unknown, record: ExpenseRow) => (
        <InputNumber
          value={record.amount}
          min={0}
          onChange={(value) => handleChange(value, record.key, "amount")}
        />
      ),
    },
    {
      title: "",
      dataIndex: "actions",
      render: (_: unknown, record: ExpenseRow) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeRow(record.key)}
        />
      ),
    },
  ];

  return (
    <div>
      <Flex gap={16} style={{ marginBottom: 24 }}>
        <Select placeholder="Select Bank" style={{ width: 250 }}>
          <Option value="bank1">Algo Bricks (230903) PKR</Option>
        </Select>

        <Select placeholder="Select Project" style={{ width: 250 }}>
          <Option value="project1">Project 1</Option>
          <Option value="project2">Project 2</Option>
        </Select>
      </Flex>

      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        bordered
        size="small"
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={6}>
              <strong>Total</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1}>
              <strong>{totalAmount.toFixed(2)}</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2} />
          </Table.Summary.Row>
        )}
      />

      <Flex justify="space-between" style={{ marginTop: 16 }}>
        <Button type="dashed" icon={<PlusOutlined />} onClick={addRow}>
          Add More
        </Button>

        <Flex gap={12}>
          <Button>Cancel</Button>
          <Button type="primary">Save</Button>
        </Flex>
      </Flex>
    </div>
  );
};

export default AddExpenses;
