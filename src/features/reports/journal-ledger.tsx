import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Empty,
  Input,
  notification,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getAccountByTypeApi } from "../../services/charts-of-accounts.services";
import {
  ApiError,
  NominalAccount,
  NominalAccountGroup,
} from "../journal/types";
import { buildQueryString, formatCurrency } from "../../utils";
import { getJournalLedgerReport } from "../../services/reports.services";

const { RangePicker } = DatePicker;
const { OptGroup, Option } = Select;

const columns = [
  //   {
  //     title: "Type",
  //     dataIndex: "type",
  //   },
  {
    title: "Date",
    dataIndex: "date",
    render: (date: string) => dayjs(date).format("DD MMM, YY"),
  },
  {
    title: "Account",
    dataIndex: ["account", "name"],
  },
  {
    title: "V. ID",
    dataIndex: "id",
    render: (id: number) => <a>{id}</a>,
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
      const query: any = { balance_forward: balanceForward };
      if (dateRange) {
        query.date_from = dateRange[0].format("YYYY-MM-DD");
        query.date_to = dateRange[1].format("YYYY-MM-DD");
      }
      if (selectedAccounts.length > 0) {
        query.nominal_account_ids = selectedAccounts;
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

  useEffect(() => {
    const fetchAccounts = async () => {
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
        setAccounts([
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

    fetchAccounts();
  }, []);

  const totalCredit = data.reduce((acc, item) => acc + item.credit, 0);
  const totalDebit = data.reduce((acc, item) => acc + item.debit, 0);
  const totalBalance = totalDebit - totalCredit;

  return (
    <div className="p-6">
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
          {/* <Col span={4}>
            <Select defaultValue="This Month" style={{ width: "100%" }}>
              <Select.Option value="this_month">This Month</Select.Option>
              <Select.Option value="last_month">Last Month</Select.Option>
            </Select>
          </Col> */}
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
            <Select
              mode="multiple"
              placeholder="Select Account"
              style={{ width: 250 }}
              onChange={setSelectedAccounts}
              maxTagCount={"responsive"}
              allowClear
              filterOption={(input, option) =>
                option?.label
                  ?.toLowerCase?.()
                  ?.includes?.(input?.toLowerCase?.())
              }
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
              options={accounts}
              loading={loading}
            >
              {accounts.map((group) => (
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
