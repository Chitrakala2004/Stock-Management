import React from 'react';
import { useStock } from '../context/StockContext';
import {
  Users,
  Wallet,
  ShoppingCart,
  CreditCard,
  Boxes,
  Package,
  AlertTriangle,
  UserX,
  TrendingUp,
  ArrowRight,
  PlusCircle,
  Send,
  Building2,
} from 'lucide-react';

const Dashboard = ({ setActivePage }) => {
  const {
    totalCustomersCount,
    totalAdvanceCollected,
    totalPurchaseValue,
    totalRemainingAdvance,
    totalStockCases,
    totalStockPieces,
    lowStockProductsCount,
    pendingCustomersCount,
    products,
    purchases,
    stockTransactions,
  } = useStock();

  const cards = [
    {
      title: 'Total Customers',
      value: totalCustomersCount,
      subtitle: 'Registered buyers',
      icon: Users,
      bgColor: 'bg-blue-500',
      shadowColor: 'shadow-blue-200',
      actionPage: 'Customer Accounts',
    },
    {
      title: 'Total Advance Collected',
      value: `₹${totalAdvanceCollected.toLocaleString('en-IN')}`,
      subtitle: 'Customer advance receipts',
      icon: Wallet,
      bgColor: 'bg-emerald-500',
      shadowColor: 'shadow-emerald-200',
      actionPage: 'Advance Payments',
    },
    {
      title: 'Total Purchase Value',
      value: `₹${totalPurchaseValue.toLocaleString('en-IN')}`,
      subtitle: 'Stock allocated value',
      icon: ShoppingCart,
      bgColor: 'bg-indigo-500',
      shadowColor: 'shadow-indigo-200',
      actionPage: 'Purchase History',
    },
    {
      title: 'Total Remaining Advance',
      value: `₹${totalRemainingAdvance.toLocaleString('en-IN')}`,
      subtitle: 'Available for allocation',
      icon: CreditCard,
      bgColor: 'bg-amber-500',
      shadowColor: 'shadow-amber-200',
      actionPage: 'Advance Payments',
    },
    {
      title: 'Total Stock Cases',
      value: `${totalStockCases.toLocaleString('en-IN')} Cases`,
      subtitle: 'Available in godown',
      icon: Boxes,
      bgColor: 'bg-purple-500',
      shadowColor: 'shadow-purple-200',
      actionPage: 'Stock Management',
    },
    {
      title: 'Total Stock Pieces',
      value: `${totalStockPieces.toLocaleString('en-IN')} Pcs`,
      subtitle: 'Calculated piece stock',
      icon: Package,
      bgColor: 'bg-cyan-500',
      shadowColor: 'shadow-cyan-200',
      actionPage: 'Stock Management',
    },
    {
      title: 'Low Stock Products',
      value: lowStockProductsCount,
      subtitle: 'Below threshold level',
      icon: AlertTriangle,
      bgColor: 'bg-rose-500',
      shadowColor: 'shadow-rose-200',
      actionPage: 'Stock Management',
    },
    {
      title: 'Pending Customer Payments',
      value: pendingCustomersCount,
      subtitle: 'Zero advance balance',
      icon: UserX,
      bgColor: 'bg-slate-600',
      shadowColor: 'shadow-slate-200',
      actionPage: 'Customer Accounts',
    },
  ];

  const recentPurchases = purchases.slice(0, 4);
  const lowStockList = products.filter((p) => p.availableCases <= (p.minStockCases || 10));

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-semibold mb-2">
              💥 Crackers Stock & Advance Deduction Management
            </div>
            <h2 className="text-2xl font-bold">Admin Control Center</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Record advance payments, add brands & products with pieces-per-case specifications, build multi-product purchase cart allocations, and automatically deduct stock & advance balances.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePage('Purchase Entry')}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-xs rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <PlusCircle size={15} />
              New Purchase Entry
            </button>
            <button
              onClick={() => setActivePage('Advance Payments')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl backdrop-blur-sm border border-white/10 transition-all cursor-pointer"
            >
              <Wallet size={15} />
              Record Advance
            </button>
          </div>
        </div>
      </div>

      {/* ── 8 Dashboard Cards Grid ── */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">
          Business & Inventory Metrics
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                onClick={() => setActivePage(card.actionPage)}
                className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-11 h-11 ${card.bgColor} rounded-xl flex items-center justify-center text-white shadow-md ${card.shadowColor} group-hover:scale-110 transition-transform`}
                  >
                    <Icon size={20} />
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-blue-600 font-medium flex items-center gap-0.5">
                    View <ArrowRight size={12} />
                  </span>
                </div>
                <h4 className="text-2xl font-extrabold text-gray-900 leading-tight">{card.value}</h4>
                <p className="text-xs font-semibold text-gray-600 mt-1">{card.title}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{card.subtitle}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Quick Action Shortcuts & Recent Logs ── */}
      <div className="grid grid-cols-12 gap-5">
        {/* Recent Purchases */}
        <div className="col-span-7 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-base">Recent Stock Allocations</h3>
            <button
              onClick={() => setActivePage('Purchase History')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              All Purchases <ArrowRight size={13} />
            </button>
          </div>

          <div className="space-y-3">
            {recentPurchases.map((p) => (
              <div key={p.id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 hover:bg-blue-50/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center font-bold text-xs">
                      {p.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{p.customerName}</p>
                      <p className="text-[11px] text-gray-400">{p.id} • {p.purchaseDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-slate-900">₹{p.totalPurchaseAmount.toLocaleString('en-IN')}</p>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Deducted from Advance
                    </span>
                  </div>
                </div>

                {/* Items summary */}
                <div className="mt-2.5 pt-2 border-t border-gray-200/60 flex flex-wrap gap-2">
                  {p.items.map((item, i) => (
                    <span key={i} className="text-[11px] font-medium text-gray-600 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                      {item.brand} → {item.productName}: {item.casesPurchased} Cases ({item.totalPieces} Pcs = ₹{item.totalAmount})
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {recentPurchases.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-6">No purchases recorded yet.</p>
            )}
          </div>
        </div>

        {/* Low Stock Crackers List */}
        <div className="col-span-5 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-base">Low Stock Crackers</h3>
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
              {lowStockList.length} items
            </span>
          </div>

          <div className="space-y-3">
            {lowStockList.map((prod) => (
              <div key={prod.id} className="p-3 bg-rose-50/60 border border-rose-100 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-900">{prod.name}</p>
                    <p className="text-[11px] text-gray-500">{prod.brand} • {prod.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-rose-600">{prod.availableCases} Cases</span>
                    <p className="text-[10px] text-gray-400">{prod.availableCases * prod.piecesPerCase} Pieces left</p>
                  </div>
                </div>
              </div>
            ))}

            {lowStockList.length === 0 && (
              <div className="text-center py-8 text-xs text-emerald-600 font-semibold bg-emerald-50/50 rounded-xl">
                ✅ All crackers products have sufficient stock levels!
              </div>
            )}

            <button
              onClick={() => setActivePage('Stock Management')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors mt-2 cursor-pointer"
            >
              Manage Stock & Add Inventory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
