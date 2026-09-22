import React, { useState } from 'react';
import { useStock } from '../context/StockContext';
import {
  Search,
  Plus,
  Wallet,
  Calendar,
  CreditCard,
  User,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import Modal from '../components/Modal';

const AdvancePayments = () => {
  const {
    customers,
    advancePayments,
    addAdvancePayment,
    getCustomerTotalAdvance,
    getCustomerTotalPurchases,
    getCustomerRemainingAdvance,
  } = useStock();

  const [search, setSearch] = useState('');
  const [selectedCustomerIdFilter, setSelectedCustomerIdFilter] = useState('All');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    customerId: customers[0]?.id || '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentReference: '',
    paymentMethod: 'UPI',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerId || !formData.amount) return;

    addAdvancePayment({
      customerId: formData.customerId,
      amount: formData.amount,
      date: formData.date,
      paymentReference: formData.paymentReference,
      paymentMethod: formData.paymentMethod,
    });

    setFormData({
      customerId: customers[0]?.id || '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      paymentReference: '',
      paymentMethod: 'UPI',
    });
    setIsModalOpen(false);
  };

  const filteredAdvances = advancePayments.filter((adv) => {
    const matchSearch =
      adv.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (adv.paymentReference && adv.paymentReference.toLowerCase().includes(search.toLowerCase())) ||
      adv.paymentMethod.toLowerCase().includes(search.toLowerCase());

    const matchCustomer = selectedCustomerIdFilter === 'All' || adv.customerId === selectedCustomerIdFilter;
    const matchMethod = paymentMethodFilter === 'All' || adv.paymentMethod === paymentMethodFilter;

    return matchSearch && matchCustomer && matchMethod;
  });

  const totalAdvanceCollected = advancePayments.reduce((sum, a) => sum + (a.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* ── Summary Strip ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
                <Wallet size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Advance Collected</p>
                <p className="text-xl sm:text-2xl font-black text-emerald-600">₹{totalAdvanceCollected.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-10 bg-gray-200"></div>

            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Advance Receipts</p>
              <p className="text-xl sm:text-2xl font-black text-slate-800">{advancePayments.length} Receipts</p>
            </div>
          </div>

          <button
            onClick={() => {
              setFormData((prev) => ({ ...prev, customerId: customers[0]?.id || '' }));
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Plus size={16} /> Record Advance Payment
          </button>
        </div>
      </div>

      {/* ── Filters & Table Card ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-5">
          <h3 className="font-bold text-gray-900 text-base">Advance Payments Ledger</h3>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search customer, reference..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-56 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedCustomerIdFilter}
              onChange={(e) => setSelectedCustomerIdFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Customers</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
              <option value="NEFT">NEFT</option>
            </select>
          </div>
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Receipt ID</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Amount Paid</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Payment Method</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Payment Reference</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Customer Remaining Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredAdvances.map((adv) => {
                const rem = getCustomerRemainingAdvance(adv.customerId);
                return (
                  <tr key={adv.id} className="hover:bg-gray-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 text-xs">{adv.id}</td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-gray-600">{adv.date}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-blue-600" />
                        <span className="font-bold text-gray-900">{adv.customerName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-600">+₹{adv.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                        {adv.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-gray-500">{adv.paymentReference || 'N/A'}</td>
                    <td className="py-3.5 px-4 font-bold text-amber-600 text-xs">
                      ₹{rem.toLocaleString('en-IN')}
                    </td>
                  </tr>
                );
              })}
              {filteredAdvances.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-400 text-sm">
                    No advance payment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal: Record Advance Payment ── */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Record Customer Advance Payment"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Select Customer <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Advance Amount Paid (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                step="0.01"
                placeholder="e.g. 50000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-emerald-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Payment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="NEFT">NEFT</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Payment Reference / Transaction ID
              </label>
              <input
                type="text"
                placeholder="e.g. UPI-982341 or Cheque #445123"
                value={formData.paymentReference}
                onChange={(e) => setFormData({ ...formData, paymentReference: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition-all cursor-pointer"
              >
                Confirm Advance Payment
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdvancePayments;
