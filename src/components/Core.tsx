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
  Users,
  ShoppingCart
} from 'lucide-react';

// Define entity types
type EntityType = 'vendor' | 'customer';

// Define entity interface
interface Entity {
  id: string;
  name: string;
  type: EntityType;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  openingBalance: number;
  currentBalance: number;
  asOfDate: string;
}

// Mock data for entities
const mockEntities: Entity[] = [
  {
    id: 'VEN-10001',
    name: 'Vendor ABC',
    type: 'vendor',
    contactPerson: 'John Smith',
    email: 'john@vendorabc.com',
    phone: '(555) 123-4567',
    address: '123 Vendor St, Supplier City, SC 12345',
    openingBalance: 0,
    currentBalance: 1490.00,
    asOfDate: '2025-01-01'
  },
  {
    id: 'VEN-10002',
    name: 'Vendor DEF',
    type: 'vendor',
    contactPerson: 'Jane Doe',
    email: 'jane@vendordef.com',
    phone: '(555) 234-5678',
    address: '456 Supply Ave, Vendor Town, VT 23456',
    openingBalance: 1000.00,
    currentBalance: 4000.00,
    asOfDate: '2025-01-01'
  },
  {
    id: 'VEN-10003',
    name: 'Vendor GHI',
    type: 'vendor',
    contactPerson: 'Robert Jones',
    email: 'robert@vendorghi.com',
    phone: '(555) 345-6789',
    address: '789 Material Rd, Provider City, PC 34567',
    openingBalance: 2500.00,
    currentBalance: 2500.00,
    asOfDate: '2025-01-01'
  },
  {
    id: 'CUS-10001',
    name: 'Customer XYZ',
    type: 'customer',
    contactPerson: 'Alice Johnson',
    email: 'alice@customerxyz.com',
    phone: '(555) 456-7890',
    address: '101 Client Blvd, Buyer City, BC 45678',
    openingBalance: 0,
    currentBalance: 3000.00,
    asOfDate: '2025-01-01'
  },
  {
    id: 'CUS-10002',
    name: 'Customer UVW',
    type: 'customer',
    contactPerson: 'Bob Williams',
    email: 'bob@customeruvw.com',
    phone: '(555) 567-8901',
    address: '202 Consumer St, Client Town, CT 56789',
    openingBalance: 500.00,
    currentBalance: 2420.00,
    asOfDate: '2025-01-01'
  },
  {
    id: 'CUS-10003',
    name: 'Customer RST',
    type: 'customer',
    contactPerson: 'Carol Brown',
    email: 'carol@customerrst.com',
    phone: '(555) 678-9012',
    address: '303 Buyer Ave, Purchase City, PC 67890',
    openingBalance: 0,
    currentBalance: 0,
    asOfDate: '2025-01-01'
  }
];

