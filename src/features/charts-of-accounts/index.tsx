import { Input, Space, Switch, Table, Typography } from "antd";
import { useState } from "react";
import { DownOutlined, RightOutlined, SearchOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

// Generate dummy data for the chart of accounts
const generateData = () => {
  // Level 1: Account Groups
  const accountGroups = [
    { key: "1", name: "Equity", type: "accountGroup" },
    { key: "2", name: "Liabilities", type: "accountGroup" },
    { key: "3", name: "Revenue", type: "accountGroup" },
    { key: "4", name: "Assets", type: "accountGroup" },
    { key: "5", name: "Expenses", type: "accountGroup" },
  ];

  // Level 2: Account Types
  const accountTypes = [
    {
      key: "1-1",
      parentKey: "1",
      name: "General Reserves",
      type: "accountType",
      balance: 250000,
    },
    {
      key: "1-2",
      parentKey: "1",
      name: "Profit Account",
      type: "accountType",
      balance: 180000,
    },
    {
      key: "1-3",
      parentKey: "1",
      name: "Partner Share",
      type: "accountType",
      balance: 120000,
    },

    {
      key: "2-1",
      parentKey: "2",
      name: "Current Liabilities",
      type: "accountType",
      balance: 85000,
    },
    {
      key: "2-2",
      parentKey: "2",
      name: "Non-Current Liabilities",
      type: "accountType",
      balance: 320000,
    },

    {
      key: "3-1",
      parentKey: "3",
      name: "Trade Income",
      type: "accountType",
      balance: 450000,
    },
    {
      key: "3-2",
      parentKey: "3",
      name: "Other Income",
      type: "accountType",
      balance: 75000,
    },

    {
      key: "4-1",
      parentKey: "4",
      name: "Current Assets",
      type: "accountType",
      balance: 175000,
    },
    {
      key: "4-2",
      parentKey: "4",
      name: "Non-Current Assets",
      type: "accountType",
      balance: 540000,
    },

    {
      key: "5-1",
      parentKey: "5",
      name: "Operating Expenses",
      type: "accountType",
      balance: 210000,
    },
    {
      key: "5-2",
      parentKey: "5",
      name: "Non-operating Expenses",
      type: "accountType",
      balance: 45000,
    },
    {
      key: "5-3",
      parentKey: "5",
      name: "Other Expenses",
      type: "accountType",
      balance: 30000,
    },
  ];

  // Level 3: Accounts
  const accounts = [
    // Current Assets
    {
      key: "4-1-1",
      parentKey: "4-1",
      name: "Cash & Bank",
      type: "account",
      balance: 85000,
    },
    {
      key: "4-1-2",
      parentKey: "4-1",
      name: "Stock In Hand",
      type: "account",
      balance: 65000,
    },
    {
      key: "4-1-3",
      parentKey: "4-1",
      name: "Trade Receivables",
      type: "account",
      balance: 25000,
    },

    // Non-Current Assets
    {
      key: "4-2-1",
      parentKey: "4-2",
      name: "Land",
      type: "account",
      balance: 200000,
    },
    {
      key: "4-2-2",
      parentKey: "4-2",
      name: "Building",
      type: "account",
      balance: 180000,
    },
    {
      key: "4-2-3",
      parentKey: "4-2",
      name: "Machinery",
      type: "account",
      balance: 120000,
    },
    {
      key: "4-2-4",
      parentKey: "4-2",
      name: "Long-Term Investments",
      type: "account",
      balance: 40000,
    },

    // General Reserves
    {
      key: "1-1-1",
      parentKey: "1-1",
      name: "Bank Openings",
      type: "account",
      balance: 100000,
    },
    {
      key: "1-1-2",
      parentKey: "1-1",
      name: "Customer Openings",
      type: "account",
      balance: 75000,
    },
    {
      key: "1-1-3",
      parentKey: "1-1",
      name: "Stock Openings",
      type: "account",
      balance: 50000,
    },
    {
      key: "1-1-4",
      parentKey: "1-1",
      name: "Supplier Openings",
      type: "account",
      balance: 25000,
    },

    // Current Liabilities
    {
      key: "2-1-1",
      parentKey: "2-1",
      name: "Trade Payables",
      type: "account",
      balance: 30000,
    },
    {
      key: "2-1-2",
      parentKey: "2-1",
      name: "Short-term Loan",
      type: "account",
      balance: 25000,
    },
    {
      key: "2-1-3",
      parentKey: "2-1",
      name: "Salaries Payable",
      type: "account",
      balance: 18000,
    },
    {
      key: "2-1-4",
      parentKey: "2-1",
      name: "Taxes Payable",
      type: "account",
      balance: 12000,
    },

    // Non-Current Liabilities
    {
      key: "2-2-1",
      parentKey: "2-2",
      name: "Long-term Loans",
      type: "account",
      balance: 250000,
    },
    {
      key: "2-2-2",
      parentKey: "2-2",
      name: "Long-term Leases",
      type: "account",
      balance: 70000,
    },

    // Operating Expenses
    {
      key: "5-1-1",
      parentKey: "5-1",
      name: "Salaries",
      type: "account",
      balance: 120000,
    },
    {
      key: "5-1-2",
      parentKey: "5-1",
      name: "Rent",
      type: "account",
      balance: 48000,
    },
    {
      key: "5-1-3",
      parentKey: "5-1",
      name: "Utilities",
      type: "account",
      balance: 42000,
    },

    // Non-operating Expenses
    {
      key: "5-2-1",
      parentKey: "5-2",
      name: "Interest Expense",
      type: "account",
      balance: 35000,
    },
    {
      key: "5-2-2",
      parentKey: "5-2",
      name: "Depreciation",
      type: "account",
      balance: 10000,
    },

    // Trade Income
    {
      key: "3-1-1",
      parentKey: "3-1",
      name: "Product Sales",
      type: "account",
      balance: 300000,
    },
    {
      key: "3-1-2",
      parentKey: "3-1",
      name: "Service Revenue",
      type: "account",
      balance: 150000,
    },

    // Other Income
    {
      key: "3-2-1",
      parentKey: "3-2",
      name: "Interest Income",
      type: "account",
      balance: 40000,
    },
    {
      key: "3-2-2",
      parentKey: "3-2",
      name: "Rental Income",
      type: "account",
      balance: 35000,
    },
  ];

  // Level 4: Sub Accounts
  const subAccounts = [
    // Cash & Bank sub-accounts
    {
      key: "4-1-1-1",
      parentKey: "4-1-1",
      name: "Main Branch Cash",
      type: "subAccount",
      balance: 25000,
    },
    {
      key: "4-1-1-2",
      parentKey: "4-1-1",
      name: "First National Bank",
      type: "subAccount",
      balance: 60000,
    },

    // Stock In Hand sub-accounts
    {
      key: "4-1-2-1",
      parentKey: "4-1-2",
      name: "Raw Materials",
      type: "subAccount",
      balance: 35000,
    },
    {
      key: "4-1-2-2",
      parentKey: "4-1-2",
      name: "Finished Goods",
      type: "subAccount",
      balance: 30000,
    },

    // Trade Receivables sub-accounts
    {
      key: "4-1-3-1",
      parentKey: "4-1-3",
      name: "Customer A",
      type: "subAccount",
      balance: 15000,
    },
    {
      key: "4-1-3-2",
      parentKey: "4-1-3",
      name: "Customer B",
      type: "subAccount",
      balance: 10000,
    },

    // Building sub-accounts
    {
      key: "4-2-2-1",
      parentKey: "4-2-2",
      name: "Main Office",
      type: "subAccount",
      balance: 120000,
    },
    {
      key: "4-2-2-2",
      parentKey: "4-2-2",
      name: "Warehouse",
      type: "subAccount",
      balance: 60000,
    },

    // Machinery sub-accounts
    {
      key: "4-2-3-1",
      parentKey: "4-2-3",
      name: "Production Line A",
      type: "subAccount",
      balance: 70000,
    },
    {
      key: "4-2-3-2",
      parentKey: "4-2-3",
      name: "Production Line B",
      type: "subAccount",
      balance: 50000,
    },

    // Salaries sub-accounts
    {
      key: "5-1-1-1",
      parentKey: "5-1-1",
      name: "Administration",
      type: "subAccount",
      balance: 45000,
    },
    {
      key: "5-1-1-2",
      parentKey: "5-1-1",
      name: "Sales Department",
      type: "subAccount",
      balance: 40000,
    },
    {
      key: "5-1-1-3",
      parentKey: "5-1-1",
      name: "Production Department",
      type: "subAccount",
      balance: 35000,
    },

    // Utilities sub-accounts
    {
      key: "5-1-3-1",
      parentKey: "5-1-3",
      name: "Electricity",
      type: "subAccount",
      balance: 25000,
    },
    {
      key: "5-1-3-2",
      parentKey: "5-1-3",
      name: "Water",
      type: "subAccount",
      balance: 8000,
    },
    {
      key: "5-1-3-3",
      parentKey: "5-1-3",
      name: "Internet & Phone",
      type: "subAccount",
      balance: 9000,
    },

    // Product Sales sub-accounts
    {
      key: "3-1-1-1",
      parentKey: "3-1-1",
      name: "Product A",
      type: "subAccount",
      balance: 180000,
    },
    {
      key: "3-1-1-2",
      parentKey: "3-1-1",
      name: "Product B",
      type: "subAccount",
      balance: 120000,
    },

    // Trade Payables sub-accounts
    {
      key: "2-1-1-1",
      parentKey: "2-1-1",
      name: "Supplier A",
      type: "subAccount",
      balance: 18000,
    },
    {
      key: "2-1-1-2",
      parentKey: "2-1-1",
      name: "Supplier B",
      type: "subAccount",
      balance: 12000,
    },
  ];

  return {
    accountGroups,
    accountTypes,
    accounts,
    subAccounts,
  };
};

const ChartOfAccounts = () => {
  const data = generateData();
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [showBalance, setShowBalance] = useState(true);

  // Combine all data into a flat structure for searching
  const allData = [
    ...data.accountGroups,
    ...data.accountTypes,
    ...data.accounts,
    ...data.subAccounts,
  ];

  // Filter data based on search text
  const filteredData = searchText
    ? allData.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : data.accountGroups;

  // Find parent keys for a given item
  const findParentKeys = (item) => {
    const parentKeys = [];
    let currentItem = item;

    while (currentItem && currentItem.parentKey) {
      parentKeys.push(currentItem.parentKey);
      currentItem = allData.find((i) => i.key === currentItem.parentKey);
    }

    return parentKeys;
  };

  // Get children for a row
  const getChildren = (record) => {
    switch (record.type) {
      case "accountGroup":
        return data.accountTypes.filter(
          (item) => item.parentKey === record.key
        );
      case "accountType":
        return data.accounts.filter((item) => item.parentKey === record.key);
      case "account":
        return data.subAccounts.filter((item) => item.parentKey === record.key);
      default:
        return [];
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);

    if (value) {
      const filteredItems = allData.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );

      // Expand all parent rows when searching
      const keysToExpand = new Set();
      filteredItems.forEach((item) => {
        const parentKeys = findParentKeys(item);
        parentKeys.forEach((key) => keysToExpand.add(key));
      });

      setExpandedRowKeys([...keysToExpand]);
    } else {
      setExpandedRowKeys([]);
    }
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Table columns
  const columns = [
    {
      title: "Account Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => {
        const levelPadding =
          record.type === "accountGroup"
            ? 0
            : record.type === "accountType"
            ? 1
            : record.type === "account"
            ? 2
            : 3;

        return (
          <div
            style={{
              paddingLeft: `${levelPadding * 24}px`,
              display: "flex",
              alignItems: "center",
            }}
          >
            {getChildren(record).length > 0 &&
              (expandedRowKeys.includes(record.key) ? (
                <DownOutlined size={16} className="mr-2" />
              ) : (
                <RightOutlined size={16} className="mr-2" />
              ))}
            <Text
              strong={record.type === "accountGroup"}
              style={{
                fontSize:
                  record.type === "accountGroup"
                    ? 16
                    : record.type === "accountType"
                    ? 15
                    : 14,
              }}
            >
              {text}
            </Text>
          </div>
        );
      },
    },
    {
      title: "Account Type",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (text) => {
        const displayText =
          text === "accountGroup"
            ? "Group"
            : text === "accountType"
            ? "Type"
            : text === "account"
            ? "Account"
            : "Sub Account";

        return <Text>{displayText}</Text>;
      },
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      width: 180,
      render: (text) => {
        return showBalance ? (
          <Text>{formatCurrency(text)}</Text>
        ) : (
          <Text>****</Text>
        );
      },
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <Title level={3} className="mb-1">
          Chart of Accounts
        </Title>
        <Text className="text-gray-500">
          Financial accounts hierarchical structure
        </Text>
      </div>

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search accounts..."
          prefix={<SearchOutlined className="text-gray-400" />}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-64"
          allowClear
        />

        <Space>
          <Text>Show Balance:</Text>
          <Switch
            checked={showBalance}
            onChange={(checked) => setShowBalance(checked)}
          />
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={searchText ? filteredData : data.accountGroups}
        rowKey="key"
        pagination={false}
        expandable={{
          expandedRowKeys,
          onExpand: (expanded, record) => {
            if (expanded) {
              setExpandedRowKeys([...expandedRowKeys, record.key]);
            } else {
              setExpandedRowKeys(
                expandedRowKeys.filter((key) => key !== record.key)
              );
            }
          },
          expandedRowRender: (record) => {
            const children = getChildren(record);
            if (children.length === 0) return null;

            return (
              <Table
                columns={columns}
                dataSource={children}
                rowKey="key"
                pagination={false}
                expandable={{
                  expandedRowKeys,
                  onExpand: (expanded, record) => {
                    if (expanded) {
                      setExpandedRowKeys([...expandedRowKeys, record.key]);
                    } else {
                      setExpandedRowKeys(
                        expandedRowKeys.filter((key) => key !== record.key)
                      );
                    }
                  },
                  expandedRowRender: (record) => {
                    const subChildren = getChildren(record);
                    if (subChildren.length === 0) return null;

                    return (
                      <Table
                        columns={columns}
                        dataSource={subChildren}
                        rowKey="key"
                        pagination={false}
                        expandable={{
                          expandedRowKeys,
                          onExpand: (expanded, record) => {
                            if (expanded) {
                              setExpandedRowKeys([
                                ...expandedRowKeys,
                                record.key,
                              ]);
                            } else {
                              setExpandedRowKeys(
                                expandedRowKeys.filter(
                                  (key) => key !== record.key
                                )
                              );
                            }
                          },
                          expandedRowRender: (record) => {
                            const finalChildren = getChildren(record);
                            if (finalChildren.length === 0) return null;

                            return (
                              <Table
                                columns={columns}
                                dataSource={finalChildren}
                                rowKey="key"
                                pagination={false}
                                showHeader={false}
                              />
                            );
                          },
                        }}
                        showHeader={false}
                      />
                    );
                  },
                }}
                showHeader={false}
              />
            );
          },
        }}
        className="border border-gray-200 rounded-lg shadow-sm"
      />
    </div>
  );
};

export default ChartOfAccounts;
