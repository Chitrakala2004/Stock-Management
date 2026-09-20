import React, { useState } from 'react';
import { useStock } from '../context/StockContext';
import {
  Search,
  Eye,
  Trash2,
  FileText,
  Pencil,
} from 'lucide-react';
import Modal from '../components/Modal';

const PurchaseHistory = ({ setActivePage }) => {
  const { purchases = [], customers = [], deletePurchase, openCustomerStatement } = useStock();
  const [search, setSearch] = useState('');
  const [selectedCustomerIdFilter, setSelectedCustomerIdFilter] = useState('All');
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(val || 0);
  };

  const filteredPurchases = purchases.filter((p) => {
    const custName = (p.customerName || p.customer || '').toLowerCase();
    const purId = (p.id || '').toLowerCase();
    const billNo = (p.billNo || '').toLowerCase();
    const compName = (p.companyName || '').toLowerCase();
    const searchLower = search.toLowerCase();

    const matchSearch =
      !search ||
      custName.includes(searchLower) ||
      purId.includes(searchLower) ||
      billNo.includes(searchLower) ||
      compName.includes(searchLower);

    const matchCustomer =
      selectedCustomerIdFilter === 'All' ||
      p.customerId === selectedCustomerIdFilter ||
      (p.customerName && p.customerName.toLowerCase() === selectedCustomerIdFilter.toLowerCase()) ||
      (p.customer && p.customer.toLowerCase() === selectedCustomerIdFilter.toLowerCase());

    return matchSearch && matchCustomer;
  });

  return (
    <div className="space-y-6">
      {/* ── Header Strip ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900 text-base">All Performo</h3>
            <p className="text-xs text-gray-500">Summary ledger log of all customer purchase transactions across the system</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search Bill No, customer, company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedCustomerIdFilter}
              onChange={(e) => setSelectedCustomerIdFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Customers ({purchases.length} Records)</option>
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
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="py-3.5 px-4 font-bold text-gray-600 uppercase whitespace-nowrap">Bill No / ID</th>
                <th className="py-3.5 px-4 font-bold text-gray-600 uppercase whitespace-nowrap">Date</th>
                <th className="py-3.5 px-4 font-bold text-gray-600 uppercase whitespace-nowrap">Customer Name</th>
                <th className="py-3.5 px-4 font-bold text-gray-600 uppercase whitespace-nowrap">Company</th>
                <th className="py-3.5 px-4 font-bold text-gray-600 uppercase whitespace-nowrap">DEBIT</th>
                <th className="py-3.5 px-4 font-bold text-gray-600 uppercase whitespace-nowrap">CREDIT</th>
                <th className="py-3.5 px-4 font-bold text-gray-600 uppercase whitespace-nowrap">NET BALANCE</th>
                <th className="py-3.5 px-4 font-bold text-gray-600 uppercase text-center whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPurchases.map((p) => {
                const debit = p.debit !== undefined ? p.debit : (p.totalPurchaseAmount || 0);
                const credit = p.credit !== undefined ? p.credit : (p.advanceDeducted || 0);
                const netBalance = p.netBalance !== undefined ? p.netBalance : (debit - credit);
                const billDisplay = p.billNo ? `#${p.billNo}` : (p.id || 'N/A');

                return (
                  <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-blue-600 text-xs whitespace-nowrap">{billDisplay}</td>
                    <td className="py-4 px-4 text-xs font-semibold text-gray-600 whitespace-nowrap">{p.purchaseDate || p.date}</td>
                    <td className="py-4 px-4 font-bold text-gray-900 whitespace-nowrap">{p.customerName || p.customer}</td>
                    <td className="py-4 px-4 font-semibold text-slate-700 whitespace-nowrap">{p.companyName || 'SIMBA FW'}</td>
                    <td className="py-4 px-4 font-bold text-slate-900 whitespace-nowrap">{formatCurrency(debit)}</td>
                    <td className="py-4 px-4 font-bold text-emerald-600 whitespace-nowrap">{formatCurrency(credit)}</td>
                    <td className="py-4 px-4 font-extrabold text-blue-700 whitespace-nowrap">{formatCurrency(netBalance)}</td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            if (openCustomerStatement) {
                              openCustomerStatement(p.customerId || p.customerName);
                            }
                            if (setActivePage) {
                              setActivePage('Performo');
                            }
                          }}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                          title="View Customer Account Statement"
                        >
                          <FileText size={13} />
                          <span>Statement</span>
                        </button>
                        <button
                          onClick={() => {
                            if (openCustomerStatement) {
                              openCustomerStatement(p.customerId || p.customerName);
                            }
                            if (setActivePage) {
                              setActivePage('Performo');
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Record"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setSelectedPurchase(p)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all cursor-pointer"
                          title="View Breakdown"
                        >
                          <Eye size={15} />
                        </button>
                        {deletePurchase && (
                          <button
                            onClick={() => deletePurchase(p.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredPurchases.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-400 text-xs font-medium">
                    No All Performo records found.
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
                <p className="text-lg font-black text-blue-600">{formatCurrency(selectedPurchase.totalPurchaseAmount || selectedPurchase.debit || 0)}</p>
              </div>
            </div>

            {selectedPurchase.items && selectedPurchase.items.length > 0 && (
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
                        <td className="py-2.5 px-3 font-bold text-blue-600">{item.brand}</td>
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
            )}

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
