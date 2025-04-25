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
  Check 
} from 'lucide-react';

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
        totalCost: 250.00
      },
      {
        id: 'ITEM-10002',
        name: 'Raw Material B',
        quantity: 30,
        baseUnit: 'KG',
        costPerUnit: 12.00,
        totalCost: 360.00
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
        totalCost: 125.00
      },
      {
        id: 'ITEM-10003',
        name: 'Raw Material C',
        quantity: 40,
        baseUnit: 'L',
        costPerUnit: 15.00,
        totalCost: 600.00
      }
    ],
    totalCost: 725.00,
    costPerUnit: 14.50
  }
];

// Mock data for inventory items (for dropdown selection)
const mockInventoryItems = [
  {
    id: 'ITEM-10001',
    name: 'Raw Material A',
    category: 'Raw Material',
    baseUnit: 'KG',
    quantityAvailable: 1250,
    costPerUnit: 5.00
  },
  {
    id: 'ITEM-10002',
    name: 'Raw Material B',
    category: 'Raw Material',
    baseUnit: 'KG',
    quantityAvailable: 320,
    costPerUnit: 12.00
  },
  {
    id: 'ITEM-10003',
    name: 'Raw Material C',
    category: 'Raw Material',
    baseUnit: 'L',
    quantityAvailable: 500,
    costPerUnit: 15.00
  },
  {
    id: 'ITEM-10004',
    name: 'Finished Product X',
    category: 'Finished Goods',
    baseUnit: 'PCS',
    quantityAvailable: 540,
    costPerUnit: 50.00
  },
  {
    id: 'ITEM-10005',
    name: 'Finished Product Y',
    category: 'Finished Goods',
    baseUnit: 'PCS',
    quantityAvailable: 85,
    costPerUnit: 60.00
  }
];

