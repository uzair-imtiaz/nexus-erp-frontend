import React, { useState } from 'react';
import { 
  Plus, 
  Download, 
  Upload, 
  Search, 
  Eye, 
  AlertTriangle, 
  X, 
  Check 
} from 'lucide-react';

// Mock data for production history
const mockProductionHistory = [
  {
    id: 'PROD-10001',
    date: '2025-05-15',
    formulation: {
      id: 'FOR-10001',
      name: 'Basic Formulation X'
    },
    finalProduct: {
      id: 'ITEM-10004',
      name: 'Finished Product X',
      baseUnit: 'PCS'
    },
    quantityProduced: 200,
    totalCost: 1220.00,
    status: 'completed'
  },
  {
    id: 'PROD-10002',
    date: '2025-05-14',
    formulation: {
      id: 'FOR-10002',
      name: 'Premium Formulation Y'
    },
    finalProduct: {
      id: 'ITEM-10005',
      name: 'Finished Product Y',
      baseUnit: 'PCS'
    },
    quantityProduced: 100,
    totalCost: 1450.00,
    status: 'completed'
  }
];

// Mock data for formulations
const mockFormulations = [
  {
    id: 'FOR-10001',
    name: 'Basic Formulation X',
    finalProduct: {
      id: 'ITEM-10004',
      name: 'Finished Product X',
      baseUnit: 'PCS'
    },
    quantity: 100,
    ingredients: [
      {
        id: 'ITEM-10001',
        name: 'Raw Material A',
        quantity: 50,
        baseUnit: 'KG',
        costPerUnit: 5.00,
        totalCost: 250.00,
        available: 1250
      },
      {
        id: 'ITEM-10002',
        name: 'Raw Material B',
        quantity: 30,
        baseUnit: 'KG',
        costPerUnit: 12.00,
        totalCost: 360.00,
        available: 320
      }
    ],
    totalCost: 610.00,
    costPerUnit: 6.10
  },
  {
    id: 'FOR-10002',
    name: 'Premium Formulation Y',
    finalProduct: {
      id: 'ITEM-10005',
      name: 'Finished Product Y',
      baseUnit: 'PCS'
    },
    quantity: 50,
    ingredients: [
      {
        id: 'ITEM-10001',
        name: 'Raw Material A',
        quantity: 25,
        baseUnit: 'KG',
        costPerUnit: 5.00,
        totalCost: 125.00,
        available: 1250
      },
      {
        id: 'ITEM-10003',
        name: 'Raw Material C',
        quantity: 40,
        baseUnit: 'L',
        costPerUnit: 15.00,
        totalCost: 600.00,
        available: 500
      }
    ],
    totalCost: 725.00,
    costPerUnit: 14.50
  }
];

const Production = () => {
  const [productionHistory, setProductionHistory] = useState(mockProductionHistory);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentProduction, setCurrentProduction] = useState<any>(null);

  // Filter production history based on search term
  const filteredHistory = productionHistory.filter(production => {
    return production.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
           production.formulation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           production.finalProduct.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAddProduction = (newProduction: any) => {
    setProductionHistory([newProduction, ...productionHistory]);
    setShowAddModal(false);
  };

  const handleViewProduction = (production: any) => {
    setCurrentProduction(production);
    setShowViewModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search production history..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <div className="flex gap-2">
          <button
            className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} />
            <span>Add New Production</span>
          </button>
          <button
            className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Download size={18} />
            <span>Download Sample</span>
          </button>
          <button
            className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <Upload size={18} />
            <span>Import</span>
          </button>
        </div>
      </div>

      {/* Production History Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Production Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Production Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Formulation Used
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Final Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity Produced
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Production Cost
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
              {filteredHistory.map((production) => (
                <tr key={production.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {production.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(production.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {production.formulation.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {production.finalProduct.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {production.quantityProduced} {production.finalProduct.baseUnit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${production.totalCost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      production.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {production.status.charAt(0).toUpperCase() + production.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleViewProduction(production)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredHistory.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No production records found.
          </div>
        )}
      </div>

      {/* Add Production Modal */}
      {showAddModal && (
        <AddProductionModal 
          formulations={mockFormulations}
          onSave={handleAddProduction} 
          onClose={() => setShowAddModal(false)} 
        />
      )}

      {/* View Production Modal */}
      {showViewModal && currentProduction && (
        <ViewProductionModal 
          production={currentProduction} 
          onClose={() => setShowViewModal(false)} 
        />
      )}
    </div>
  );
};

