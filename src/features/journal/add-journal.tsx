import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  notification,
  Select,
  Space,
  Table,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  ApiError,
  JournalEntryRow,
  NominalAccount,
  NominalAccountGroup,
} from "./types";
import { getAccountByTypeApi } from "../../services/charts-of-accounts.services";
import { addJournalApi } from "../../services/journals.services";
import { useNavigate } from "react-router-dom";

const { Option, OptGroup } = Select;

const JournalEntry = () => {
  const [form] = Form.useForm();
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
  const [nominals, setNominals] = useState<NominalAccountGroup[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNominals = async () => {
      try {
        const [l2, l3, l4] = await Promise.all([
          getAccountByTypeApi("accountType"),
          getAccountByTypeApi("account"),
          getAccountByTypeApi("subAccount"),
        ]);
        if (!l2.success || !l3.success || !l4.success) {
          return notification.error({
            message: "Error",
            description: "Something went wrong",
          });
        }
        setNominals([
          {
            label: "Level 2",
            title: "Level 2",
            options: l2.data?.map((l: NominalAccount) => ({
              label: `${l.name} (${l.code})`,
              value: l.id,
            })),
          },
          {
            label: <span>Level 3</span>,
            title: "Level 3",
            options: l3.data?.map((l: NominalAccount) => ({
              label: `${l.name} (${l.code})`,
              value: l.id,
            })),
          },
          {
            label: <span>Level 4</span>,
            title: "Level 4",
            options: l4.data?.map((l: NominalAccount) => ({
              label: `${l.name} (${l.code})`,
              value: l.id,
            })),
          },
        ]);
      } catch (error) {
        const apiError = error as ApiError;
        notification.error({
          message: "Error",
          description: apiError.message || "Something went wrong",
        });
      }
    };

    fetchNominals();
  }, []);

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

  const removeRow = (key: number) => {
    setData(data.filter((item) => item.key !== key));
  };

  const totalDebit = data.reduce((sum, r) => sum + (r.debit || 0), 0);
  const totalCredit = data.reduce((sum, r) => sum + (r.credit || 0), 0);

  const columns = [
    {
      title: "Nominal Account",
      dataIndex: "nominalAccount",
      width: 250,
      render: (value: string | null, record: JournalEntryRow) => (
        <Form.Item
          name={["details", record.key, "nominalAccount"]}
          rules={[{ required: true, message: "Please select an account" }]}
          style={{ margin: 0 }}
        >
          <Select
            placeholder="Select Account"
            value={value}
            style={{ width: 250 }}
            onChange={(val: string) =>
              handleChange(val, record.key, "nominalAccount")
            }
          >
            {nominals.map((group) => (
              <OptGroup
                key={group.title}
                label={
                  <div>
                    <span style={{ fontWeight: 600 }}>{group.label}</span>
                    <Divider style={{ margin: "4px 0" }} />
                  </div>
                }
              >
                {group.options.map((acc: any) => (
                  <Option key={acc.value} value={acc.value}>
                    {acc.label}
                  </Option>
                ))}
              </OptGroup>
            ))}
          </Select>
        </Form.Item>
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
      width: "120",
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
      width: "120",
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

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const payload = {
        ref: values.ref,
        date: values.date,
        description: values.description,
        details: data.map((d) => ({
          nominalAccountId: d.nominalAccount,
          description: d.description,
          debit: d.debit,
          credit: d.credit,
        })),
      };
      const response = await addJournalApi(payload);
      if (!response?.success) {
        notification.error({
          message: "Error",
          description: response?.message,
        });
        return;
      }
      notification.success({
        message: "Success",
        description: "Journal Entry created successfully",
      });
      navigate("/journal");
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.errorFields) {
        notification.error({
          message: "Validation Error",
          description: "Please fill in all required fields",
        });
      } else {
        notification.error({
          message: "Error",
          description: apiError.message || "Something went wrong",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: "Please select a date" }]}
          initialValue={dayjs()}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="ref"
          label="Ref No"
          rules={[
            { required: true, message: "Please enter a reference number" },
          ]}
        >
          <Input placeholder="Ref No" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input placeholder="Description" />
        </Form.Item>
      </Space>

      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        bordered
        size="small"
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={2}>
              <strong>Total</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1}>
              <strong>{totalDebit.toFixed(2)}</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2}>
              <strong>{totalCredit.toFixed(2)}</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3}>
              <strong>{(totalDebit - totalCredit).toFixed(2)}</strong>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />

      <Flex justify="space-between" style={{ marginTop: 16 }}>
        <Button type="dashed" icon={<PlusOutlined />} onClick={addRow}>
          Add More
        </Button>

        <Flex gap={12}>
          <Button onClick={() => navigate("/journal")}>Cancel</Button>
          <Button
            type="primary"
            disabled={totalDebit !== totalCredit}
            onClick={handleSave}
            loading={loading}
          >
            Save
          </Button>
        </Flex>
      </Flex>
    </Form>
  );
};

export default JournalEntry;
