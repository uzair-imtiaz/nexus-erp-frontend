import { formatCurrency, prettifyLabel } from "../../utils";

export const getRowClassName = (record: any) => {
  let className = "";
  if (!record.children || record.children.length === 0)
    className += "not-expandible ";
  switch (record.type) {
    case "accountGroup":
      className += "tr-l1";
      return className;
    case "accountType":
      className += "tr-l2";
      return className;
    case "account":
      className += "tr-l3";
      return className;
    case "subAccount":
      className += "tr-l4";
      return className;
    default:
      return "";
  }
};

export const columnsConfig = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: "18%",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    width: "12%",
    render: (text: string) => prettifyLabel(text),
  },
  {
    title: "Code",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "Path",
    dataIndex: "pathName",
    key: "pathName",
    render: (text: string) => text.split("/").join(" > "),
  },
  {
    title: "Debit Amount",
    dataIndex: "debitAmount",
    key: "debitAmount",
    width: "12%",
    render: (text: number) => formatCurrency(text),
  },
  {
    title: "Credit Amount",
    dataIndex: "creditAmount",
    key: "creditAmount",
    width: "12%",
    render: (text: number) => formatCurrency(text),
  },
  {
    title: "Balance",
    dataIndex: "balance",
    key: "balance",
    width: "12%",
    render: (_, record: any) =>
      formatCurrency(record?.debitAmount - record?.creditAmount),
  },
];

export const ACCOUNT_TYPE = [
  { id: 1, value: "accountGroup", label: "Account Group" },
  { id: 2, value: "accountType", label: "Account Type" },
  { id: 3, value: "account", label: "Account" },
  { id: 4, value: "subAccount", label: "Sub Account" },
];

export const PARENT_MAP: Record<string, string> = {
  accountType: "accountGroup",
  account: "accountType",
  subAccount: "account",
};
