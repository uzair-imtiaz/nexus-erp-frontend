import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  notification,
  Row,
  Spin,
  Table,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import PaginatedSelect from "../../components/common/paginated-select/paginated-select";
import { getAccounts } from "../../services/charts-of-accounts.services";
import { getTrialBalanceReport } from "../../services/reports.services";
import { buildQueryString, formatCurrency } from "../../utils";
import { ACCOUNT_TYPE } from "../charts-of-accounts/utils";

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface TrialBalanceEntry {
  key: string;
  name: string;
  debit?: number;
  credit?: number;
}

const columns = [
  {
    title: "Account",
    dataIndex: "name",
    key: "account",
    render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
  },
  {
    title: "Debit",
    dataIndex: "debit",
    key: "debit",
    align: "right" as const,
    render: (value: number) => (value ? formatCurrency(value) : "-"),
  },
  {
    title: "Credit",
    dataIndex: "credit",
    key: "credit",
    align: "right" as const,
    render: (value: number) => (value ? formatCurrency(value) : "-"),
  },
];

const TrialBalance: React.FC = () => {
  const [data, setData] = useState<TrialBalanceEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );
  const [nominalAccounts, setNominalAccounts] = useState<string[]>([]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const query: any = {};
      if (dateRange) {
        query.date_from = dateRange[0].format("YYYY-MM-DD");
        query.date_to = dateRange[1].format("YYYY-MM-DD");
      }
      if (nominalAccounts.length > 0) {
        query.nominal_account_ids = nominalAccounts;
      }

      const queryString = buildQueryString(query);
      const response = await getTrialBalanceReport(queryString);
      if (response.success) {
        setData(response.data);
      } else {
        notification.error({
          message: "Error",
          description: response.message,
        });
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
      notification.error({
        message: "Error",
        description: "Failed to load trial balance data.",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalDebit = data.reduce((sum, row) => sum + (row.debit || 0), 0);
  const totalCredit = data.reduce((sum, row) => sum + (row.credit || 0), 0);

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <Title level={3}>Trial Balance Report</Title>

      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={16} md={8}>
          <RangePicker
            value={dateRange}
            onChange={(dates) =>
              setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])
            }
            style={{ width: "100%" }}
            allowClear
          />
        </Col>
        <Col xs={24} md={6}>
          <PaginatedSelect
            api={getAccounts}
            apiParams={{ types: ACCOUNT_TYPE[3].value }}
            queryParamName="name"
            mode="multiple"
            placeholder="Select Nominals"
            maxTagCount={"responsive"}
            maxTagPlaceholder={(omittedValues) => (
              <Tooltip
                styles={{ root: { pointerEvents: "none" } }}
                title={omittedValues.map(({ label }) => (
                  <div>{label}</div>
                ))}
              >
                <span>+{omittedValues.length} more...</span>
              </Tooltip>
            )}
            style={{ width: 300 }}
            value={nominalAccounts}
            onChange={setNominalAccounts}
          />
        </Col>
        <Button
          className="mr-2"
          icon={<ReloadOutlined />}
          onClick={() => {
            setDateRange(null);
            setNominalAccounts([]);
          }}
        >
          Clear
        </Button>
        <Button
          type="primary"
          onClick={fetchReportData}
          icon={<SearchOutlined />}
        >
          Search
        </Button>
      </Row>

      <Spin spinning={loading}>
        {data.length > 0 && (
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
            rowKey="key"
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>
                  <strong>Total</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <strong>{formatCurrency(totalDebit)}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} align="right">
                  <strong>{formatCurrency(totalCredit)}</strong>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
            rowClassName={(_, index) =>
              index % 2 === 0 ? "bg-gray-50" : "bg-white"
            }
          />
        )}
      </Spin>
    </div>
  );
};

export default TrialBalance;
