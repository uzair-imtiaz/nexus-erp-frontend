import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Transaction, Entity, InventoryItem, TransactionItem } from './types';
import { mockEntities, mockInventoryItems } from './mockData';

interface PurchaseFormProps {
  transaction?: Transaction & { type: 'purchase' };
  onSave: (transaction: Transaction) => void;
  onClose: () => void;
}

const PurchaseForm: React.FC<PurchaseFormProps> = ({ transaction, onSave, onClose }) => {
  const isEditing = !!transaction;
  
  const [formData, setFormData] = useState({
    id: transaction ? transaction.id : `PUR-${Math.floor(10000 + Math.random() * 90000)}`,
    date: transaction ? transaction.date : new Date().toISOString().split('T')[0],
    entity: transaction ? transaction.entity : { id: '', name: '', type: 'vendor' as const },
    items: transaction ? [...transaction.items] : [],
    totalAmount: transaction ? transaction.totalAmount : 0,
    status: transaction ? transaction.status : 'pending',
    notes: transaction?.notes || ''
  });

  const [newItem, setNewItem] = useState<{
    productId: string;
    quantity: number;
    unit: string;
    rate: number;
  }>({
    productId: '',
    quantity: 1,
    unit: '',
    rate: 0
  });

  const [availableUnits, setAvailableUnits] = useState<{ name: string; factor: number }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter vendors from entities
  const vendors = mockEntities.filter(entity => entity.type === 'vendor');

  // Get selected product details
  useEffect(() => {
    if (newItem.productId) {
      const selectedProduct = mockInventoryItems.find(item => item.id === newItem.productId);
      if (selectedProduct) {
        // Set available units based on selected product
        const units = [
          { name: selectedProduct.baseUnit, factor: 1 },
          ...selectedProduct.multiUnits
        ];
        setAvailableUnits(units);
        
        // Set default unit to base unit
        setNewItem(prev => ({
          ...prev,
          unit: selectedProduct.baseUnit,
          rate: selectedProduct.currentRate
        }));
      }
    }
  }, [newItem.productId]);

  // Calculate rate when unit changes
  useEffect(() => {
    if (newItem.productId && newItem.unit) {
      const selectedProduct = mockInventoryItems.find(item => item.id === newItem.productId);
      if (selectedProduct) {
        const selectedUnit = availableUnits.find(unit => unit.name === newItem.unit);
        if (selectedUnit) {
          // Rate for the selected unit = base rate * conversion factor
          const baseRate = selectedProduct.currentRate;
          const unitRate = baseRate * selectedUnit.factor;
          setNewItem(prev => ({
            ...prev,
            rate: unitRate
          }));
        }
      }
    }
  }, [newItem.unit, availableUnits]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEntityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const entityId = e.target.value;
    const selectedEntity = vendors.find(vendor => vendor.id === entityId);
    if (selectedEntity) {
      setFormData({
        ...formData,
        entity: selectedEntity
      });
    }
  };

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewItem({
      ...newItem,
      [name]: name === 'quantity' || name === 'rate' ? parseFloat(value) : value
    });
  };

  const handleAddItem = () => {
    const itemErrors: Record<string, string> = {};
    
    if (!newItem.productId) itemErrors.productId = 'Please select a product';
    if (!newItem.quantity || newItem.quantity <= 0) itemErrors.quantity = 'Quantity must be greater than 0';
    if (!newItem.unit) itemErrors.unit = 'Please select a unit';
    if (!newItem.rate || newItem.rate <= 0) itemErrors.rate = 'Rate must be greater than 0';

    if (Object.keys(itemErrors).length > 0) {
      setErrors(itemErrors);
      return;
    }

    // Clear errors
    setErrors({});

    const selectedProduct = mockInventoryItems.find(item => item.id === newItem.productId);
    const selectedUnit = availableUnits.find(unit => unit.name === newItem.unit);

    if (selectedProduct && selectedUnit) {
      const unitConversionFactor = selectedUnit.factor;
      const baseQuantity = newItem.quantity * unitConversionFactor;
      const amount = newItem.quantity * newItem.rate;

      const newTransactionItem: TransactionItem = {
        id: `PITEM-${Math.floor(10000 + Math.random() * 90000)}`,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: newItem.quantity,
        unit: newItem.unit,
        rate: newItem.rate,
        amount,
        unitConversionFactor,
        baseQuantity
      };

      const updatedItems = [...formData.items, newTransactionItem];
      const totalAmount = updatedItems.reduce((sum, item) => sum + item.amount, 0);

      setFormData({
        ...formData,
        items: updatedItems,
        totalAmount
      });

      // Reset new item form
      setNewItem({
        productId: '',
        quantity: 1,
        unit: '',
        rate: 0
      });
      setAvailableUnits([]);
    }
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    
    const totalAmount = updatedItems.reduce((sum, item) => sum + item.amount, 0);
    
    setFormData({
      ...formData,
      items: updatedItems,
      totalAmount
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formErrors: Record<string, string> = {};
    
    if (!formData.entity.id) formErrors.entity = 'Please select a vendor';
    if (formData.items.length === 0) formErrors.items = 'Please add at least one item';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    onSave({
      ...formData,
      type: 'purchase',
      status: 'completed'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? 'Edit Purchase' : 'New Purchase'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase ID
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
                Purchase Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Vendor <span className="text-red-500">*</span>
              </label>
              <select
                name="entity"
                value={formData.entity.id}
                onChange={handleEntityChange}
                required
                className={`w-full px-3 py-2 border ${errors.entity ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
              >
                <option value="">Select Vendor</option>
                {vendors.map(vendor => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
              {errors.entity && (
                <p className="mt-1 text-sm text-red-500">{errors.entity}</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Items</h3>
            
            {formData.items.length > 0 && (
              <div className="mb-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rate
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {item.productName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {item.unit}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {item.rate.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {item.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
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

            {errors.items && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-500 text-sm flex items-center">
                <AlertTriangle size={16} className="mr-2" />
                {errors.items}
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Add Item</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Product
                  </label>
                  <select
                    name="productId"
                    value={newItem.productId}
                    onChange={handleNewItemChange}
                    className={`w-full px-3 py-2 border ${errors.productId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  >
                    <option value="">Select Product</option>
                    {mockInventoryItems.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.baseUnit})
                      </option>
                    ))}
                  </select>
                  {errors.productId && (
                    <p className="mt-1 text-xs text-red-500">{errors.productId}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={newItem.quantity || ''}
                    onChange={handleNewItemChange}
                    min="0.01"
                    step="0.01"
                    className={`w-full px-3 py-2 border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-xs text-red-500">{errors.quantity}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={newItem.unit}
                    onChange={handleNewItemChange}
                    disabled={!newItem.productId}
                    className={`w-full px-3 py-2 border ${errors.unit ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  >
                    <option value="">Select Unit</option>
                    {availableUnits.map(unit => (
                      <option key={unit.name} value={unit.name}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                  {errors.unit && (
                    <p className="mt-1 text-xs text-red-500">{errors.unit}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Rate
                  </label>
                  <input
                    type="number"
                    name="rate"
                    value={newItem.rate || ''}
                    onChange={handleNewItemChange}
                    min="0.01"
                    step="0.01"
                    className={`w-full px-3 py-2 border ${errors.rate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                  />
                  {errors.rate && (
                    <p className="mt-1 text-xs text-red-500">{errors.rate}</p>
                  )}
                </div>
                <div className="md:col-span-5 flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center gap-2"
                  >
                    <Plus size={18} />
                    <span>Add Item</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={2}
                  placeholder="Add any additional notes..."
                />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">Total Amount</p>
                <p className="text-xl font-semibold">{formData.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              {isEditing ? 'Update Purchase' : 'Save Purchase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseForm;