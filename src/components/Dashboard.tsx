import React from 'react';
import { 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  Users, 
  AlertTriangle 
} from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Inventory Value" 
          value="$124,500.00" 
          change="+5.3%" 
          icon={<Package className="text-blue-500" />} 
          positive={true} 
        />
        <StatCard 
          title="Monthly Sales" 
          value="$38,200.00" 
          change="+12.5%" 
          icon={<ShoppingCart className="text-green-500" />} 
          positive={true} 
        />
        <StatCard 
          title="Production Cost" 
          value="$28,350.00" 
          change="-3.2%" 
          icon={<Factory className="text-purple-500" />} 
          positive={false} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Inventory Status</h3>
          <div className="space-y-4">
            <InventoryItem 
              name="Raw Material A" 
              quantity="1,250 KG" 
              status="normal" 
            />
            <InventoryItem 
              name="Raw Material B" 
              quantity="320 KG" 
              status="low" 
            />
            <InventoryItem 
              name="Finished Product X" 
              quantity="540 PCS" 
              status="normal" 
            />
            <InventoryItem 
              name="Finished Product Y" 
              quantity="85 PCS" 
              status="critical" 
            />
          </div>
          <button className="mt-4 text-sm text-primary-600 hover:text-primary-700">
            View all inventory →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            <Transaction 
              type="purchase" 
              code="PUR-10042" 
              entity="Vendor ABC" 
              amount="$5,280.00" 
              date="Today" 
            />
            <Transaction 
              type="sale" 
              code="SALE-10128" 
              entity="Customer XYZ" 
              amount="$3,450.00" 
              date="Yesterday" 
            />
            <Transaction 
              type="production" 
              code="PROD-10035" 
              entity="Product X" 
              amount="250 PCS" 
              date="2 days ago" 
            />
            <Transaction 
              type="purchase" 
              code="PUR-10041" 
              entity="Vendor DEF" 
              amount="$1,820.00" 
              date="3 days ago" 
            />
          </div>
          <button className="mt-4 text-sm text-primary-600 hover:text-primary-700">
            View all transactions →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Production Schedule</h3>
          <div className="space-y-4">
            <ProductionItem 
              product="Product X" 
              quantity="500 PCS" 
              status="in-progress" 
              completion="65%" 
              date="Due in 2 days" 
            />
            <ProductionItem 
              product="Product Y" 
              quantity="200 PCS" 
              status="scheduled" 
              completion="0%" 
              date="Starts tomorrow" 
            />
            <ProductionItem 
              product="Product Z" 
              quantity="350 PCS" 
              status="completed" 
              completion="100%" 
              date="Completed yesterday" 
            />
          </div>
          <button className="mt-4 text-sm text-primary-600 hover:text-primary-700">
            View production calendar →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Alerts</h3>
          <div className="space-y-4">
            <Alert 
              message="Low stock for Raw Material B" 
              type="warning" 
            />
            <Alert 
              message="Critical stock for Product Y" 
              type="critical" 
            />
            <Alert 
              message="Production deadline approaching" 
              type="warning" 
            />
          </div>
          <button className="mt-4 text-sm text-primary-600 hover:text-primary-700">
            View all alerts →
          </button>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  positive: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, positive }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-gray-50">{icon}</div>
      </div>
      <div className={`flex items-center mt-4 text-sm ${positive ? 'text-green-600' : 'text-red-600'}`}>
        {positive ? <TrendingUp size={16} /> : <TrendingUp size={16} className="transform rotate-180" />}
        <span className="ml-1">{change} from last month</span>
      </div>
    </div>
  );
};

interface InventoryItemProps {
  name: string;
  quantity: string;
  status: 'normal' | 'low' | 'critical';
}

const InventoryItem: React.FC<InventoryItemProps> = ({ name, quantity, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-500">{quantity}</p>
      </div>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
};

interface TransactionProps {
  type: 'purchase' | 'sale' | 'production';
  code: string;
  entity: string;
  amount: string;
  date: string;
}

const Transaction: React.FC<TransactionProps> = ({ type, code, entity, amount, date }) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'purchase':
        return <ShoppingCart size={16} className="text-blue-500" />;
      case 'sale':
        return <DollarSign size={16} className="text-green-500" />;
      case 'production':
        return <Factory size={16} className="text-purple-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <div className="p-2 rounded-full bg-gray-50 mr-3">
          {getTypeIcon()}
        </div>
        <div>
          <p className="font-medium">{code}</p>
          <p className="text-sm text-gray-500">{entity}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-medium">{amount}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
    </div>
  );
};

interface ProductionItemProps {
  product: string;
  quantity: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  completion: string;
  date: string;
}

const ProductionItem: React.FC<ProductionItemProps> = ({ product, quantity, status, completion, date }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{product}</p>
          <p className="text-sm text-gray-500">{quantity}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-primary-600 h-2.5 rounded-full" 
          style={{ width: completion }}
        ></div>
      </div>
      <p className="text-xs text-gray-500">{date}</p>
    </div>
  );
};

interface AlertProps {
  message: string;
  type: 'warning' | 'critical' | 'info';
}

const Alert: React.FC<AlertProps> = ({ message, type }) => {
  const getAlertColor = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'critical':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'info':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`flex items-center p-3 rounded-md border ${getAlertColor()}`}>
      <AlertTriangle size={16} className="mr-2" />
      <p className="text-sm">{message}</p>
    </div>
  );
};

const Factory = ({ className }: { className?: string }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
      <path d="M17 18h1"></path>
      <path d="M12 18h1"></path>
      <path d="M7 18h1"></path>
    </svg>
  );
};

export default Dashboard;