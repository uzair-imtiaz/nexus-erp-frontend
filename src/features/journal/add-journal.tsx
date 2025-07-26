import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  notification,
  Space,
  Table,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaginatedSelect from "../../components/common/paginated-select/paginated-select";
import { getAccounts } from "../../services/charts-of-accounts.services";
import { addJournalApi } from "../../services/journals.services";
import { ACCOUNT_TYPE } from "../charts-of-accounts/utils";
import { ApiError, JournalEntryRow } from "./types";

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
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
          <PaginatedSelect
            api={getAccounts}
            apiParams={{ types: ACCOUNT_TYPE[3].value }}
            queryParamName="name"
            placeholder="Select Nominals"
            style={{ width: 240 }}
            value={value}
            onChange={(val: string) =>
              handleChange(val, record.key, "nominalAccount")
            }
          />
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