const Formulation = () => {
  const [formulations, setFormulations] = useState(mockFormulations);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentFormulation, setCurrentFormulation] = useState<any>(null);

  // Filter formulations based on search term
  const filteredFormulations = formulations.filter(formulation => {
    return formulation.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           formulation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
           formulation.finalProduct.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAddFormulation = (newFormulation: any) => {
    setFormulations([...formulations, newFormulation]);
    setShowAddModal(false);
  };

  const handleViewFormulation = (formulation: any) => {
    setCurrentFormulation(formulation);
    setShowViewModal(true);
  };

  const handleEditFormulation = (formulation: any) => {
    setCurrentFormulation(formulation);
    setShowAddModal(true);
  };

  const handleDeleteFormulation = (id: string) => {
    if (window.confirm('Are you sure you want to delete this formulation?')) {
      setFormulations(formulations.filter(formulation => formulation.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search formulations..."
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
              setCurrentFormulation(null);
              setShowAddModal(true);
            }}
          >
            <Plus size={18} />
            <span>Add New Formulation</span>
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

      {/* Formulations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Formulation Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Formulation Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Final Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost Per Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFormulations.map((formulation) => (
                <tr key={formulation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formulation.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formulation.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formulation.finalProduct.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formulation.quantity} {formulation.finalProduct.baseUnit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${formulation.totalCost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${formulation.costPerUnit.toFixed(2)} per {formulation.finalProduct.baseUnit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewFormulation(formulation)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleEditFormulation(formulation)}
                        className="text-amber-600 hover:text-amber-900"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteFormulation(formulation.id)}
                        className="text-red-600 hover:text-red-900"
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
        {filteredFormulations.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No formulations found.
          </div>
        )}
      </div>

      {/* Add/Edit Formulation Modal */}
      {showAddModal && (
        <AddEditFormulationModal 
          formulation={currentFormulation} 
          inventoryItems={mockInventoryItems}
          onSave={handleAddFormulation} 
          onClose={() => setShowAddModal(false)} 
        />
      )}

      {/* View Formulation Modal */}
      {showViewModal && currentFormulation && (
        <ViewFormulationModal 
          formulation={currentFormulation} 
          onClose={() => setShowViewModal(false)} 
        />
      )}
    </div>
  );
};

interface AddEditFormulationModalProps {
  formulation: any;
  inventoryItems: any[];
  onSave: (formulation: any) => void;
  onClose: () => void;
}

const AddEditFormulationModal: React.FC<AddEditFormulationModalProps> = ({ 
  formulation, 
  inventoryItems, 
  onSave, 
  onClose 
}) => {
  const isEditing = !!formulation;
  const finishedGoodsItems = inventoryItems.filter(item => item.category === 'Finished Goods');
  const rawMaterialItems = inventoryItems.filter(item => item.category === 'Raw Material');

  const [formData, setFormData] = useState({
    id: formulation ? formulation.id : `FOR-${Math.floor(10000 + Math.random() * 90000)}`,
    name: formulation ? formulation.name : '',
    finalProduct: formulation ? formulation.finalProduct : null,
    quantity: formulation ? formulation.quantity : 0,
    ingredients: formulation ? [...formulation.ingredients] : [],
    totalCost: formulation ? formulation.totalCost : 0,
    costPerUnit: formulation ? formulation.costPerUnit : 0
  });

  const [newIngredient, setNewIngredient] = useState({
    id: '',
    name: '',
    quantity: 0,
    baseUnit: '',
    costPerUnit: 0,
    totalCost: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseFloat(value) : value
    });
  };

  const handleFinalProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    const selectedProduct = inventoryItems.find(item => item.id === productId);
    
    if (selectedProduct) {
      setFormData({
        ...formData,
        finalProduct: {
          id: selectedProduct.id,
          name: selectedProduct.name,
          baseUnit: selectedProduct.baseUnit
        }
      });
    }
  };

  const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    const updatedIngredients = [...formData.ingredients];
    
    if (name === 'quantity') {
      const quantity = parseFloat(value);
      const costPerUnit = updatedIngredients[index].costPerUnit;
      updatedIngredients[index] = {
        ...updatedIngredients[index],
        quantity,
        totalCost: quantity * costPerUnit
      };
    } else {
      updatedIngredients[index] = {
        ...updatedIngredients[index],
        [name]: value
      };
    }
    
    // Recalculate total cost and cost per unit
    const totalCost = updatedIngredients.reduce((sum, ingredient) => sum + ingredient.totalCost, 0);
    const costPerUnit = formData.quantity > 0 ? totalCost / formData.quantity : 0;
    
    setFormData({
      ...formData,
      ingredients: updatedIngredients,
      totalCost,
      costPerUnit
    });
  };

  const handleNewIngredientChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'id') {
      const selectedIngredient = rawMaterialItems.find(item => item.id === value);
      if (selectedIngredient) {
        setNewIngredient({
          id: selectedIngredient.id,
          name: selectedIngredient.name,
          quantity: newIngredient.quantity,
          baseUnit: selectedIngredient.baseUnit,
          costPerUnit: selectedIngredient.costPerUnit,
          totalCost: selectedIngredient.costPerUnit * newIngredient.quantity
        });
      }
    } else if (name === 'quantity') {
      const quantity = parseFloat(value);
      setNewIngredient({
        ...newIngredient,
        quantity,
        totalCost: quantity * newIngredient.costPerUnit
      });
    }
  };

  const handleAddIngredient = () => {
    if (newIngredient.id && newIngredient.quantity > 0) {
      const updatedIngredients = [...formData.ingredients, { ...newIngredient }];
      
      // Recalculate total cost and cost per unit
      const totalCost = updatedIngredients.reduce((sum, ingredient) => sum + ingredient.totalCost, 0);
      const costPerUnit = formData.quantity > 0 ? totalCost / formData.quantity : 0;
      
      setFormData({
        ...formData,
        ingredients: updatedIngredients,
        totalCost,
        costPerUnit
      });
      
      // Reset new ingredient form
      setNewIngredient({
        id: '',
        name: '',
        quantity: 0,
        baseUnit: '',
        costPerUnit: 0,
        totalCost: 0
      });
    }
  };

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients.splice(index, 1);
    
    // Recalculate total cost and cost per unit
    const totalCost = updatedIngredients.reduce((sum, ingredient) => sum + ingredient.totalCost, 0);
    const costPerUnit = formData.quantity > 0 ? totalCost / formData.quantity : 0;
    
    setFormData({
      ...formData,
      ingredients: updatedIngredients,
      totalCost,
      costPerUnit
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseFloat(e.target.value);
    const totalCost = formData.ingredients.reduce((sum, ingredient) => sum + ingredient.totalCost, 0);
    const costPerUnit = quantity > 0 ? totalCost / quantity : 0;
    
    setFormData({
      ...formData,
      quantity,
      totalCost,
      costPerUnit
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.finalProduct || formData.quantity <= 0 || formData.ingredients.length === 0) {
      alert('Please fill in all required fields and add at least one ingredient.');
      return;
    }
    
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? 'Edit Formulation' : 'Add New Formulation'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Formulation Code
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
                Formulation Name <span className="text-red-500">*</span>
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
                Final Product <span className="text-red-500">*</span>
              </label>
              <select
                name="finalProduct"
                value={formData.finalProduct?.id || ''}
                onChange={handleFinalProductChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select Final Product</option>
                {finishedGoodsItems.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.baseUnit})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity of Final Product <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity || ''}
                  onChange={handleQuantityChange}
                  min="0.01"
                  step="0.01"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-500">
                  {formData.finalProduct?.baseUnit || 'Unit'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Ingredients</h3>
            
            {formData.ingredients.length > 0 && (
              <div className="mb-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ingredient
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cost per Unit
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Cost
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formData.ingredients.map((ingredient, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {ingredient.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="flex items-center">
                            <input
                              type="number"
                              name="quantity"
                              value={ingredient.quantity || ''}
                              onChange={(e) => handleIngredientChange(e, index)}
                              min="0.01"
                              step="0.01"
                              className="w-24 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <span className="ml-2 text-gray-500">{ingredient.baseUnit}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          ${ingredient.costPerUnit.toFixed(2)} per {ingredient.baseUnit}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          ${ingredient.totalCost.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <button
                            type="button"
                            onClick={() => handleRemoveIngredient(index)}
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
              <h4 className="text-sm font-medium text-gray-700 mb-3">Add Ingredient</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Raw Material
                  </label>
                  <select
                    name="id"
                    value={newIngredient.id}
                    onChange={handleNewIngredientChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select Raw Material</option>
                    {rawMaterialItems.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.baseUnit})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Quantity
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      name="quantity"
                      value={newIngredient.quantity || ''}
                      onChange={handleNewIngredientChange}
                      min="0.01"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      disabled={!newIngredient.id}
                    />
                    <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-500">
                      {newIngredient.baseUnit || 'Unit'}
                    </span>
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    disabled={!newIngredient.id || newIngredient.quantity <= 0}
                    className={`w-full px-4 py-2 rounded-md flex items-center justify-center gap-2 ${
                      !newIngredient.id || newIngredient.quantity <= 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    <Plus size={18} />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Total Formulation Cost</p>
                <p className="text-xl font-semibold">${formData.totalCost.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Cost Per Unit of Final Product</p>
                <p className="text-xl font-semibold">
                  ${formData.costPerUnit.toFixed(2)} per {formData.finalProduct?.baseUnit || 'Unit'}
                </p>
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
              {isEditing ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface ViewFormulationModalProps {
  formulation: any;
  onClose: () => void;
}

const ViewFormulationModal: React.FC<ViewFormulationModalProps> = ({ formulation, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Formulation Details
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Formulation Code</p>
              <p className="text-base">{formulation.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Formulation Name</p>
              <p className="text-base">{formulation.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Final Product</p>
              <p className="text-base">{formulation.finalProduct.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Quantity of Final Product</p>
              <p className="text-base">{formulation.quantity} {formulation.finalProduct.baseUnit}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Formulation Cost</p>
              <p className="text-base">${formulation.totalCost.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Cost Per Unit of Final Product</p>
              <p className="text-base">${formulation.costPerUnit.toFixed(2)} per {formulation.finalProduct.baseUnit}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-3">Ingredients</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ingredient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
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
                {formulation.ingredients.map((ingredient: any, index: number) => (
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

export default Formulation;