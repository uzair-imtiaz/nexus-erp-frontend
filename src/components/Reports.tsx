import React, { useState } from 'react';
import { 
  BarChart2, 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const Reports = () => {
  const [reportType, setReportType] = useState('inventory');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Mock data for reports including new profit/loss report
  const mockReportData = {
    inventory: {
      title: "Inventory Stock Status",
      columns: ["Product ID", "Name", "Category", "Quantity", "Avg. Cost", "Value"],
      rows: [
        { id: "ITEM-10001", name: "Raw Material A", category: "Raw Material", quantity: "1,250 KG", avgCost: "$5.00", value: "$6,250.00" },
        { id: "ITEM-10002", name: "Raw Material B", category: "Raw Material", quantity: "320 KG", avgCost: "$12.00", value: "$3,840.00" },
        { id: "ITEM-10003", name: "Raw Material C", category: "Raw Material", quantity: "500 L", avgCost: "$15.00", value: "$7,500.00" },
        { id: "ITEM-10006", name: "Semi-Finished X", category: "Semi-Finished Goods", quantity: "200 KG", avgCost: "$25.00", value: "$5,000.00" },
        { id: "ITEM-10004", name: "Finished Product X", category: "Finished Goods", quantity: "540 PCS", avgCost: "$50.00", value: "$27,000.00" },
        { id: "ITEM-10005", name: "Finished Product Y", category: "Finished Goods", quantity: "85 PCS", avgCost: "$60.00", value: "$5,100.00" }
      ],
      summary: { totalValue: "$54,690.00" }
    },
    profitLoss: {
      title: "Profit & Loss Statement",
      columns: ["Category", "Amount"],
      rows: [
        { category: "Sales Revenue", amount: "$45,000.00", type: "income" },
        { category: "Cost of Goods Sold", amount: "($28,500.00)", type: "expense" },
        { category: "Gross Profit", amount: "$16,500.00", type: "profit", isTotal: true },
        { category: "Operating Expenses", amount: "", type: "header" },
        { category: "   Raw Material Wastage", amount: "($1,200.00)", type: "expense" },
        { category: "   Production Overhead", amount: "($3,500.00)", type: "expense" },
        { category: "   Administrative Expenses", amount: "($2,800.00)", type: "expense" },
        { category: "Total Operating Expenses", amount: "($7,500.00)", type: "expense", isTotal: true },
        { category: "Operating Profit", amount: "$9,000.00", type: "profit", isTotal: true },
        { category: "Other Income", amount: "$500.00", type: "income" },
        { category: "Net Profit", amount: "$9,500.00", type: "profit", isTotal: true }
      ],
      summary: { 
        revenue: "$45,500.00",
        expenses: "$36,000.00",
        profit: "$9,500.00"
      }
    },
    purchases: {
      title: "Purchase History",
      columns: ["ID", "Date", "Vendor", "Items", "Total"],
      rows: [
        { id: "PUR-10042", date: "05/17/2025", vendor: "Vendor ABC", items: "2", total: "$1,490.00" },
        { id: "PUR-10041", date: "05/14/2025", vendor: "Vendor DEF", items: "1", total: "$3,000.00" }
      ],
      summary: { totalPurchases: "$4,490.00" }
    },
    sales: {
      title: "Sales History",
      columns: ["ID", "Date", "Customer", "Items", "Total"],
      rows: [
        { id: "SALE-10128", date: "05/16/2025", customer: "Customer XYZ", items: "1", total: "$3,000.00" },
        { id: "SALE-10127", date: "05/13/2025", customer: "Customer UVW", items: "2", total: "$1,920.00" }
      ],
      summary: { totalSales: "$4,920.00" }
    },
    production: {
      title: "Production History",
      columns: ["ID", "Date", "Product", "Quantity", "Cost"],
      rows: [
        { id: "PROD-10001", date: "05/15/2025", product: "Finished Product X", quantity: "200 PCS", cost: "$1,220.00" },
        { id: "PROD-10002", date: "05/14/2025", product: "Finished Product Y", quantity: "100 PCS", cost: "$1,450.00" }
      ],
      summary: { totalProduction: "$2,670.00" }
    }
  };

  const currentReport = mockReportData[reportType as keyof typeof mockReportData];

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value
    });
  };

  const handleExportReport = () => {
    alert(`Exporting ${currentReport.title} report`);
  };

  const renderProfitLossRow = (row: any) => {
    const getStyle = () => {
      if (row.type === 'header') return 'font-medium text-gray-700';
      if (row.type === 'profit' && row.isTotal) return 'font-bold text-green-600';
      if (row.type === 'expense' && row.isTotal) return 'font-bold text-red-600';
      if (row.type === 'income') return 'text-green-600';
      if (row.type === 'expense') return 'text-red-600';
      return '';
    };

    return (
      <tr className={`${row.isTotal ? 'border-t border-gray-200' : ''} ${row.type === 'header' ? 'bg-gray-50' : ''}`}>
        <td className={`px-6 py-4 whitespace-nowrap text-sm ${getStyle()}`}>
          {row.category}
        </td>
        <td className={`px-6 py-4 whitespace-nowrap text-sm ${getStyle()} text-right`}>
          {row.amount}
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Generate Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="inventory">Inventory Stock Status</option>
              <option value="profitLoss">Profit & Loss Statement</option>
              <option value="purchases">Purchase History</option>
              <option value="sales">Sales History</option>
              <option value="production">Production History</option>
            </select>
          </div>
          
          {reportType !== 'inventory' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateRangeChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateRangeChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </>
          )}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            onClick={handleExportReport}
          >
            <FileText size={18} />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-800 flex items-center">
            <BarChart2 className="mr-2 text-primary-600" size={20} />
            {currentReport.title}
            {reportType !== 'inventory' && (
              <span className="ml-2 text-sm text-gray-500 flex items-center">
                <Calendar size={14} className="mr-1" />
                {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}
              </span>
            )}
          </h3>
          <button 
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
            onClick={handleExportReport}
          >
            <Download size={16} />
            <span className="text-sm">Export</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {reportType === 'profitLoss' ? (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentReport.rows.map((row: any, index: number) => renderProfitLossRow(row))}
                </tbody>
              </table>
              <div className="p-6 bg-gray-50 border-t grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                  <p className="text-xl font-semibold text-green-600 flex items-center justify-center">
                    <TrendingUp size={20} className="mr-2" />
                    {currentReport.summary.revenue}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                  <p className="text-xl font-semibold text-red-600 flex items-center justify-center">
                    <TrendingDown size={20} className="mr-2" />
                    {currentReport.summary.expenses}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-500">Net Profit</p>
                  <p className="text-xl font-semibold text-green-600">
                    {currentReport.summary.profit}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {currentReport.columns.map((column: string, index: number) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentReport.rows.map((row: any, rowIndex: number) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {Object.values(row).map((cell: any, cellIndex: number) => (
                      <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {reportType === 'inventory' && (
          <div className="px-6 py-4 bg-gray-50 border-t">
            <p className="text-sm font-medium text-gray-900">
              Total Inventory Value: <span className="text-primary-600">{currentReport.summary.totalValue}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;