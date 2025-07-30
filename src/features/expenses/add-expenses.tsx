import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Flex,
  Input,
  InputNumber,
  notification,
  Table,
  Typography,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaginatedSelect from "../../components/common/paginated-select/paginated-select";
import { getBanks } from "../../services/bank-services";
import { getAccounts } from "../../services/charts-of-accounts.services";
import {
  addExpenseApi,
  getExpenseApi,
  updateExpenseApi,
} from "../../services/expense.services";
import { ACCOUNT_TYPE } from "../charts-of-accounts/utils";
import { ExpenseRow } from "./types";

const AddExpenses = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [date, setDate] = useState<Dayjs>(dayjs());
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
      title: "Nominal Account",
      dataIndex: "nominalAccount",
      width: 300,
      render: (_: unknown, record: ExpenseRow) => (
        <PaginatedSelect
          api={getAccounts}
          apiParams={{ types: [ACCOUNT_TYPE[3].value] }}
          optionsFormatter={(items: any[]) =>
            items
              .filter((item) => !item.code.endsWith("cr"))
              .map((item) => ({
                value: item.id,
                label: `${item.name} (${item.code})`,
                name: item.name,
              }))
          }
          queryParamName="name"
          placeholder="Select Nominal Account"
          style={{ width: 300 }}
          value={record.nominalAccount}
          onChange={(value) =>
            handleChange(value, record.key, "nominalAccount")
          }
        />
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
        date: dayjs(date).format("YYYY-MM-DD"),
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
        <PaginatedSelect
          api={getBanks}
          queryParamName="name"
          placeholder="Select Bank Account"
          style={{ width: 250 }}
          labelExtractor={(item) => `${item.name}`}
          value={selectedBank}
          onChange={(value) => setSelectedBank(value)}
        />

        <Input
          style={{ width: 350 }}
          placeholder="Description"
          value={description}
          allowClear
          onChange={(e) => setDescription(e.target.value)}
        />

        <DatePicker
          style={{ width: 250 }}
          value={date}
          onChange={(value) => setDate(value)}
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
