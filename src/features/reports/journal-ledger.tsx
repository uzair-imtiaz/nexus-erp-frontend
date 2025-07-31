import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Empty,
  Input,
  notification,
  Row,
  Table,
  Tooltip,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import PaginatedSelect from "../../components/common/paginated-select/paginated-select";
import { getAccounts } from "../../services/charts-of-accounts.services";
import { getJournalLedgerReport } from "../../services/reports.services";
import { buildQueryString, formatCurrency } from "../../utils";
import { ACCOUNT_TYPE } from "../charts-of-accounts/utils";
import { NominalAccountGroup } from "../journal/types";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const columns = [
  //   {
  //     title: "Type",
  //     dataIndex: "type",
  //   },
  {
    title: "Date",
    dataIndex: "date",
    render: (date: string) => dayjs(date).format("DD MMM, YY"),
    width: 100,
  },
  {
    title: "Account",
    dataIndex: ["account", "name"],
  },
  {
    title: "V. ID",
    dataIndex: "id",
    render: (id: number) => <a>{id}</a>,
    width: 70,
  },
  {
    title: "Ref",
    dataIndex: "ref",
  },
  {
    title: "Description",
    dataIndex: "description",
  },
  {
    title: "Debit",
    dataIndex: "debit",
    align: "right" as const,
    render: (value: number) => value?.toFixed(2),
  },
  {
    title: "Credit",
    dataIndex: "credit",
    align: "right" as const,
    render: (value: number) => value?.toFixed(2),
  },
  {
    title: "Balance",
    dataIndex: "balance",
    align: "right" as const,
    render: (value: number) => value?.toFixed(2),
  },
];

const JournalLedger = () => {
  const [data, setData] = useState([]);
  const [accounts, setAccounts] = useState<NominalAccountGroup[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);
  const [balanceForward, setBalanceForward] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );
  const fetchReportData = async () => {
    try {
      setLoading(true);
      const query: any = {};
      if (dateRange) {
        query.date_from = dateRange[0].format("YYYY-MM-DD");
        query.date_to = dateRange[1].format("YYYY-MM-DD");
      }
      if (selectedAccounts.length > 0) {
        query.nominal_account_ids = selectedAccounts;
      }
      if (balanceForward) {
        query.balance_forward = true;
      }

      const queryString = buildQueryString(query);
      const response = await getJournalLedgerReport(queryString);
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

  const groupOptions = (options) => {
    const groups = {};

    options.forEach((option) => {
      const level = option.path.split("/").length;
      if (!groups[level]) {
        groups[level] = [];
      }
      groups[level].push(option);
    });

    const groupedOptions = Object.entries(groups).map(([level, groups]) => ({
      label: <span>Level {level}</span>,
      title: `Level ${level}`,
      options: groups.map((group) => ({
        label: `${group.name} (${group.code})`,
        value: group.id,
        key: group.id,
      })),
    }));

    return groupedOptions;
  };

  const totalCredit = data.reduce((acc, item) => acc + item.credit, 0);
  const totalDebit = data.reduce((acc, item) => acc + item.debit, 0);
  const totalBalance = totalDebit - totalCredit;

  return (
    <div className="p-6">
      <Title level={3}>Journal Ledger</Title>
      <Card title="Report Criteria" className="mb-6">
        <Row gutter={16}>
          <Col span={3}>
            <Checkbox
              checked={balanceForward}
              onChange={(e) => setBalanceForward(e.target.checked)}
            >
              B/FWD
            </Checkbox>
          </Col>
          <Col span={6}>
            <RangePicker
              defaultValue={[dayjs("2025-07-01"), dayjs("2025-07-31")]}
              format="DD/MM/YYYY"
              onChange={(dates) =>
                setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])
              }
              allowClear
            />
          </Col>
          <Col span={6}>
            <PaginatedSelect
              api={getAccounts}
              apiParams={{
                types: ACCOUNT_TYPE.map((t) => t.value),
                limit: Number.MAX_SAFE_INTEGER,
              }}
              queryParamName="name"
              mode="multiple"
              append={false}
              optionsGrouper={groupOptions}
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
              onChange={setSelectedAccounts}
            />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Button
              type="primary"
              onClick={fetchReportData}
              loading={loading}
              icon={<SearchOutlined />}
            >
              Run Report
            </Button>
          </Col>
        </Row>
      </Card>

      <Card>
        {data?.length > 0 ? (
          <>
            <Row className="mb-4">
              <Col>
                <Input placeholder="Search..." prefix={<SearchOutlined />} />
              </Col>
            </Row>
            <Table
              dataSource={data}
              columns={columns}
              pagination={false}
              bordered
              loading={loading}
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={5}>
                      <strong>Total</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={6} align="right">
                      <strong>{formatCurrency(totalDebit)}</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={7} align="right">
                      <strong>{formatCurrency(totalCredit)}</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={8} align="right">
                      <strong>{formatCurrency(totalBalance)}</strong>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Card>
    </div>
  );
};

export default JournalLedger;
