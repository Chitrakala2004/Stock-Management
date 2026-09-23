import React, { useState } from 'react';
import { useStock } from '../context/StockContext';
import {
  Search,
  Plus,
  Trash2,
  Eye,
  User,
  Phone,
  Mail,
  Wallet,
  Calendar,
  CreditCard,
  ShoppingBag,
  PlusCircle,
} from 'lucide-react';
import Modal from '../components/Modal';

const CustomerAccounts = () => {
  const {
    customers,
    getNextCustomerId,
    addCustomer,
    deleteCustomer,
    advancePayments,
    addAdvancePayment,
    purchases,
    getCustomerTotalAdvance,
    getCustomerTotalPurchases,
    getCustomerRemainingAdvance,
  } = useStock();

  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Modals
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isAddAdvanceOpen, setIsAddAdvanceOpen] = useState(false);

  // Forms
  const [customerForm, setCustomerForm] = useState({ name: '', phone: '', email: '' });
  const [advanceForm, setAdvanceForm] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentReference: '',
    paymentMethod: 'UPI',
  });

  const handleAddCustomerSubmit = (e) => {
    e.preventDefault();
    if (!customerForm.name || !customerForm.phone) return;
    const assignedId = getNextCustomerId ? getNextCustomerId(customers) : `CUST-${101 + customers.length}`;
    addCustomer({ ...customerForm, customId: assignedId });
    setCustomerForm({ name: '', phone: '', email: '' });
    setIsAddCustomerOpen(false);
  };

  const handleAddAdvanceSubmit = (e) => {
    e.preventDefault();
    if (!selectedCustomer || !advanceForm.amount) return;

    addAdvancePayment({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      amount: advanceForm.amount,
      date: advanceForm.date,
      paymentReference: advanceForm.paymentReference,
      paymentMethod: advanceForm.paymentMethod,
    });

    setAdvanceForm({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      paymentReference: '',
      paymentMethod: 'UPI',
    });
    setIsAddAdvanceOpen(false);
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  const activeCustomerAdvances = selectedCustomer
    ? advancePayments.filter((a) => {
        const custId = selectedCustomer.id || selectedCustomer.customId;
        const custName = (selectedCustomer.name || '').trim().toLowerCase();
        const aCustName = (a.customerName || '').trim().toLowerCase();
        const idMatches = Boolean(custId && a.customerId && (a.customerId === custId || a.customerId === selectedCustomer.id || a.customerId === selectedCustomer.customId));
        const nameMatches = Boolean(custName && aCustName && aCustName === custName);
        return idMatches || nameMatches;
      })
    : [];

  const activeCustomerPurchases = selectedCustomer
    ? purchases.filter((p) => {
        const custId = selectedCustomer.id || selectedCustomer.customId;
        const custName = (selectedCustomer.name || '').trim().toLowerCase();
        const pCustName = (p.customerName || p.customer || '').trim().toLowerCase();
        const idMatches = Boolean(custId && p.customerId && (p.customerId === custId || p.customerId === selectedCustomer.id || p.customerId === selectedCustomer.customId));
        const nameMatches = Boolean(custName && pCustName && pCustName === custName);
        return (idMatches || nameMatches) && (p.status === 'Confirmed' || !p.status);
      })
    : [];

  return (
    <div className="space-y-6">
      {/* ── Top Control Bar ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900 text-sm sm:text-base">Customer Accounts & Advance Balances</h3>
            <p className="text-xs text-gray-400 mt-0.5">Manage customer accounts, record advance payments, and view individual purchase & payment ledgers</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search customer, phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-56 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => setIsAddCustomerOpen(true)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer w-full sm:w-auto"
            >
              <Plus size={15} /> Add Customer
            </button>
          </div>
        </div>
      </div>

      {/* ── Customer Accounts Table ── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">#</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Mobile Number</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Advance Paid</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Purchase Amount</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Remaining Advance</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredCustomers.map((c, idx) => {
                const totalAdv = getCustomerTotalAdvance(c.id);
                const totalPur = getCustomerTotalPurchases(c.id);
                const remainingAdv = getCustomerRemainingAdvance(c.id);

                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCustomer(c)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 text-xs text-gray-400">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-blue-600 group-hover:underline transition-colors">
                            {c.name}
                          </p>
                          <p className="text-[11px] text-gray-400">Account ID: {c.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-gray-700">{c.phone}</td>
                    <td className="py-3.5 px-4 text-xs text-gray-500">{c.email || 'N/A'}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600">₹{totalAdv.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">₹{totalPur.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs font-black px-2.5 py-1 rounded-md ${
                        remainingAdv > 0
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : remainingAdv === 0
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        ₹{remainingAdv.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedCustomer(c)}
                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={13} /> Details
                        </button>
                        <button
                          onClick={() => deleteCustomer(c.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-400 text-sm">
                    No customers found matching search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal: Add New Customer ── */}
      {isAddCustomerOpen && (
        <Modal
          isOpen={isAddCustomerOpen}
          onClose={() => setIsAddCustomerOpen(false)}
          title="Create New Customer Account"
        >
          <form onSubmit={handleAddCustomerSubmit} className="space-y-4">
            {/* Sequential Customer ID Badge */}
            <div className="flex items-center justify-between px-4 py-2 bg-blue-50/80 border border-blue-200/80 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Assigned ID:
                </span>
                <span className="font-mono font-extrabold text-blue-700 bg-white px-2.5 py-0.5 rounded-md border border-blue-200 shadow-2xs text-xs">
                  {getNextCustomerId ? getNextCustomerId(customers) : `CUST-${101 + customers.length}`}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-blue-600">Auto Sequential ID</span>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kumar Traders"
                value={customerForm.name}
                onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. customer@shop.com"
                  value={customerForm.email}
                  onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsAddCustomerOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Modal: Customer Account Details & History ── */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Customer Account Details - ${selectedCustomer.name}`}
          width="max-w-4xl"
        >
          <div className="space-y-6">
            {/* Header Customer Summary */}
            <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl font-black text-amber-400 border border-white/10">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">{selectedCustomer.name}</h4>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-300">
                      <span><Phone size={13} className="inline text-blue-400 mr-1" /> {selectedCustomer.phone}</span>
                      <span><Mail size={13} className="inline text-blue-400 mr-1" /> {selectedCustomer.email || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsAddAdvanceOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle size={15} /> Record Advance Payment
                </button>
              </div>

              {/* Financial Metrics Cards */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-white/10 relative z-10">
                <div className="bg-white/5 rounded-xl p-3.5 backdrop-blur-sm border border-white/5">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Total Advance Paid</p>
                  <p className="text-xl font-black text-emerald-400 mt-0.5">
                    ₹{getCustomerTotalAdvance(selectedCustomer.id).toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-3.5 backdrop-blur-sm border border-white/5">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Total Purchase Amount</p>
                  <p className="text-xl font-black text-white mt-0.5">
                    ₹{getCustomerTotalPurchases(selectedCustomer.id).toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-3.5 backdrop-blur-sm border border-white/5">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Remaining Advance Balance</p>
                  <p className="text-xl font-black text-amber-300 mt-0.5">
                    ₹{getCustomerRemainingAdvance(selectedCustomer.id).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Table 1: Purchase History ── */}
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
                <ShoppingBag size={16} className="text-blue-600" />
                Purchase History Log
              </h4>

              <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="py-2.5 px-3 font-bold text-gray-600">Date</th>
                      <th className="py-2.5 px-3 font-bold text-gray-600">Purchase ID</th>
                      <th className="py-2.5 px-3 font-bold text-gray-600">Items Purchased</th>
                      <th className="py-2.5 px-3 font-bold text-gray-600">Total Cases</th>
                      <th className="py-2.5 px-3 font-bold text-gray-600">Total Pieces</th>
                      <th className="py-2.5 px-3 font-bold text-gray-600">Purchase Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {activeCustomerPurchases.map((p) => {
                      const sumCases = p.items.reduce((s, it) => s + it.casesPurchased, 0);
                      const sumPieces = p.items.reduce((s, it) => s + it.totalPieces, 0);

                      return (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="py-3 px-3 font-semibold text-gray-600">{p.purchaseDate}</td>
                          <td className="py-3 px-3 font-mono font-bold text-slate-800">{p.id}</td>
                          <td className="py-3 px-3">
                            <div className="space-y-1">
                              {p.items.map((it, i) => (
                                <div key={i} className="text-[11px] text-gray-700">
                                  <strong>{it.brand}</strong> → {it.productName}: {it.casesPurchased} Cases ({it.totalPieces} Pcs @ ₹{it.pricePerPiece}/pc = ₹{it.totalAmount})
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-bold text-blue-600">{sumCases} Cases</td>
                          <td className="py-3 px-3 font-semibold text-gray-700">{sumPieces} Pcs</td>
                          <td className="py-3 px-3 font-black text-emerald-600">₹{p.totalPurchaseAmount.toLocaleString('en-IN')}</td>
                        </tr>
                      );
                    })}
                    {activeCustomerPurchases.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-6 text-gray-400">
                          No confirmed purchases for this customer yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Table 2: Advance Payment History ── */}
            <div>
              <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
                <Wallet size={16} className="text-emerald-600" />
                Advance Payment Receipts History
              </h4>

              <div className="border border-gray-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="py-2.5 px-3 font-bold text-gray-600">Payment Date</th>
                      <th className="py-2.5 px-3 font-bold text-gray-600">Amount Paid</th>
                      <th className="py-2.5 px-3 font-bold text-gray-600">Payment Reference</th>
                      <th className="py-2.5 px-3 font-bold text-gray-600">Payment Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {activeCustomerAdvances.map((adv) => (
                      <tr key={adv.id} className="hover:bg-gray-50">
                        <td className="py-3 px-3 font-semibold text-gray-600">{adv.date}</td>
                        <td className="py-3 px-3 font-black text-emerald-600">+₹{adv.amount.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3 font-mono text-slate-800">{adv.paymentReference}</td>
                        <td className="py-3 px-3">
                          <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                            {adv.paymentMethod}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {activeCustomerAdvances.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-6 text-gray-400">
                          No advance payments recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Modal: Record Advance Payment ── */}
      {isAddAdvanceOpen && selectedCustomer && (
        <Modal
          isOpen={isAddAdvanceOpen}
          onClose={() => setIsAddAdvanceOpen(false)}
          title={`Record Advance Payment for ${selectedCustomer.name}`}
        >
          <form onSubmit={handleAddAdvanceSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Advance Amount Paid (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                step="0.01"
                placeholder="e.g. 50000"
                value={advanceForm.amount}
                onChange={(e) => setAdvanceForm({ ...advanceForm, amount: e.target.value })}
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
                  value={advanceForm.date}
                  onChange={(e) => setAdvanceForm({ ...advanceForm, date: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Payment Method
                </label>
                <select
                  value={advanceForm.paymentMethod}
                  onChange={(e) => setAdvanceForm({ ...advanceForm, paymentMethod: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
                value={advanceForm.paymentReference}
                onChange={(e) => setAdvanceForm({ ...advanceForm, paymentReference: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsAddAdvanceOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition-all cursor-pointer"
              >
                Save Advance Payment
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CustomerAccounts;
