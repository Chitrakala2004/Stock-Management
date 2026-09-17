import { useState, useEffect } from 'react';
import { useStock } from '../context/StockContext';
import {
  Search,
  Plus,
  Printer,
  Edit3,
  Trash2,
  Phone,
  CreditCard,
  Wallet,
  FileText,
  Building2,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  Download,
  IndianRupee,
} from 'lucide-react';
import Modal from '../components/Modal';

const Customers = () => {
  const stockContext = useStock();
  const {
    customers: contextCustomers = [],
    purchases: contextPurchases = [],
    advancePayments: contextAdvances = [],
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addAdvancePayment,
    getCustomerTotalAdvance,
    getCustomerTotalPurchases,
  } = stockContext || {};

  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState({});

  useEffect(() => {
    if (contextCustomers && contextCustomers.length > 0) {
      setCustomers(
        contextCustomers.map((c) => ({
          id: c.customId || c.id || c._id,
          name: c.name,
          phone: c.phone || 'N/A',
          gst: c.gst || 'N/A',
          address: c.address || 'N/A',
          debit: getCustomerTotalPurchases ? getCustomerTotalPurchases(c.id) : (c.debit || 0),
          credit: getCustomerTotalAdvance ? getCustomerTotalAdvance(c.id) : (c.credit || 0),
          email: c.email || '',
        }))
      );
    } else {
      setCustomers([]);
    }
  }, [contextCustomers, contextPurchases, contextAdvances]);
  const [search, setSearch] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editCustomer, setEditCustomer] = useState(null);

  // Forms
  const [formData, setFormData] = useState({
    name: '',
    gst: '',
    address: '',
    phone: '',
    email: '',
    debit: '',
    credit: '',
  });

  const [paymentForm, setPaymentForm] = useState({
    type: 'credit', // 'credit' (Payment received) or 'debit' (New purchase)
    amount: '',
    paymentMethod: 'UPI',
    ref: '',
    desc: '',
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(val);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add Customer Submit (Saves to MongoDB Atlas)
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const debitVal = parseFloat(formData.debit) || 0;
    const creditVal = parseFloat(formData.credit) || 0;

    const newCustPayload = {
      name: formData.name.toUpperCase(),
      gst: formData.gst ? formData.gst.toUpperCase() : 'N/A',
      address: formData.address ? formData.address.toUpperCase() : 'N/A',
      phone: formData.phone,
      email: formData.email || '',
      debit: debitVal,
      credit: creditVal,
    };

    let savedCust;
    if (addCustomer) {
      savedCust = await addCustomer(newCustPayload);
    } else {
      savedCust = { id: `CUST-${Date.now()}`, ...newCustPayload };
      setCustomers((prev) => [savedCust, ...prev]);
    }

    if (creditVal > 0 && addAdvancePayment && savedCust) {
      await addAdvancePayment({
        customerId: savedCust.id || savedCust.customId || savedCust._id,
        customerName: savedCust.name,
        amount: creditVal,
        date: new Date().toISOString().split('T')[0],
        paymentReference: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
        paymentMethod: 'Cash',
      });
    }

    const initialTx = [];
    if (debitVal > 0) {
      initialTx.push({
        date: new Date().toISOString().split('T')[0],
        ref: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        desc: 'Opening Purchases / Debit',
        type: 'debit',
        amount: debitVal,
      });
    }
    if (creditVal > 0) {
      initialTx.push({
        date: new Date().toISOString().split('T')[0],
        ref: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
        desc: 'Opening Payment / Credit',
        type: 'credit',
        amount: creditVal,
      });
    }

    if (initialTx.length > 0 && savedCust) {
      const targetId = savedCust.id || savedCust.customId || savedCust._id;
      setTransactions((prev) => ({ ...prev, [targetId]: initialTx }));
    }

    setFormData({ name: '', gst: '', address: '', phone: '', email: '', debit: '', credit: '' });
    setIsAddModalOpen(false);
  };

  // Open Edit Customer Modal
  const openEditModal = (cust, e) => {
    if (e) e.stopPropagation();
    setEditCustomer(cust);
    setFormData({
      name: cust.name,
      gst: cust.gst,
      address: cust.address,
      phone: cust.phone,
      email: cust.email || '',
      debit: cust.debit,
      credit: cust.credit,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    if (!editCustomer) return;

    const updatePayload = {
      name: formData.name.toUpperCase(),
      gst: formData.gst ? formData.gst.toUpperCase() : 'N/A',
      address: formData.address ? formData.address.toUpperCase() : 'N/A',
      phone: formData.phone,
      email: formData.email,
      debit: parseFloat(formData.debit) || 0,
      credit: parseFloat(formData.credit) || 0,
    };

    if (updateCustomer) {
      await updateCustomer(editCustomer.id, updatePayload);
    }

    setCustomers((prev) =>
      prev.map((c) =>
        c.id === editCustomer.id ? { ...c, ...updatePayload } : c
      )
    );

    setIsEditModalOpen(false);
    setEditCustomer(null);
  };

  // Delete Customer (MongoDB)
  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this customer entry?')) {
      if (deleteCustomer) {
        await deleteCustomer(id);
      }
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      if (selectedCustomer?.id === id) setSelectedCustomer(null);
    }
  };

  // Open Payment/Credit Modal
  const openPaymentModal = (cust, e) => {
    if (e) e.stopPropagation();
    setSelectedCustomer(cust);
    setPaymentForm({
      type: 'credit',
      amount: '',
      paymentMethod: 'UPI',
      ref: '',
      desc: '',
    });
    setIsPaymentModalOpen(true);
  };

  // Submit Payment/Credit or Debit Entry
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer || !paymentForm.amount) return;

    const amt = parseFloat(paymentForm.amount) || 0;
    const isCredit = paymentForm.type === 'credit';
    const today = new Date().toISOString().split('T')[0];

    if (isCredit && addAdvancePayment) {
      await addAdvancePayment({
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        amount: amt,
        date: today,
        paymentReference: paymentForm.ref || `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
        paymentMethod: paymentForm.paymentMethod || 'UPI',
      });
    }

    // Update customer debit/credit balance
    setCustomers(
      customers.map((c) => {
        if (c.id === selectedCustomer.id) {
          return {
            ...c,
            credit: isCredit ? c.credit + amt : c.credit,
            debit: !isCredit ? c.debit + amt : c.debit,
          };
        }
        return c;
      })
    );

    // Add transaction entry
    const newTx = {
      date: today,
      ref: paymentForm.ref || `${isCredit ? 'PAY' : 'INV'}-${Math.floor(1000 + Math.random() * 9000)}`,
      desc: paymentForm.desc || (isCredit ? `Payment Received via ${paymentForm.paymentMethod}` : 'New Purchase Order'),
      type: paymentForm.type,
      amount: amt,
    };

    setTransactions((prev) => ({
      ...prev,
      [selectedCustomer.id]: [newTx, ...(prev[selectedCustomer.id] || [])],
    }));

    setIsPaymentModalOpen(false);
  };

  // Open Ledger Modal
  const openLedgerModal = (cust, e) => {
    if (e) e.stopPropagation();
    setSelectedCustomer(cust);
    setIsLedgerModalOpen(true);
  };

  // Print function
  const handlePrintList = () => {
    window.print();
  };

  // Search Filter
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.gst.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ── Page Title & Action Controls Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Customers</h1>
          <p className="text-sm text-slate-500 mt-1">
            Customer directory with live Debit (Purchases), Credit (Paid/Advance), and Balance
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-xs"
            />
          </div>

       {/* Add New Customer Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm active:scale-[0.98] transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
          >
            <Plus size={16} />
            Add New Customer
          </button>
        </div>
      </div>

      {/* ── Customers Directory Table Card ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  CUSTOMER NAME
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  ADDRESS & CONTACT
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  DEBIT (DR)
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                  CREDIT (CR)
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  NET BALANCE
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredCustomers.map((cust) => {
                const netBalance = cust.debit - cust.credit;
                const isDue = netBalance > 0;
                const isAdvance = netBalance < 0;

                return (
                  <tr
                    key={cust.id}
                    className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                    onClick={() => openLedgerModal(cust)}
                  >
                    {/* ID */}
                    <td className="py-4 px-6 font-mono text-slate-400 text-xs font-medium">
                      {cust.id}
                    </td>

                    {/* Customer Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                          {cust.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm tracking-wide uppercase group-hover:text-blue-600 transition-colors">
                            {cust.name}
                          </p>
                          <p className="text-xs text-slate-400 font-medium mt-0.5">
                            GST: {cust.gst}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Address & Contact */}
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-slate-700 text-xs tracking-wide uppercase">
                          {cust.address}
                        </p>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <Phone size={12} className="text-pink-500 shrink-0" />
                          {cust.phone}
                        </p>
                      </div>
                    </td>

                    {/* Debit (DR) */}
                    <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                      {formatCurrency(cust.debit)}
                    </td>

                    {/* Credit (CR) */}
                    <td className="py-4 px-6 font-bold text-emerald-600 text-sm">
                      {formatCurrency(cust.credit)}
                    </td>

                    {/* Net Balance */}
                    <td className="py-4 px-6">
                      <div>
                        <p
                          className={`font-bold text-sm ${
                            isDue
                              ? 'text-rose-600'
                              : isAdvance
                              ? 'text-emerald-600'
                              : 'text-slate-600'
                          }`}
                        >
                          {formatCurrency(Math.abs(netBalance))}
                        </p>
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-0.5 ${
                            isDue
                              ? 'bg-rose-50 text-rose-600 border border-rose-100'
                              : isAdvance
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {isDue ? 'Due' : isAdvance ? 'Advance Credit' : 'Paid Clean'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        {/* Action 1: Ledger / History */}
                        <button
                          onClick={(e) => openLedgerModal(cust, e)}
                          title="View Ledger & History"
                          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <CreditCard size={15} />
                        </button>

                        {/* Action 2: Add Credit / Payment */}
                        <button
                          onClick={(e) => openPaymentModal(cust, e)}
                          title="Record Payment (Credit)"
                          className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Wallet size={15} />
                        </button>

                        {/* Action 3: Edit */}
                        <button
                          onClick={(e) => openEditModal(cust, e)}
                          title="Edit Customer"
                          className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Edit3 size={15} />
                        </button>

                        {/* Action 4: Delete */}
                        <button
                          onClick={(e) => handleDelete(cust.id, e)}
                          title="Delete Customer"
                          className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400 text-sm">
                    No customers found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal 1: Add New Customer ── */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Customer"
          width="max-w-2xl"
        >
          <form onSubmit={handleAddCustomer} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SAI MOHAN MARKETING"
                value={formData.name}
                onChange={handleInputChange}
                name="name"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
              />
            </div>

            {/* Mobile Number & GSTIN / Tax ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 86020 05900"
                  value={formData.phone}
                  onChange={handleInputChange}
                  name="phone"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  GSTIN / Tax ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 22ADWPN7742F1Z7"
                  value={formData.gst}
                  onChange={handleInputChange}
                  name="gst"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. customer@shop.com"
                value={formData.email}
                onChange={handleInputChange}
                name="email"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Delivery Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Plot No. 45, Main Commercial Complex, Raipur, Chhattisgarh - 492001"
                value={formData.address}
                onChange={handleInputChange}
                name="address"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none font-medium"
              />
            </div>


            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-sm cursor-pointer"
              >
                Save Customer
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Modal 2: Edit Customer ── */}
      {isEditModalOpen && editCustomer && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Customer - ${editCustomer.name}`}
          width="max-w-2xl"
        >
          <form onSubmit={handleUpdateCustomer} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                name="name"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
              />
            </div>

            {/* Mobile Number & GSTIN / Tax ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  name="phone"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  GSTIN / Tax ID
                </label>
                <input
                  type="text"
                  value={formData.gst}
                  onChange={handleInputChange}
                  name="gst"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Delivery Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={formData.address}
                onChange={handleInputChange}
                name="address"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none font-medium"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                name="email"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-sm cursor-pointer"
              >
                Update Customer
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Modal 3: Record Payment / Credit or Debit ── */}
      {isPaymentModalOpen && selectedCustomer && (
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title={`Record Payment / Transaction - ${selectedCustomer.name}`}
        >
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900">{selectedCustomer.name}</p>
                <p className="text-slate-500">GST: {selectedCustomer.gst}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500">Net Due Balance:</p>
                <p className="font-bold text-rose-600">
                  {formatCurrency(selectedCustomer.debit - selectedCustomer.credit)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="credit"
                  checked={paymentForm.type === 'credit'}
                  onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                Credit (Payment Received)
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="type"
                  value="debit"
                  checked={paymentForm.type === 'debit'}
                  onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })}
                  className="text-blue-600 focus:ring-blue-500"
                />
                Debit (New Purchase / Bill)
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="e.g. 50000.00"
                value={paymentForm.amount}
                onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-base font-bold text-emerald-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            {paymentForm.type === 'credit' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Payment Method
                </label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="NEFT">NEFT / RTGS</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Reference / Inv No.
              </label>
              <input
                type="text"
                placeholder="e.g. PAY-2024-001 or INV-8891"
                value={paymentForm.ref}
                onChange={(e) => setPaymentForm({ ...paymentForm, ref: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Description / Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Advance payment received via UPI"
                value={paymentForm.desc}
                onChange={(e) => setPaymentForm({ ...paymentForm, desc: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 text-white font-semibold text-sm rounded-xl hover:bg-emerald-700 transition-all shadow-sm cursor-pointer"
              >
                Save Transaction
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Modal 4: Customer Ledger & History ── */}
      {isLedgerModalOpen && selectedCustomer && (
        <Modal
          isOpen={isLedgerModalOpen}
          onClose={() => setIsLedgerModalOpen(false)}
          title={`Customer Ledger - ${selectedCustomer.name}`}
          width="max-w-3xl"
        >
          <div className="space-y-6">
            {/* Header info */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl text-white">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      GST: {selectedCustomer.gst} • Location: {selectedCustomer.address}
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    setIsLedgerModalOpen(false);
                    openPaymentModal(selectedCustomer, e);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Wallet size={14} /> Record Payment
                </button>
              </div>

              {/* Balances Grid */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-800">
                <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Total Debit (Purchases)</p>
                  <p className="text-lg font-bold text-white mt-0.5">
                    {formatCurrency(selectedCustomer.debit)}
                  </p>
                </div>

                <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Total Credit (Paid)</p>
                  <p className="text-lg font-bold text-emerald-400 mt-0.5">
                    {formatCurrency(selectedCustomer.credit)}
                  </p>
                </div>

                <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Net Balance Due</p>
                  <p className="text-lg font-bold text-rose-400 mt-0.5">
                    {formatCurrency(selectedCustomer.debit - selectedCustomer.credit)}
                  </p>
                </div>
              </div>
            </div>

            {/* Transactions History Table */}
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-3">Transaction History</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4 font-bold text-slate-600">Date</th>
                      <th className="py-3 px-4 font-bold text-slate-600">Ref No.</th>
                      <th className="py-3 px-4 font-bold text-slate-600">Details</th>
                      <th className="py-3 px-4 font-bold text-slate-600">Type</th>
                      <th className="py-3 px-4 font-bold text-slate-600">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(transactions[selectedCustomer.id] || []).map((tx, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium text-slate-600">{tx.date}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-900">{tx.ref}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">{tx.desc}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-bold px-2 py-0.5 rounded ${
                              tx.type === 'credit'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {tx.type === 'credit' ? 'CREDIT' : 'DEBIT'}
                          </span>
                        </td>
                        <td
                          className={`py-3 px-4 font-bold ${
                            tx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'
                          }`}
                        >
                          {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </td>
                      </tr>
                    ))}

                    {(!transactions[selectedCustomer.id] ||
                      transactions[selectedCustomer.id].length === 0) && (
                      <tr>
                        <td colSpan="5" className="text-center py-6 text-slate-400">
                          No transactions logged yet.
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
    </div>
  );
};

export default Customers;
