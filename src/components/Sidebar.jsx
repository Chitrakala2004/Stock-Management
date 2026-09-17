import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  Wallet,
  ShoppingCart,
  History,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Stock Management', icon: Package },
  { name: 'Customer Accounts', icon: Users },
  { name: 'Advance Payments', icon: Wallet },
  { name: 'Purchase Entry', icon: ShoppingCart },
  { name: 'Purchase History', icon: History },
];

const Sidebar = ({ activePage, setActivePage }) => {
  return (
    <aside className="w-60 bg-slate-900 text-slate-300 flex flex-col h-full shrink-0 shadow-xl">
      {/* Logo Header */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
        <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
          <span className="text-white font-extrabold text-lg tracking-wider">D</span>
        </div>
        <div>
          <h1 className="font-bold text-sm text-white leading-tight">Dheesha</h1>
          <p className="text-[11px] text-amber-400 font-medium leading-tight">Crackers Admin System</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 pt-4 pb-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Admin Control Center
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activePage === item.name ||
            (activePage === 'Customers' && item.name === 'Customer Accounts') ||
            (activePage === 'Products' && item.name === 'Stock Management') ||
            (activePage === 'Transactions' && item.name === 'Purchase History');

          return (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
              }`}
            >
              <Icon size={17} className={isActive ? 'text-white' : 'text-slate-400'} />
              <span className="flex-1 text-left">{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Admin User Footer */}
      <div className="px-4 py-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-amber-500 to-amber-700 rounded-full flex items-center justify-center ring-2 ring-amber-500/30">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">Crackers Owner (Admin)</p>
            <p className="text-[10px] text-amber-400 font-medium truncate">Authorized Stock Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
