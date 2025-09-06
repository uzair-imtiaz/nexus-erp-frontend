import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Collapse,
  DatePicker,
  Divider,
  Flex,
  Spin,
  Table,
  Typography,
  notification,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { getProfitLossReport } from "../../services/reports.services";
import { buildQueryString, formatCurrency } from "../../utils";

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { RangePicker } = DatePicker;

const LineItem: React.FC<{
  label: React.ReactNode;
  value?: number;
  indent?: number;
}> = ({ label, value, indent = 0 }) => (
  <div
    className="flex justify-between items-baseline py-1"
    style={{ paddingLeft: indent * 20 }}
  >
    <Text strong>{label}</Text>
    {value !== undefined && <Text strong>{formatCurrency(value)}</Text>}
  </div>
);

const EntryTable: React.FC<{
  entries: Record<string, any>;
  total: number;
}> = ({ entries, total }) => {
  return (
    <>
      <Table
        columns={[
          { title: "Account", dataIndex: "name", key: "name" },
          {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (a) => (
              <span style={{ color: a > 0 ? "#52c41a" : "#d9d9d9" }}>{a}</span>
            ),
          },
        ]}
        dataSource={entries.accounts}
        pagination={false}
        bordered
        size="small"
      />
      <div className="flex justify-end font-semibold pr-4 pt-2">
        <div>Balance: {formatCurrency(total)}</div>
      </div>
    </>
  );
};

const Section: React.FC<{
  title: string;
  total: number;
  data: Record<string, any>;
}> = ({ title, data, total }) => {
  return (
    <Collapse defaultActiveKey={[title]} className="mb-4">
      <Panel
        header={
          <div className="flex justify-between w-full">
            <Title level={5} className="m-0">
              {title}
            </Title>
          </div>
        }
        key={title}
      >
        <EntryTable entries={data} total={total} />
      </Panel>
    </Collapse>
  );
};

// const renderNestedItems = (obj: any, indent = 0): any[] => {
//   return Object.entries(obj).flatMap(([label, value], index) => {
//     if (typeof value === "object") {
//       const subItems = renderNestedItems(value, indent + 1);
//       return [
//         {
//           key: `${label}-${index}`,
//           label: label,
//           debit: "",
//           credit: "",
//           balance: "",
//         },
//         ...subItems,
//       ];
//     } else {
//       const isNegative = value < 0;
//       const debit = isNegative ? 0 : value;
//       const credit = isNegative ? Math.abs(value) : 0;
//       return [
//         {
//           key: `${label}-${index}`,
//           label: label,
//           debit: formatAmount(debit),
//           credit: formatAmount(credit),
//           balance: formatAmount(debit - credit),
//         },
//       ];
//     }
//   });
// };

// const calcTotal = (obj: any): number => {
//   return Object.values(obj).reduce((sum, val) => {
//     return sum + (typeof val === "object" ? calcTotal(val) : (val as number));
//   }, 0);
// };

const ProfitLossReport: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null
  );
  const [data, setData] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const queryObj: { date_from?: string; date_to?: string } = {};
      if (dateRange) {
        queryObj.date_from = dateRange[0].format("YYYY-MM-DD");
        queryObj.date_to = dateRange[1].format("YYYY-MM-DD");
      }
      const query = buildQueryString(queryObj);
      const response = await getProfitLossReport(query);
      if (response?.success) {
        setData(response?.data);
      } else {
        notification.error({
          message: "Error",
          description: response?.message,
        });
      }
    } catch (error) {
      notification.error({
        message: "Error",
        description: error,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRangeChange = (range) => {
    if (range) setDateRange(range);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow text-sm">
      <Title level={3}>Profit & Loss Report</Title>
      <Flex gap={6} className="mt-3">
        <RangePicker value={dateRange} onChange={handleRangeChange} />
        <Button icon={<SearchOutlined />} onClick={fetchData}>
          Run Report
        </Button>
      </Flex>
      <Divider />

      {loading ? (
        <div className="mt-40 flex justify-center">
          <Spin />
        </div>
      ) : (
        data && (
          <>
            <Section
              title="Turnover"
              data={data.turnover}
              total={data.turnover.total}
            />
            <Section
              title="Cost Of Sales"
              data={data.costOfSales}
              total={data.costOfSales.total}
            />
            <LineItem
              label={<strong>Gross Profit</strong>}
              value={data.grossProfit}
              indent={0}
            />
            <Divider dashed className="my-3" />
            <Section
              title="Direct Expenses"
              data={data.operatingExpenses}
              total={data.operatingExpenses.total}
            />
            <LineItem
              label={<strong>Operating Profit</strong>}
              value={data.operatingProfit}
              indent={0}
            />
            <Divider dashed className="my-3" />
            <Divider />
            <LineItem
              label={<strong>Earnings Before Tax</strong>}
              value={data.earningsBeforeTax}
              indent={0}
            />
          </>
        )
      )}
    </div>
  );
};

export default ProfitLossReport;
