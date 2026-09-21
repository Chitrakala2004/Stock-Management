import React, { useState } from 'react';
import { useStock } from '../context/StockContext';
import { Search, Boxes, Calendar, ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react';

const StockTransactions = () => {
  const { stockTransactions, brands } = useStock();
  const [search, setSearch] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredLogs = stockTransactions.filter((tx) => {
    const matchSearch =
      tx.productName.toLowerCase().includes(search.toLowerCase()) ||
      tx.brand.toLowerCase().includes(search.toLowerCase()) ||
      tx.reason.toLowerCase().includes(search.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.toLowerCase());

    const matchBrand = selectedBrandFilter === 'All' || tx.brand === selectedBrandFilter;
    const matchType = typeFilter === 'All' || tx.transactionType === typeFilter;

    return matchSearch && matchBrand && matchType;
  });

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Crackers Stock Movement Audit Log</h3>
            <p className="text-xs text-gray-400">Complete historical audit trail of stock additions, adjustments, and purchase deductions</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial min-w-[180px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search product, brand, reason..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-56 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedBrandFilter}
              onChange={(e) => setSelectedBrandFilter(e.target.value)}
              className="flex-1 sm:flex-initial px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Brands</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Log Table ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="py-3 px-4 font-bold text-gray-500 uppercase">Log ID</th>
                <th className="py-3 px-4 font-bold text-gray-500 uppercase">Date</th>
                <th className="py-3 px-4 font-bold text-gray-500 uppercase">Product & Brand</th>
                <th className="py-3 px-4 font-bold text-gray-500 uppercase">Transaction Type</th>
                <th className="py-3 px-4 font-bold text-gray-500 uppercase">Cases Changed</th>
                <th className="py-3 px-4 font-bold text-gray-500 uppercase">Pieces Changed</th>
                <th className="py-3 px-4 font-bold text-gray-500 uppercase">Reason / Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{tx.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-gray-600">{tx.date}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-gray-900">{tx.productName}</p>
                    <span className="inline-block text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                      {tx.brand}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold">
                    <span className={`px-2 py-0.5 rounded-md text-[11px] ${
                      tx.casesChanged >= 0
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {tx.transactionType}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-black">
                    <span className={tx.casesChanged >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                      {tx.casesChanged >= 0 ? `+${tx.casesChanged}` : tx.casesChanged} Cases
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold">
                    <span className={tx.piecesChanged >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                      {tx.piecesChanged >= 0 ? `+${tx.piecesChanged}` : tx.piecesChanged} Pcs
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 font-medium">{tx.reason}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-400">
                    No stock transaction log entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockTransactions;
