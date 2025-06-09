import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Flex,
  Input,
  InputNumber,
  notification,
  Select,
  Table,
  Typography,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { ExpenseRow } from "./types";
import { getBanks } from "../../services/bank-services";
import { getAccountByTypeApi } from "../../services/charts-of-accounts.services";
import { ACCOUNT_TYPE } from "../charts-of-accounts/utils";
import {
  addExpenseApi,
  getExpenseApi,
  updateExpenseApi,
} from "../../services/expense.services";
import { useNavigate, useParams } from "react-router-dom";

const { Option } = Select;

const AddExpenses = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const [banks, setBanks] = useState<any[]>([]);
  const [nominals, setNominals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [description, setDescription] = useState<string>("");
  const [rows, setRows] = useState<ExpenseRow[]>([
    {
      key: 1,
      date: dayjs(),
      nominalAccount: null,
      description: "",
      amount: 0,
    },
  ]);

  const navigate = useNavigate();
  const { Title } = Typography;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [BanksRes, NominalRes] = await Promise.all([
          getBanks(),
          getAccountByTypeApi(ACCOUNT_TYPE[3].value),
        ]);
        if (BanksRes?.success && NominalRes?.success) {
          setBanks(BanksRes?.data);
          setNominals(
            NominalRes?.data.filter(
              (nominal: any) =>
                !nominal.pathName?.includes("General Reserves") &&
                nominal.entityType !== "bank"
            )
          );
        } else {
          notification.error({
            message: "Error",
            description: "Error fetching data",
          });
        }
      } catch (error: any) {
        notification.error({
          message: "Error",
          description: error?.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchExpenseData = async () => {
      if (isEdit && id) {
        try {
          setLoading(true);
          const response = await getExpenseApi(id);
          if (response?.success) {
            const expenseData = response.data;
            setSelectedBank(expenseData.bank.id);
            setDescription(expenseData.description);

            // Transform expense details into rows
            const expenseRows = expenseData.details.map(
              (detail: any, index: number) => ({
                key: index + 1,
                date: dayjs(detail.date),
                nominalAccount: detail.nominalAccount?.id,
                description: detail.description,
                amount: detail.amount,
              })
            );
            setRows(expenseRows);
          }
        } catch (error: any) {
          notification.error({
            message: "Error",
            description: error?.message,
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchExpenseData();
  }, [isEdit, id]);

  const addRow = () => {
    const newRow: ExpenseRow = {
      key: Date.now(),
      date: dayjs(),
      nominalAccount: null,
      description: "",
      amount: 0,
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (key: number) => {
    setRows(rows.filter((row) => row.key !== key));
  };

  const handleChange = (
    value: string | number | Dayjs | {} | null,
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
      width: 180,
      render: (_: unknown, record: ExpenseRow) => (
        <DatePicker
          value={record.date}
          onChange={(date) => handleChange(date, record.key, "date")}
        />
      ),
    },
    {
      title: "Nominal Account",
      dataIndex: "nominalAccount",
      width: 300,
      render: (_: unknown, record: ExpenseRow) => (
        <Select
          loading={loading}
          placeholder="Select Nominal Account"
          style={{ width: 300 }}
          value={record.nominalAccount}
          allowClear
          onChange={(value) =>
            handleChange(value, record.key, "nominalAccount")
          }
        >
          {nominals.map((nominal) => (
            <Option key={nominal.id} value={nominal.id}>
              {`${nominal.name}  (${nominal.code})`}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (_: unknown, record: ExpenseRow) => (
        <Input
          placeholder="Description..."
          value={record.description}
          onChange={(e) =>
            handleChange(e.target.value, record.key, "description")
          }
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
      title: "Action",
      dataIndex: "actions",
      render: (_: unknown, record: ExpenseRow) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeRow(record.key)}
        />
      ),
    },
  ];

  const onSubmit = async () => {
    try {
      setSubmitLoading(true);
      const payload = {
        bankId: selectedBank,
        description: description,
        details: rows.map((row) => ({
          nominalAccountId: row.nominalAccount,
          description: row.description,
          amount: row.amount,
        })),
      };

      const response = isEdit
        ? await updateExpenseApi(id, payload)
        : await addExpenseApi(payload);

      if (response?.success) {
        notification.success({
          message: "Success",
          description: response?.message,
        });
        navigate("/expenses");
      } else {
        notification.error({
          message: "Error",
          description: response?.message,
        });
      }
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error?.message,
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <Title level={3}>Add Expense</Title>
      <Flex gap={16} style={{ marginBottom: 24 }}>
        <Select
          placeholder="Select Bank"
          style={{ width: 250 }}
          allowClear
          value={selectedBank}
          onChange={(value) => setSelectedBank(value)}
          loading={loading}
        >
          {banks.map((bank) => (
            <Option key={bank.id} value={bank.id}>
              {`${bank.name} (PKR ${bank.currentBalance})`}
            </Option>
          ))}
        </Select>

        <Input
          style={{ width: 350 }}
          placeholder="Description"
          value={description}
          allowClear
          onChange={(e) => setDescription(e.target.value)}
        />
      </Flex>

      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        loading={loading}
        size="small"
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={3}>
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
          <Button onClick={() => navigate("/expenses")}>Cancel</Button>
          <Button type="primary" loading={submitLoading} onClick={onSubmit}>
            {isEdit ? "Update" : "Save"}
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};

export default AddExpenses;