interface AddProductionModalProps {
  formulations: any[];
  onSave: (production: any) => void;
  onClose: () => void;
}

const AddProductionModal: React.FC<AddProductionModalProps> = ({ 
  formulations, 
  onSave, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    id: `PROD-${Math.floor(10000 + Math.random() * 90000)}`,
    date: new Date().toISOString().split('T')[0],
    formulation: null as any,
    finalProduct: null as any,
    quantityToProduce: 1,
    quantityProduced: 0,
    totalCost: 0,
    status: 'pending',
    ingredients: [] as any[]
  });

  const [hasShortage, setHasShortage] = useState(false);

  const handleFormulationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const formulationId = e.target.value;
    const selectedFormulation = formulations.find(f => f.id === formulationId);
    
    if (selectedFormulation) {
      const ingredients = selectedFormulation.ingredients.map((ingredient: any) => {
        const requiredQty = ingredient.quantity * formData.quantityToProduce;
        const hasShortage = requiredQty > ingredient.available;
        
        return {
          ...ingredient,
          requiredQty,
          hasShortage
        };
      });
      
      const totalCost = selectedFormulation.totalCost * formData.quantityToProduce;
      const quantityProduced = selectedFormulation.quantity * formData.quantityToProduce;
      
      setFormData({
        ...formData,
        formulation: {
          id: selectedFormulation.id,
          name: selectedFormulation.name
        },
        finalProduct: selectedFormulation.finalProduct,
        ingredients,
        totalCost,
        quantityProduced
      });
      
      setHasShortage(ingredients.some(i => i.hasShortage));
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantityToProduce = parseInt(e.target.value);
    
    if (formData.formulation) {
      const selectedFormulation = formulations.find(f => f.id === formData.formulation.id);
      
      if (selectedFormulation) {
        const ingredients = selectedFormulation.ingredients.map((ingredient: any) => {
          const requiredQty = ingredient.quantity * quantityToProduce;
          const hasShortage = requiredQty > ingredient.available;
          
          return {
            ...ingredient,
            requiredQty,
            hasShortage
          };
        });
        
        const totalCost = selectedFormulation.totalCost * quantityToProduce;
        const quantityProduced = selectedFormulation.quantity * quantityToProduce;
        
        setFormData({
          ...formData,
          quantityToProduce,
          ingredients,
          totalCost,
          quantityProduced
        });
        
        setHasShortage(ingredients.some(i => i.hasShortage));
      }
    } else {
      setFormData({
        ...formData,
        quantityToProduce
      });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      date: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.formulation || formData.quantityToProduce <= 0) {
      alert('Please select a formulation and enter a valid quantity.');
      return;
    }
    
    if (hasShortage) {
      if (!window.confirm('There are ingredient shortages. Do you still want to proceed?')) {
        return;
      }
    }
    
    onSave({
      ...formData,
      status: 'completed'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Add New Production
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Production Code
              </label>
              <input
                type="text"
                value={formData.id}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Production Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={handleDateChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Formulation <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.formulation?.id || ''}
                onChange={handleFormulationChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Formulation</option>
                {formulations.map(formulation => (
                  <option key={formulation.id} value={formulation.id}>
                    {formulation.name} - {formulation.finalProduct.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.formulation && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity to Produce (Batches) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.quantityToProduce}
                  onChange={handleQuantityChange}
                  min="1"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Final Product Yield
                </label>
                <input
                  type="text"
                  value={`${formData.quantityProduced} ${formData.finalProduct?.baseUnit || ''}`}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
              </div>
            </div>
          )}

          {formData.ingredients.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">Ingredients Summary</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ingredient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Required Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Available Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost per Unit
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.ingredients.map((ingredient, index) => (
                      <tr key={index} className={ingredient.hasShortage ? 'bg-red-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ingredient.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ingredient.requiredQty.toFixed(2)} {ingredient.baseUnit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ingredient.available.toFixed(2)} {ingredient.baseUnit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${ingredient.costPerUnit.toFixed(2)} per {ingredient.baseUnit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${(ingredient.requiredQty * ingredient.costPerUnit).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {ingredient.hasShortage ? (
                            <span className="flex items-center text-red-600">
                              <AlertTriangle size={16} className="mr-1" />
                              Shortage
                            </span>
                          ) : (
                            <span className="flex items-center text-green-600">
                              <Check size={16} className="mr-1" />
                              Available
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {hasShortage && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-start">
                <AlertTriangle className="text-red-600 mr-3 mt-0.5" size={20} />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Ingredient Shortage Warning</h3>
                  <p className="text-sm text-red-700 mt-1">
                    There are insufficient quantities of some ingredients. Please adjust the quantity to produce or update your inventory.
                  </p>
                </div>
              </div>
            </div>
          )}

          {formData.formulation && (
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Total Estimated Production Cost</p>
                  <p className="text-xl font-semibold">${formData.totalCost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Cost Per Unit of Final Product</p>
                  <p className="text-xl font-semibold">
                    ${(formData.totalCost / formData.quantityProduced).toFixed(2)} per {formData.finalProduct?.baseUnit || 'Unit'}
                  </p>
                </div>
              </div>
            </div>
          )}

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
              disabled={!formData.formulation || formData.quantityToProduce <= 0}
              className={`px-4 py-2 rounded-md ${
                !formData.formulation || formData.quantityToProduce <= 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              Finalize Production
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ViewProductionModalProps {
  production: any;
  onClose: () => void;
}

const ViewProductionModal: React.FC<ViewProductionModalProps> = ({ production, onClose }) => {
  // For a real implementation, we would fetch the detailed production record
  // including consumed ingredients from the backend
  const mockConsumedIngredients = [
    {
      id: 'ITEM-10001',
      name: 'Raw Material A',
      quantity: production.id === 'PROD-10001' ? 100 : 50,
      baseUnit: 'KG',
      costPerUnit: 5.00,
      totalCost: production.id === 'PROD-10001' ? 500.00 : 250.00
    },
    {
      id: production.id === 'PROD-10001' ? 'ITEM-10002' : 'ITEM-10003',
      name: production.id === 'PROD-10001' ? 'Raw Material B' : 'Raw Material C',
      quantity: production.id === 'PROD-10001' ? 60 : 80,
      baseUnit: production.id === 'PROD-10001' ? 'KG' : 'L',
      costPerUnit: production.id === 'PROD-10001' ? 12.00 : 15.00,
      totalCost: production.id === 'PROD-10001' ? 720.00 : 1200.00
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Production Details
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Production Code</p>
              <p className="text-base">{production.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Production Date</p>
              <p className="text-base">{new Date(production.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Formulation Used</p>
              <p className="text-base">{production.formulation.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Final Product</p>
              <p className="text-base">{production.finalProduct.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Quantity Produced</p>
              <p className="text-base">{production.quantityProduced} {production.finalProduct.baseUnit}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Production Cost</p>
              <p className="text-base">${production.totalCost.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Cost Per Unit</p>
              <p className="text-base">${(production.totalCost / production.quantityProduced).toFixed(2)} per {production.finalProduct.baseUnit}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="text-base">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  production.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {production.status.charAt(0).toUpperCase() + production.status.slice(1)}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Consumed Ingredients</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingredient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity Consumed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost per Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Cost
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockConsumedIngredients.map((ingredient, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ingredient.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ingredient.quantity} {ingredient.baseUnit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${ingredient.costPerUnit.toFixed(2)} per {ingredient.baseUnit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${ingredient.totalCost.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

export default Production;