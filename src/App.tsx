import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Factory, 
  Clipboard, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Production from './components/Production';
import Formulation from './components/Formulation';
import PurchaseSale from './components/PurchaseSale';
import Core from './components/Core';
import Reports from './components/Reports';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'production':
        return <Production />;
      case 'formulation':
        return <Formulation />;
      case 'purchaseSale':
        return <PurchaseSale />;
      case 'core':
        return <Core />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-primary-600 text-white"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-30 w-64 transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:h-screen bg-white border-r border-gray-200 shadow-sm`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b border-gray-200 bg-[#1B4D3E] p-2">
            <img 
              src="https://raw.githubusercontent.com/yourusername/yourrepo/main/logo.png" 
              alt="ALGO Bricks" 
              className="h-12"
            />
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              <SidebarItem 
                icon={<LayoutDashboard size={20} />} 
                title="Dashboard" 
                active={activeModule === 'dashboard'} 
                onClick={() => setActiveModule('dashboard')} 
              />
              <SidebarItem 
                icon={<Package size={20} />} 
                title="Inventory" 
                active={activeModule === 'inventory'} 
                onClick={() => setActiveModule('inventory')} 
              />
              <SidebarItem 
                icon={<Factory size={20} />} 
                title="Production" 
                active={activeModule === 'production'} 
                onClick={() => setActiveModule('production')} 
              />
              <SidebarItem 
                icon={<Clipboard size={20} />} 
                title="Formulation" 
                active={activeModule === 'formulation'} 
                onClick={() => setActiveModule('formulation')} 
              />
              <SidebarItem 
                icon={<ShoppingCart size={20} />} 
                title="Purchase/Sale" 
                active={activeModule === 'purchaseSale'} 
                onClick={() => setActiveModule('purchaseSale')} 
              />
              <SidebarItem 
                icon={<Users size={20} />} 
                title="Core" 
                active={activeModule === 'core'} 
                onClick={() => setActiveModule('core')} 
              />
              <SidebarItem 
                icon={<BarChart3 size={20} />} 
                title="Reports" 
                active={activeModule === 'reports'} 
                onClick={() => setActiveModule('reports')} 
              />
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <SidebarItem 
              icon={<Settings size={20} />} 
              title="Settings" 
              active={false} 
              onClick={() => {}} 
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {activeModule.charAt(0).toUpperCase() + activeModule.slice(1)}
          </h2>
        </header>
        <main className="p-6">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, title, active, onClick }) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`flex items-center w-full p-2 rounded-md ${
          active 
            ? 'bg-primary-50 text-primary-600' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <span className={`${active ? 'text-primary-600' : 'text-gray-500'}`}>
          {icon}
        </span>
        <span className="ml-3">{title}</span>
      </button>
    </li>
  );
};

export default App;