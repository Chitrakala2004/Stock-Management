import {
  Users,
  Building2,
  Package,
  ShoppingCart,
  History,
  Truck,
} from 'lucide-react';

const navItems = [
  { name: 'Customers', label: 'Customers', icon: Users },
  { name: 'Company', label: 'Company', icon: Building2 },
  { name: 'Product', label: 'Product', icon: Package },
  { name: 'Performo', label: 'Performo', icon: ShoppingCart },
  { name: 'Dispatch', label: 'Dispatch', icon: Truck },
  { name: 'All Performo', label: 'All Performo', icon: History },
];

const Sidebar = ({ activePage, setActivePage }) => {
  return (
    <aside className="w-60 bg-slate-900 text-slate-300 flex flex-col h-full shrink-0 shadow-xl z-20">
      {/* Logo Header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800/80">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
          <span className="text-white font-extrabold text-lg tracking-wider">D</span>
        </div>
        <div>
          <h1 className="font-bold text-base text-white leading-tight">Dheeksha</h1>
          <p className="text-[11px] text-blue-400 font-medium leading-tight">Stock & Orders System</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 pt-5 pb-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activePage === item.name ||
            (activePage === 'Customer Accounts' && item.name === 'Customers') ||
            (activePage === 'Companies' && item.name === 'Company') ||
            (activePage === 'Products' && item.name === 'Product') ||
            (activePage === 'Stock Management' && item.name === 'Product') ||
            (activePage === 'Purchase Entry' && item.name === 'Performo') ||
            (activePage === 'Customer Dispatch' && item.name === 'Dispatch') ||
            (activePage === 'Dispatch Management' && item.name === 'Dispatch') ||
            (activePage === 'Purchase History' && item.name === 'All Performo') ||
            (activePage === 'Transactions' && item.name === 'All Performo');

          return (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Admin User Footer */}
      <div className="px-4 py-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-xs">
            A
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">Dheeksha Admin</p>
            <p className="text-[10px] text-slate-400 font-medium truncate">Authorized Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
