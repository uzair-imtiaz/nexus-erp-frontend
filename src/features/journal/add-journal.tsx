import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Flex,
  Input,
  InputNumber,
  Select,
  Space,
  Table,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { JournalEntryRow, NominalAccount } from "./types";

const { Option } = Select;

const nominalAccounts: NominalAccount[] = [
  { label: "Accruals (110101)", value: "110101" },
  { label: "Accrued Income (220701)", value: "220701" },
];

const JournalEntry = () => {
  const [data, setData] = useState<JournalEntryRow[]>([
    {
      key: 1,
      nominalAccount: null,
      project: "",
      description: "",
      debit: 0,
      credit: 0,
    },
  ]);
  const [date, setDate] = useState(dayjs());
  const [refNo, setRefNo] = useState("");

  const handleChange = (
    value: string | number,
    recordKey: number,
    field: keyof JournalEntryRow
  ) => {
    const newData = [...data];
    const item = newData.find((d) => d.key === recordKey);
    if (item) {
      if (field === "debit" || field === "credit") {
        (item[field] as number) = Number(value);
      } else {
        (item[field] as string) = value as string;
      }
      setData(newData);
    }
  };

  const addRow = () => {
    const newKey = data.length ? Math.max(...data.map((d) => d.key)) + 1 : 1;
    setData([
      ...data,
      {
        key: newKey,
        nominalAccount: null,
        project: "",
        description: "",
        debit: 0,
        credit: 0,
      },
    ]);
  };

  const totalDebit = data.reduce((sum, r) => sum + (r.debit || 0), 0);
  const totalCredit = data.reduce((sum, r) => sum + (r.credit || 0), 0);

  const columns = [
    {
      title: "Nominal Account",
      dataIndex: "nominalAccount",
      width: 250,
      render: (value: string | null, record: JournalEntryRow) => (
        <Select
          placeholder="Select Account"
          value={value}
          style={{ width: 250 }}
          onChange={(val: string) =>
            handleChange(val, record.key, "nominalAccount")
          }
        >
          {nominalAccounts.map((acc) => (
            <Option key={acc.value} value={acc.value}>
              {acc.label}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (value: string, record: JournalEntryRow) => (
        <Input
          value={value}
          onChange={(e) =>
            handleChange(e.target.value, record.key, "description")
          }
        />
      ),
    },
    {
      title: "Debit",
      dataIndex: "debit",
      render: (value: number, record: JournalEntryRow) => (
        <InputNumber
          min={0}
          value={value}
          onChange={(val: number | null) =>
            handleChange(val || 0, record.key, "debit")
          }
        />
      ),
    },
    {
      title: "Credit",
      dataIndex: "credit",
      render: (value: number, record: JournalEntryRow) => (
        <InputNumber
          min={0}
          value={value}
          onChange={(val: number | null) =>
            handleChange(val || 0, record.key, "credit")
          }
        />
      ),
    },
    {
      title: "Action",
      render: (_: any, record: JournalEntryRow) => (
        <Space>
          <Button
            size="small"
            danger
            onClick={() => removeRow(record.key)}
            icon={<DeleteOutlined />}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <DatePicker value={date} onChange={setDate} />
        <Input
          placeholder="Ref No"
          value={refNo}
          onChange={(e) => setRefNo(e.target.value)}
        />
      </Space>

      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        bordered
        size="small"
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={3}>
              <strong>Total</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1}>
              <strong>{totalDebit.toFixed(2)}</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2}>
              <strong>{totalCredit.toFixed(2)}</strong>
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

export default JournalEntry;
function removeRow(key: number): void {
  throw new Error("Function not implemented.");
}
