import React, { useState } from "react";
import { Typography, Divider, Collapse, Table } from "antd";

const { Title, Text } = Typography;
const { Panel } = Collapse;

const formatAmount = (amount: number) =>
  amount.toLocaleString(undefined, { minimumFractionDigits: 2 });

const LineItem: React.FC<{
  label: React.ReactNode;
  value?: number;
  indent?: number;
}> = ({ label, value, indent = 0 }) => (
  <div
    className="flex justify-between items-baseline py-1"
    style={{ paddingLeft: indent * 20 }}
  >
    <Text>{label}</Text>
    {value !== undefined && <Text>{formatAmount(value)}</Text>}
  </div>
);

const EntryTable: React.FC<{
  entries: Record<string, any>;
  indent?: number;
}> = ({ entries, indent = 0 }) => {
  const rows = renderNestedItems(entries, indent);
  const totals = calcDebitCreditBalance(entries);

  return (
    <>
      <Table
        columns={[
          { title: "Account", dataIndex: "label", key: "label" },
          { title: "Debit", dataIndex: "debit", key: "debit" },
          { title: "Credit", dataIndex: "credit", key: "credit" },
          { title: "Balance", dataIndex: "balance", key: "balance" },
        ]}
        dataSource={rows}
        pagination={false}
        bordered
        size="small"
      />
      <div className="flex justify-end font-semibold pr-4 pt-2">
        <div>
          Total Debit: {formatAmount(totals.debit)} &nbsp;|&nbsp; Total Credit:{" "}
          {formatAmount(totals.credit)} &nbsp;|&nbsp; Balance:{" "}
          {formatAmount(totals.debit - totals.credit)}
        </div>
      </div>
    </>
  );
};

const Section: React.FC<{
  title: string;
  data: Record<string, any>;
}> = ({ title, data }) => {
  const total = calcTotal(data);
  return (
    <Collapse defaultActiveKey={[title]} className="mb-4">
      <Panel
        header={
          <div className="flex justify-between w-full">
            <Title level={5} className="m-0">
              {title}
            </Title>
            <Text strong>{formatAmount(total)}</Text>
          </div>
        }
        key={title}
      >
        <EntryTable entries={data} />
      </Panel>
    </Collapse>
  );
};

const renderNestedItems = (obj: any, indent = 0): any[] => {
  return Object.entries(obj).flatMap(([label, value], index) => {
    if (typeof value === "object") {
      const subItems = renderNestedItems(value, indent + 1);
      return [
        {
          key: `${label}-${index}`,
          label: label,
          debit: "",
          credit: "",
          balance: "",
        },
        ...subItems,
      ];
    } else {
      const isNegative = value < 0;
      const debit = isNegative ? 0 : value;
      const credit = isNegative ? Math.abs(value) : 0;
      return [
        {
          key: `${label}-${index}`,
          label: label,
          debit: formatAmount(debit),
          credit: formatAmount(credit),
          balance: formatAmount(debit - credit),
        },
      ];
    }
  });
};

const calcTotal = (obj: any): number => {
  return Object.values(obj).reduce((sum, val) => {
    return sum + (typeof val === "object" ? calcTotal(val) : (val as number));
  }, 0);
};

const calcDebitCreditBalance = (
  obj: any
): { debit: number; credit: number } => {
  let debit = 0;
  let credit = 0;

  const recurse = (data: any) => {
    for (const val of Object.values(data)) {
      if (typeof val === "object") {
        recurse(val);
      } else {
        if (val < 0) credit += Math.abs(val);
        else debit += val;
      }
    }
  };

  recurse(obj);
  return { debit, credit };
};

const data = {
  turnover: {
    "Product Sale": 2479800,
    "Discount Allowed": -186000,
  },
  costOfSales: {
    "Supplies And Materials": 451200,
    "Discount Received": -23500,
  },
  directExpenses: {
    Freight: 300,
  },
  otherDirectCosts: {
    "Hosting and domain": 63075,
  },
  adminExpenses: {
    "Wages & Salaries": 8000,
    "Premises Expenses": 21594,
    "Motor Expenses": {
      "Khusham Vehicle Fuel": 46828,
      "Anas vehicle fuel": 20310,
    },
    "Printing, Postage And Stationery": 14250,
    "Advertising And PR": {
      "Mela Business Expense": 14250,
      "Advertising and PR": 13500,
    },
    "Telephone And Internet": {
      "Telephone and Fax": 3350,
      "Mobile Phone Charges": 11000,
    },
    "Legal And Professional Fees": 900,
    Entertainment: {
      "Staff Meals": 10700,
    },
    "Bad Debt": 5150,
    "Repair and Maintenance": 3400,
  },
};

const ProfitLossReport: React.FC = () => {
  const turnoverTotal = calcTotal(data.turnover);
  const costOfSalesTotal = calcTotal(data.costOfSales);
  const grossProfit = turnoverTotal - costOfSalesTotal;
  const directExpensesTotal = calcTotal(data.directExpenses);
  const otherDirectCostsTotal = calcTotal(data.otherDirectCosts);
  const opProfit = grossProfit - directExpensesTotal - otherDirectCostsTotal;
  const adminTotal = calcTotal(data.adminExpenses);
  const finalProfit = opProfit - adminTotal;

  return (
    <div className="p-6 bg-white rounded-xl shadow text-sm">
      <Title level={4}>Profit & Loss Report</Title>
      <Divider />

      <Section title="Turnover" data={data.turnover} />
      <Section title="Cost Of Sales" data={data.costOfSales} />

      <LineItem
        label={<strong>Gross Profit</strong>}
        value={grossProfit}
        indent={0}
      />

      <Divider dashed className="my-3" />

      <Section title="Direct Expenses" data={data.directExpenses} />
      <Section title="Other Direct Costs" data={data.otherDirectCosts} />

      <LineItem
        label={<strong>Operating Profit</strong>}
        value={opProfit}
        indent={0}
      />

      <Divider dashed className="my-3" />

      <Section title="Administrative Expenses" data={data.adminExpenses} />

      <Divider />

      <LineItem
        label={<strong>Net Profit</strong>}
        value={finalProfit}
        indent={0}
      />
    </div>
  );
};

export default ProfitLossReport;
