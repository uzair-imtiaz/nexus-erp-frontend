import React, { useState } from 'react';
import { 
  Plus, 
  Download, 
  Upload, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  X 
} from 'lucide-react';

// Mock data for inventory items
const mockInventoryItems = [
  {
    id: 'ITEM-10001',
    name: 'Raw Material A',
    category: 'Raw Material',
    baseUnit: 'KG',
    quantityAvailable: 1250,
    stockValue: 6250.00,
    currentRate: 5.00,
    multiUnits: [
      { name: 'Bag', factor: 25 }
    ]
  },
  {
    id: 'ITEM-10002',
    name: 'Raw Material B',
    category: 'Raw Material',
    baseUnit: 'KG',
    quantityAvailable: 320,
    stockValue: 3840.00,
    currentRate: 12.00,
    multiUnits: [
      { name: 'Bag', factor: 20 }
    ]
  },
  {
    id: 'ITEM-10003',
    name: 'Raw Material C',
    category: 'Raw Material',
    baseUnit: 'L',
    quantityAvailable: 500,
    stockValue: 7500.00,
    currentRate: 15.00,
    multiUnits: [
      { name: 'Drum', factor: 200 }
    ]
  },
  {
    id: 'ITEM-10006',
    name: 'Semi-Finished X',
    category: 'Semi-Finished Goods',
    baseUnit: 'KG',
    quantityAvailable: 200,
    stockValue: 5000.00,
    currentRate: 25.00,
    multiUnits: [
      { name: 'Box', factor: 10 }
    ]
  },
  {
    id: 'ITEM-10004',
    name: 'Finished Product X',
    category: 'Finished Goods',
    baseUnit: 'PCS',
    quantityAvailable: 540,
    stockValue: 27000.00,
    currentRate: 50.00,
    multiUnits: [
      { name: 'Box', factor: 12 }
    ]
  },
  {
    id: 'ITEM-10005',
    name: 'Finished Product Y',
    category: 'Finished Goods',
    baseUnit: 'PCS',
    quantityAvailable: 85,
    stockValue: 5100.00,
    currentRate: 60.00,
    multiUnits: [
      { name: 'Box', factor: 10 }
    ]
  }
];

interface InventoryItem {
  id: string;
  name: string;
  category: 'Raw Material' | 'Semi-Finished Goods' | 'Finished Goods';
  baseUnit: string;
  quantityAvailable: number;
  stockValue: number;
  currentRate: number;
  multiUnits: {
    name: string;
    factor: number;
  }[];
}

