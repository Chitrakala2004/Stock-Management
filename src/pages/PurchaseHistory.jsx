import React, { useState } from 'react';
import { useStock } from '../context/StockContext';
import {
  Search,
  History,
  Calendar,
  User,
  ShoppingBag,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import Modal from '../components/Modal';

const PurchaseHistory = () => {
  const { purchases, customers } = useStock();
  const [search, setSearch] = useState('');
  const [selectedCustomerIdFilter, setSelectedCustomerIdFilter] = useState('All');
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const filteredPurchases = purchases.filter((p) => {
    const matchSearch =
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.items.some((it) => it.productName.toLowerCase().includes(search.toLowerCase()));

    const matchCustomer = selectedCustomerIdFilter === 'All' || p.customerId === selectedCustomerIdFilter;

    return matchSearch && matchCustomer;
  });

  return (
    <div className="space-y-6">
      {/* ── Header Strip ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Crackers Purchase History</h3>
            <p className="text-xs text-gray-400">Complete historical log of confirmed stock allocation purchases & advance deductions</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search ID, customer, product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-56 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedCustomerIdFilter}
              onChange={(e) => setSelectedCustomerIdFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Customers</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="py-3.5 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Purchase ID</th>
                <th className="py-3.5 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-3.5 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="py-3.5 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Items Summary</th>
                <th className="py-3.5 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="py-3.5 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3.5 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPurchases.map((p) => {
                const totalCases = p.items.reduce((s, it) => s + it.casesPurchased, 0);

                return (
                  <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-slate-800 text-xs">{p.id}</td>
                    <td className="py-4 px-4 text-xs font-semibold text-gray-600">{p.purchaseDate}</td>
                    <td className="py-4 px-4 font-bold text-gray-900">{p.customerName}</td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        {p.items.map((it, i) => (
                          <div key={i} className="text-xs text-gray-700 font-medium">
                            <span className="font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">{it.brand}</span> → {it.productName} ({it.casesPurchased} Cases = {it.totalPieces} Pcs)
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-black text-emerald-600">₹{p.totalPurchaseAmount.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-4">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Confirmed
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => setSelectedPurchase(p)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Eye size={14} /> Itemized Details
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredPurchases.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-400 text-sm">
                    No confirmed purchase history records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal: Itemized Purchase Breakdown ── */}
      {selectedPurchase && (
        <Modal
          isOpen={!!selectedPurchase}
          onClose={() => setSelectedPurchase(null)}
          title={`Purchase Order Details - ${selectedPurchase.id}`}
          width="max-w-2xl"
        >
          <div className="space-y-4">
            <div className="bg-slate-100 p-4 rounded-xl flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-slate-900 text-sm">{selectedPurchase.customerName}</p>
                <p className="text-slate-500">Purchase Date: {selectedPurchase.purchaseDate}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 uppercase font-bold">Total Amount</p>
                <p className="text-lg font-black text-emerald-600">₹{selectedPurchase.totalPurchaseAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-2.5 px-3 font-bold text-gray-600">Brand</th>
                    <th className="py-2.5 px-3 font-bold text-gray-600">Product</th>
                    <th className="py-2.5 px-3 font-bold text-gray-600">Cases</th>
                    <th className="py-2.5 px-3 font-bold text-gray-600">Pieces / Case</th>
                    <th className="py-2.5 px-3 font-bold text-gray-600">Total Pieces</th>
                    <th className="py-2.5 px-3 font-bold text-gray-600">Price / Piece</th>
                    <th className="py-2.5 px-3 font-bold text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedPurchase.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-2.5 px-3 font-bold text-purple-700">{item.brand}</td>
                      <td className="py-2.5 px-3 font-semibold text-gray-900">{item.productName}</td>
                      <td className="py-2.5 px-3 font-bold text-blue-600">{item.casesPurchased} Cases</td>
                      <td className="py-2.5 px-3 text-gray-600">{item.piecesPerCase} Pcs</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{item.totalPieces} Pcs</td>
                      <td className="py-2.5 px-3 font-bold text-gray-900">₹{item.pricePerPiece}</td>
                      <td className="py-2.5 px-3 font-black text-emerald-600">₹{item.totalAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={() => setSelectedPurchase(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PurchaseHistory;
