import React, { useState } from 'react';
import { 
  Plus, 
  Download, 
  Upload, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  X,
  ShoppingCart,
  DollarSign,
  Filter,
  ChevronsUpDown
} from 'lucide-react';
import PurchaseForm from './purchase-sale/PurchaseForm';
import SaleForm from './purchase-sale/SaleForm';
import ViewTransactionModal from './purchase-sale/ViewTransactionModal';
import { Transaction, TransactionType } from './purchase-sale/types';
import { mockTransactions } from './purchase-sale/mockData';

const PurchaseSale = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TransactionType>('purchase');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter transactions based on active tab, search term, and sorting
  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesTab = transaction.type === activeTab;
      const matchesSearch = 
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        transaction.entity.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === 'id') {
        comparison = a.id.localeCompare(b.id);
      } else if (sortField === 'entity') {
        comparison = a.entity.name.localeCompare(b.entity.name);
      } else if (sortField === 'total') {
        comparison = a.totalAmount - b.totalAmount;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions([newTransaction, ...transactions]);
    setShowAddModal(false);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setShowAddModal(true);
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setShowViewModal(true);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(transactions.filter(transaction => transaction.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'purchase' 
              ? 'text-primary-600 border-b-2 border-primary-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('purchase')}
        >
          <span className="flex items-center gap-2">
            <ShoppingCart size={18} />
            Purchases
          </span>
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'sale' 
              ? 'text-primary-600 border-b-2 border-primary-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('sale')}
        >
          <span className="flex items-center gap-2">
            <DollarSign size={18} />
            Sales
          </span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder={`Search ${activeTab === 'purchase' ? 'purchases' : 'sales'}...`}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            onClick={() => {
              setCurrentTransaction(null);
              setShowAddModal(true);
            }}
          >
            <Plus size={18} />
            <span>Add New {activeTab === 'purchase' ? 'Purchase' : 'Sale'}</span>
          </button>
          <button
            className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Download size={18} />
            <span>Download</span>
          </button>
          <button
            className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Upload size={18} />
            <span>Import</span>
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    Transaction ID
                    <ChevronsUpDown size={16} className="ml-1" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center">
                    Date
                    <ChevronsUpDown size={16} className="ml-1" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('entity')}
                >
                  <div className="flex items-center">
                    {activeTab === 'purchase' ? 'Vendor' : 'Customer'}
                    <ChevronsUpDown size={16} className="ml-1" />
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('total')}
                >
                  <div className="flex items-center">
                    Total Amount
                    <ChevronsUpDown size={16} className="ml-1" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.entity.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${transaction.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewTransaction(transaction)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleEditTransaction(transaction)}
                        className="text-amber-600 hover:text-amber-900"
                        title="Edit transaction"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete transaction"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTransactions.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No {activeTab === 'purchase' ? 'purchases' : 'sales'} found.
          </div>
        )}
      </div>

      {/* Add/Edit Transaction Modal */}
      {showAddModal && (
        activeTab === 'purchase' ? (
          <PurchaseForm
            transaction={currentTransaction as Transaction & { type: 'purchase' } || undefined}
            onSave={handleAddTransaction}
            onClose={() => setShowAddModal(false)}
          />
        ) : (
          <SaleForm
            transaction={currentTransaction as Transaction & { type: 'sale' } || undefined}
            onSave={handleAddTransaction}
            onClose={() => setShowAddModal(false)}
          />
        )
      )}

      {/* View Transaction Modal */}
      {showViewModal && currentTransaction && (
        <ViewTransactionModal
          transaction={currentTransaction}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
};

export default PurchaseSale;