const Inventory = () => {
  const [items, setItems] = useState<InventoryItem[]>(mockInventoryItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);

  // Filter items based on search term and category
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = (newItem: InventoryItem) => {
    setItems([...items, newItem]);
    setShowAddModal(false);
  };

  const handleEditItem = (item: InventoryItem) => {
    setCurrentItem(item);
    setShowAddModal(true);
  };

  const handleViewItem = (item: InventoryItem) => {
    setCurrentItem(item);
    setShowViewModal(true);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search inventory..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="Raw Material">Raw Materials</option>
            <option value="Semi-Finished Goods">Semi-Finished Goods</option>
            <option value="Finished Goods">Finished Goods</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            onClick={() => {
              setCurrentItem(null);
              setShowAddModal(true);
            }}
          >
            <Plus size={18} />
            <span>Add New Item</span>
          </button>
          <button
            className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Download size={18} />
            <span>Export</span>
          </button>
          <button
            className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Upload size={18} />
            <span>Import</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Base Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Qty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.baseUnit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.quantityAvailable}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${item.currentRate.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${item.stockValue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewItem(item)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleEditItem(item)}
                        className="text-amber-600 hover:text-amber-900"
                        title="Edit item"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete item"
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
        {filteredItems.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No inventory items found.
          </div>
        )}
      </div>

      {/* Add/Edit Item Modal */}
      {showAddModal && (
        <AddEditItemModal
          item={currentItem || undefined}
          onSave={handleAddItem}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* View Item Modal */}
      {showViewModal && currentItem && (
        <ViewItemModal
          item={currentItem}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
};

interface AddEditItemModalProps {
  item?: InventoryItem;
  onSave: (item: InventoryItem) => void;
  onClose: () => void;
}

const AddEditItemModal: React.FC<AddEditItemModalProps> = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState<InventoryItem>({
    id: item?.id || `ITEM-${Math.floor(Math.random() * 90000) + 10000}`,
    name: item?.name || '',
    category: item?.category || 'Raw Material',
    baseUnit: item?.baseUnit || '',
    quantityAvailable: item?.quantityAvailable || 0,
    stockValue: item?.stockValue || 0,
    currentRate: item?.currentRate || 0,
    multiUnits: item?.multiUnits || []
  });

  const [newUnit, setNewUnit] = useState({ name: '', factor: 1 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantityAvailable' || name === 'currentRate' 
        ? parseFloat(value) 
        : value
    }));
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUnit(prev => ({
      ...prev,
      [name]: name === 'factor' ? parseFloat(value) : value
    }));
  };

  const handleAddUnit = () => {
    if (newUnit.name && newUnit.factor > 0) {
      setFormData(prev => ({
        ...prev,
        multiUnits: [...prev.multiUnits, { ...newUnit }]
      }));
      setNewUnit({ name: '', factor: 1 });
    }
  };

  const handleRemoveUnit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      multiUnits: prev.multiUnits.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const stockValue = formData.quantityAvailable * formData.currentRate;
    onSave({
      ...formData,
      stockValue
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {item ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Code
              </label>
              <input
                type="text"
                name="id"
                value={formData.id}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Raw Material">Raw Material</option>
                <option value="Semi-Finished Goods">Semi-Finished Goods</option>
                <option value="Finished Goods">Finished Goods</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Unit <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="baseUnit"
                value={formData.baseUnit}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity Available
              </label>
              <input
                type="number"
                name="quantityAvailable"
                value={formData.quantityAvailable}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Rate <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="currentRate"
                value={formData.currentRate}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Multi Units</h3>
            {formData.multiUnits.length > 0 && (
              <div className="mb-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Conversion Factor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.multiUnits.map((unit, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {unit.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          1 {unit.name} = {unit.factor} {formData.baseUnit}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <button
                            type="button"
                            onClick={() => handleRemoveUnit(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Add Unit</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Unit Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newUnit.name}
                    onChange={handleUnitChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Box, Bag, etc."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Conversion Factor
                  </label>
                  <input
                    type="number"
                    name="factor"
                    value={newUnit.factor}
                    onChange={handleUnitChange}
                    min="0.01"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={`1 Unit = ? ${formData.baseUnit}`}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleAddUnit}
                    className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    <span>Add Unit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {item ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ViewItemModalProps {
  item: InventoryItem;
  onClose: () => void;
}

const ViewItemModal: React.FC<ViewItemModalProps> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Item Details
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Item Code</p>
              <p className="text-base">{item.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-base">{item.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Category</p>
              <p className="text-base">{item.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Base Unit</p>
              <p className="text-base">{item.baseUnit}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Quantity Available</p>
              <p className="text-base">{item.quantityAvailable} {item.baseUnit}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Current Rate</p>
              <p className="text-base">${item.currentRate.toFixed(2)} per {item.baseUnit}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Stock Value</p>
              <p className="text-base">${item.stockValue.toFixed(2)}</p>
            </div>
          </div>

          {item.multiUnits.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Multi Units</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversion Factor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equivalent Quantity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {item.multiUnits.map((unit, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {unit.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        1 {unit.name} = {unit.factor} {item.baseUnit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(item.quantityAvailable / unit.factor).toFixed(2)} {unit.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="flex justify-end p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inventory;