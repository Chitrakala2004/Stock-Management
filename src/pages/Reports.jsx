import React from 'react';
import { useStock } from '../context/StockContext';
import { FileSpreadsheet, Download, Building2, Wallet, Boxes, TrendingUp } from 'lucide-react';

const Reports = () => {
  const {
    brands,
    products,
    customers,
    advancePayments,
    purchases,
    getCustomerTotalAdvance,
    getCustomerTotalPurchases,
    getCustomerRemainingAdvance,
  } = useStock();

  // Brand summary breakdown
  const brandReports = brands.map((brand) => {
    const brandProds = products.filter((p) => p.brand === brand);
    const totalCases = brandProds.reduce((s, p) => s + p.availableCases, 0);
    const totalVal = brandProds.reduce((s, p) => s + p.availableCases * p.piecesPerCase * p.pricePerPiece, 0);
    return {
      brand,
      itemCount: brandProds.length,
      totalCases,
      totalVal,
    };
  });

  const totalAdvance = advancePayments.reduce((s, a) => s + (a.amount || 0), 0);
  const totalPurchasesVal = purchases
    .filter((p) => p.status === 'Confirmed')
    .reduce((s, p) => s + p.totalPurchaseAmount, 0);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="font-bold text-gray-900 text-base">Crackers Business Financial & Inventory Reports</h3>
          <p className="text-xs text-gray-400">Comprehensive overview of stock valuation by brand and customer advance ledgers</p>
        </div>
        <button
          onClick={() => alert('Exporting PDF/Excel Report...')}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          <Download size={15} /> Export Complete Report
        </button>
      </div>

      {/* ── Brand Stock Valuation Breakdown ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <Building2 size={16} className="text-purple-600" />
          Stock Valuation Breakdown by Brand
        </h4>

        <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 font-bold text-gray-600">Brand Name</th>
                <th className="py-3 px-4 font-bold text-gray-600">Crackers Products</th>
                <th className="py-3 px-4 font-bold text-gray-600">Total Cases Available</th>
                <th className="py-3 px-4 font-bold text-gray-600">Total Stock Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {brandReports.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-purple-700">{r.brand}</td>
                  <td className="py-3 px-4 font-semibold text-gray-800">{r.itemCount} Items</td>
                  <td className="py-3 px-4 font-bold text-blue-600">{r.totalCases} Cases</td>
                  <td className="py-3 px-4 font-black text-emerald-600">₹{r.totalVal.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Customer Account Summary Report ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <Wallet size={16} className="text-emerald-600" />
          Customer Advance & Purchase Ledger Summary
        </h4>

        <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 font-bold text-gray-600">Customer Name</th>
                <th className="py-3 px-4 font-bold text-gray-600">Phone</th>
                <th className="py-3 px-4 font-bold text-gray-600">Total Advance Paid</th>
                <th className="py-3 px-4 font-bold text-gray-600">Total Purchases Deducted</th>
                <th className="py-3 px-4 font-bold text-gray-600">Remaining Advance Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((c) => {
                const adv = getCustomerTotalAdvance(c.id);
                const pur = getCustomerTotalPurchases(c.id);
                const rem = getCustomerRemainingAdvance(c.id);

                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3 px-4 text-gray-600">{c.phone}</td>
                    <td className="py-3 px-4 font-bold text-emerald-600">₹{adv.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">₹{pur.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 font-black text-amber-600">₹{rem.toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