const Core = () => {
  const [entities, setEntities] = useState<Entity[]>(mockEntities);
  const [activeTab, setActiveTab] = useState<EntityType>('vendor');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentEntity, setCurrentEntity] = useState<Entity | null>(null);

  // Filter entities based on active tab and search term
  const filteredEntities = entities.filter(entity => {
    return entity.type === activeTab && 
           (entity.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            entity.id.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleAddEntity = (newEntity: Entity) => {
    setEntities([...entities, newEntity]);
    setShowAddModal(false);
  };

  const handleEditEntity = (entity: Entity) => {
    setCurrentEntity(entity);
    setShowAddModal(true);
  };

  const handleViewEntity = (entity: Entity) => {
    setCurrentEntity(entity);
    setShowViewModal(true);
  };

  const handleDeleteEntity = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entity?')) {
      setEntities(entities.filter(entity => entity.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'vendor' 
              ? 'text-primary-600 border-b-2 border-primary-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('vendor')}
        >
          <span className="flex items-center gap-2">
            <ShoppingCart size={18} />
            Vendors
          </span>
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'customer' 
              ? 'text-primary-600 border-b-2 border-primary-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('customer')}
        >
          <span className="flex items-center gap-2">
            <Users size={18} />
            Customers
          </span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder={`Search ${activeTab === 'vendor' ? 'vendors' : 'customers'}...`}
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
              setCurrentEntity(null);
              setShowAddModal(true);
            }}
          >
            <Plus size={18} />
            <span>Add New {activeTab === 'vendor' ? 'Vendor' : 'Customer'}</span>
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

      {/* Entities Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntities.map((entity) => (
                <tr key={entity.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {entity.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entity.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entity.contactPerson || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {entity.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${entity.currentBalance.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewEntity(entity)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleEditEntity(entity)}
                        className="text-amber-600 hover:text-amber-900"
                        title="Edit entity"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteEntity(entity.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete entity"
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
        {filteredEntities.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No {activeTab === 'vendor' ? 'vendors' : 'customers'} found.
          </div>
        )}
      </div>

      {/* Add/Edit Entity Modal */}
      {showAddModal && (
        <EntityFormModal
          entity={currentEntity}
          type={activeTab}
          onSave={handleAddEntity}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* View Entity Modal */}
      {showViewModal && currentEntity && (
        <ViewEntityModal
          entity={currentEntity}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
};

interface EntityFormModalProps {
  entity: Entity | null;
  type: EntityType;
  onSave: (entity: Entity) => void;
  onClose: () => void;
}

const EntityFormModal: React.FC<EntityFormModalProps> = ({ entity, type, onSave, onClose }) => {
  const isEditing = !!entity;
  
  const [formData, setFormData] = useState({
    id: entity ? entity.id : `${type === 'vendor' ? 'VEN' : 'CUS'}-${Math.floor(10000 + Math.random() * 90000)}`,
    name: entity ? entity.name : '',
    type,
    contactPerson: entity?.contactPerson || '',
    email: entity?.email || '',
    phone: entity?.phone || '',
    address: entity?.address || '',
    openingBalance: entity?.openingBalance || 0,
    currentBalance: entity?.currentBalance || 0,
    asOfDate: entity?.asOfDate || new Date().toISOString().split('T')[0]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'openingBalance' || name === 'currentBalance' ? parseFloat(value) : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Name is required.');
      return;
    }
    
    // If it's a new entity, set current balance equal to opening balance
    const entityToSave = isEditing ? formData : {
      ...formData,
      currentBalance: formData.openingBalance
    };
    
    onSave(entityToSave as Entity);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? `Edit ${type === 'vendor' ? 'Vendor' : 'Customer'}` : `Add New ${type === 'vendor' ? 'Vendor' : 'Customer'}`}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID
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
                Name <span className="text-red-500">*</span>
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
                Contact Person
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opening Balance
              </label>
              <input
                type="number"
                name="openingBalance"
                value={formData.openingBalance}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isEditing} // Can't change opening balance when editing
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                As of Date
              </label>
              <input
                type="date"
                name="asOfDate"
                value={formData.asOfDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isEditing} // Can't change as of date when editing
              />
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

interface ViewEntityModalProps {
  entity: Entity;
  onClose: () => void;
}

const ViewEntityModal: React.FC<ViewEntityModalProps> = ({ entity, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {entity.type === 'vendor' ? 'Vendor' : 'Customer'} Details
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">ID</p>
              <p className="text-base">{entity.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-base">{entity.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Contact Person</p>
              <p className="text-base">{entity.contactPerson || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-base">{entity.email || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-base">{entity.phone || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Current Balance</p>
              <p className="text-base">${entity.currentBalance.toFixed(2)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="text-base">{entity.address || '-'}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Opening Balance</p>
                <p className="text-base">${entity.openingBalance.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">As of Date</p>
                <p className="text-base">{new Date(entity.asOfDate).toLocaleDateString()}</p>
              </div>
            </div>
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

export default Core;