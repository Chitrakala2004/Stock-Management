import { useState } from 'react';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Download,
  User,
  Phone,
  Mail,
  IndianRupee,
  Calendar,
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Package,
  Send,
  AlertCircle,
  CheckCircle2,
  Boxes,
} from 'lucide-react';
import Modal from '../components/Modal';

const initialCustomers = [
  {
    id: 1,
    name: 'Rajesh Kumar (Sri Sai Traders)',
    phone: '9876543210',
    email: 'rajesh@saisai.com',
    advancePaid: 50000,
    advanceBalance: 22000, // ₹50k paid - ₹28k dispatched = ₹22k remaining
    bookedCases: 50,
    dispatchedCases: 28,
    remainingCases: 22,
    status: 'Active',
    joined: '2024-08-15',
  },
  {
    id: 2,
    name: 'Sunita Sharma (Sharma Crackers)',
    phone: '9845612370',
    email: 'sunita@sharmacrackers.in',
    advancePaid: 100000,
    advanceBalance: 35000, // ₹100k paid - ₹65k dispatched = ₹35k remaining
    bookedCases: 120,
    dispatchedCases: 80,
    remainingCases: 40,
    status: 'Active',
    joined: '2024-08-20',
  },
  {
    id: 3,
    name: 'Meena Stores',
    phone: '9123456790',
    email: 'meena@stores.com',
    advancePaid: 75000,
    advanceBalance: 15000,
    bookedCases: 80,
    dispatchedCases: 65,
    remainingCases: 15,
    status: 'Active',
    joined: '2024-08-25',
  },
  {
    id: 4,
    name: 'Priya Enterprises (Deepavali Mart)',
    phone: '9988776655',
    email: 'priya@deepavalimart.com',
    advancePaid: 150000,
    advanceBalance: 90000,
    bookedCases: 150,
    dispatchedCases: 60,
    remainingCases: 90,
    status: 'Active',
    joined: '2024-09-01',
  },
  {
    id: 5,
    name: 'Amit & Sons Crackers',
    phone: '9765432109',
    email: 'amit@sons.com',
    advancePaid: 30000,
    advanceBalance: 0,
    bookedCases: 30,
    dispatchedCases: 30,
    remainingCases: 0,
    status: 'Completed',
    joined: '2024-07-10',
  },
];

const customerTransactionsMap = {
  1: [
    { date: '2024-09-14', ref: 'DSP-2024-089', desc: 'Dispatched 10 Cases (Sparklers & Ground Chakkars)', type: 'dispatch', casesSent: 10, amount: 12000, remainingCases: 22, remainingAdvance: 22000 },
    { date: '2024-09-10', ref: 'DSP-2024-045', desc: 'Dispatched 18 Cases (Rockets & Multi-shot Aerial)', type: 'dispatch', casesSent: 18, amount: 16000, remainingCases: 32, remainingAdvance: 34000 },
    { date: '2024-08-15', ref: 'ADV-2024-012', desc: 'Advance Amount Received via UPI', type: 'advance', casesSent: 0, amount: 50000, remainingCases: 50, remainingAdvance: 50000 },
  ],
  2: [
    { date: '2024-09-12', ref: 'DSP-2024-072', desc: 'Dispatched 30 Cases (Flower Pots & Gift Boxes)', type: 'dispatch', casesSent: 30, amount: 25000, remainingCases: 40, remainingAdvance: 35000 },
    { date: '2024-09-05', ref: 'DSP-2024-031', desc: 'Dispatched 50 Cases (Sparklers & Atom Bombs)', type: 'dispatch', casesSent: 50, amount: 40000, remainingCases: 70, remainingAdvance: 60000 },
    { date: '2024-08-20', ref: 'ADV-2024-008', desc: 'Advance Booking Payment Received (NEFT)', type: 'advance', casesSent: 0, amount: 100000, remainingCases: 120, remainingAdvance: 100000 },
  ],
  3: [
    { date: '2024-09-11', ref: 'DSP-2024-065', desc: 'Dispatched 25 Cases (Mixed Crackers Carton)', type: 'dispatch', casesSent: 25, amount: 25000, remainingCases: 15, remainingAdvance: 15000 },
    { date: '2024-09-02', ref: 'DSP-2024-018', desc: 'Dispatched 40 Cases (Electric Crackers & Bombs)', type: 'dispatch', casesSent: 40, amount: 35000, remainingCases: 40, remainingAdvance: 40000 },
    { date: '2024-08-25', ref: 'ADV-2024-015', desc: 'Advance Booking Payment Received (Cash)', type: 'advance', casesSent: 0, amount: 75000, remainingCases: 80, remainingAdvance: 75000 },
  ],
  4: [
    { date: '2024-09-15', ref: 'DSP-2024-095', desc: 'Dispatched 60 Cases (Family Gift Packs & Fountains)', type: 'dispatch', casesSent: 60, amount: 60000, remainingCases: 90, remainingAdvance: 90000 },
    { date: '2024-09-01', ref: 'ADV-2024-022', desc: 'Advance Booking Payment Received (Bank Transfer)', type: 'advance', casesSent: 0, amount: 150000, remainingCases: 150, remainingAdvance: 150000 },
  ],
  5: [
    { date: '2024-08-10', ref: 'DSP-2024-010', desc: 'Dispatched 30 Cases (Full Order Fulfilled)', type: 'dispatch', casesSent: 30, amount: 30000, remainingCases: 0, remainingAdvance: 0 },
    { date: '2024-07-10', ref: 'ADV-2024-001', desc: 'Advance Booking Received', type: 'advance', casesSent: 0, amount: 30000, remainingCases: 30, remainingAdvance: 30000 },
  ],
};

const Customers = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [transactions, setTransactions] = useState(customerTransactionsMap);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [dispatchCustomer, setDispatchCustomer] = useState(null);

  // Add Customer Form
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    advancePaid: '',
    bookedCases: '',
    status: 'Active',
  });

  // Dispatch Form
  const [dispatchData, setDispatchData] = useState({
    casesSent: '',
    billAmount: '',
    desc: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDispatchInputChange = (e) => {
    const { name, value } = e.target;
    setDispatchData((prev) => ({ ...prev, [name]: value }));
  };

  // Add New Customer & Advance Booking
  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.advancePaid || !formData.bookedCases) return;

    const today = new Date().toISOString().split('T')[0];
    const adv = parseFloat(formData.advancePaid) || 0;
    const cases = parseInt(formData.bookedCases, 10) || 0;
    const newId = Date.now();

    const newCust = {
      id: newId,
      name: formData.name,
      phone: formData.phone,
      email: formData.email || 'N/A',
      advancePaid: adv,
      advanceBalance: adv,
      bookedCases: cases,
      dispatchedCases: 0,
      remainingCases: cases,
      status: formData.status,
      joined: today,
    };

    const initTx = [
      {
        date: today,
        ref: `ADV-${Math.floor(1000 + Math.random() * 9000)}`,
        desc: `Advance Payment Received for ${cases} Cases`,
        type: 'advance',
        casesSent: 0,
        amount: adv,
        remainingCases: cases,
        remainingAdvance: adv,
      },
    ];

    setCustomers([newCust, ...customers]);
    setTransactions((prev) => ({ ...prev, [newId]: initTx }));
    setFormData({ name: '', phone: '', email: '', advancePaid: '', bookedCases: '', status: 'Active' });
    setIsAddModalOpen(false);
  };

  // Open Dispatch Modal
  const openDispatchModal = (cust, e) => {
    if (e) e.stopPropagation();
    setDispatchCustomer(cust);
    setDispatchData({ casesSent: '', billAmount: '', desc: '' });
    setIsDispatchModalOpen(true);
  };

  // Process Dispatch & Calculate Deductions
  const handleProcessDispatch = (e) => {
    e.preventDefault();
    if (!dispatchCustomer) return;

    const casesToSend = parseInt(dispatchData.casesSent, 10) || 0;
    const amountToDeduct = parseFloat(dispatchData.billAmount) || 0;

    if (casesToSend <= 0 || amountToDeduct <= 0) return;

    const updatedCustomers = customers.map((c) => {
      if (c.id === dispatchCustomer.id) {
        const newDispatchedCases = c.dispatchedCases + casesToSend;
        const newRemainingCases = Math.max(0, c.bookedCases - newDispatchedCases);
        const newAdvanceBalance = Math.max(0, c.advanceBalance - amountToDeduct);
        const newStatus = newRemainingCases === 0 ? 'Completed' : c.status;

        return {
          ...c,
          dispatchedCases: newDispatchedCases,
          remainingCases: newRemainingCases,
          advanceBalance: newAdvanceBalance,
          status: newStatus,
        };
      }
      return c;
    });

    const updatedCust = updatedCustomers.find((c) => c.id === dispatchCustomer.id);
    const today = new Date().toISOString().split('T')[0];

    const newDispatchTx = {
      date: today,
      ref: `DSP-${Math.floor(1000 + Math.random() * 9000)}`,
      desc: dispatchData.desc || `Dispatched ${casesToSend} Cases of Crackers`,
      type: 'dispatch',
      casesSent: casesToSend,
      amount: amountToDeduct,
      remainingCases: updatedCust.remainingCases,
      remainingAdvance: updatedCust.advanceBalance,
    };

    setCustomers(updatedCustomers);
    setTransactions((prev) => ({
      ...prev,
      [dispatchCustomer.id]: [newDispatchTx, ...(prev[dispatchCustomer.id] || [])],
    }));

    if (selectedCustomer?.id === dispatchCustomer.id) {
      setSelectedCustomer(updatedCust);
    }

    setIsDispatchModalOpen(false);
    setDispatchCustomer(null);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this customer record?')) {
      setCustomers(customers.filter((c) => c.id !== id));
      if (selectedCustomer?.id === id) setSelectedCustomer(null);
    }
  };

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalAdvanceCollected = customers.reduce((acc, c) => acc + c.advancePaid, 0);
  const totalRemainingAdvance = customers.reduce((acc, c) => acc + c.advanceBalance, 0);
  const totalBookedCases = customers.reduce((acc, c) => acc + c.bookedCases, 0);
  const totalDispatchedCases = customers.reduce((acc, c) => acc + c.dispatchedCases, 0);
  const totalRemainingCases = customers.reduce((acc, c) => acc + c.remainingCases, 0);

  const currentCustomerTxList = selectedCustomer ? transactions[selectedCustomer.id] || [] : [];

  return (
    <div>
      {/* ── Stats Row tailored for Crackers Advance & Cases ── */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
          <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-2">Total Advance Collected</p>
          <p className="text-2xl font-bold text-gray-900 leading-tight">₹{totalAdvanceCollected.toLocaleString('en-IN')}</p>
          <p className="text-xs text-green-600 mt-1 font-medium">₹{totalRemainingAdvance.toLocaleString('en-IN')} advance balance remaining</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
          <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-2">Total Cases Booked</p>
          <p className="text-2xl font-bold text-blue-600 leading-tight">{totalBookedCases} Cases</p>
          <p className="text-xs text-gray-400 mt-1">Across all registered customers</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
          <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-2">Cases Dispatched</p>
          <p className="text-2xl font-bold text-emerald-600 leading-tight">{totalDispatchedCases} Cases</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">Successfully delivered</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
          <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-2">Cases Pending Dispatch</p>
          <p className="text-2xl font-bold text-amber-500 leading-tight">{totalRemainingCases} Cases</p>
          <p className="text-xs text-amber-600 mt-1 font-medium">To be delivered</p>
        </div>
      </div>

      {/* ── Table & Controls ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-gray-900 text-[15px]">Customers & Case Advance Ledger</h3>
            <p className="text-xs text-gray-400">Click any customer row to view dispatch entries & remaining balance details</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search customer or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-56 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-1 py-1">
              {['All', 'Active', 'Completed'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    filterStatus === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm shadow-blue-200 cursor-pointer"
            >
              <Plus size={15} />
              Add Customer & Advance
            </button>
          </div>
        </div>

        {/* ── Customers Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3.5 px-4">#</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3.5 px-4">Customer Name</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3.5 px-4">Advance Paid</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3.5 px-4">Remaining Advance</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3.5 px-4">Booked Cases</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3.5 px-4">Dispatched / Remaining</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3.5 px-4">Status</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3.5 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, idx) => {
                const casePercent = Math.round((c.dispatchedCases / (c.bookedCases || 1)) * 100);
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelectedCustomer(c)}
                    className="border-b border-gray-50 hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-4 text-sm text-gray-400">{idx + 1}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold group-hover:scale-105 transition-transform">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 group-hover:underline transition-colors">
                            {c.name}
                          </p>
                          <p className="text-[11px] text-gray-400">{c.phone} • {c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                      ₹{c.advancePaid.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-sm font-bold ${c.advanceBalance > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                        ₹{c.advanceBalance.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-blue-600">
                      {c.bookedCases} Cases
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-36">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-semibold text-gray-800">{c.dispatchedCases} Sent</span>
                          <span className="text-amber-600 font-medium">{c.remainingCases} Left</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${Math.min(casePercent, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${
                        c.status === 'Active' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => openDispatchModal(c, e)}
                          title="Dispatch Cases to Customer"
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
                        >
                          <Send size={13} />
                          Dispatch
                        </button>
                        <button
                          onClick={() => setSelectedCustomer(c)}
                          title="View Ledger & History"
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(c.id, e)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-400 text-sm">
                    No customers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Customer Profile & Transaction Ledger Modal ── */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Crackers Dispatch & Advance Ledger - ${selectedCustomer.name}`}
          width="max-w-3xl"
        >
          <div className="space-y-6">
            {/* Header info banner */}
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl font-bold text-amber-300 border border-white/10">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">{selectedCustomer.name}</h4>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-300">
                      <span><Phone size={13} className="inline text-blue-400 mr-1" /> {selectedCustomer.phone}</span>
                      <span><Calendar size={13} className="inline text-blue-400 mr-1" /> Booking Date: {selectedCustomer.joined}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => openDispatchModal(selectedCustomer)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <Send size={14} /> Dispatch Products
                </button>
              </div>

              {/* Advance & Cases Deduction Summary Grid */}
              <div className="grid grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 relative z-10">
                <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Advance Paid</p>
                  <p className="text-base font-bold text-white mt-0.5">₹{selectedCustomer.advancePaid.toLocaleString('en-IN')}</p>
                </div>

                <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Remaining Advance</p>
                  <p className="text-base font-bold text-emerald-400 mt-0.5">₹{selectedCustomer.advanceBalance.toLocaleString('en-IN')}</p>
                </div>

                <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Booked Cases</p>
                  <p className="text-base font-bold text-blue-300 mt-0.5">{selectedCustomer.bookedCases} Cases</p>
                </div>

                <div className="bg-white/5 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Cases Pending</p>
                  <p className="text-base font-bold text-amber-400 mt-0.5">{selectedCustomer.remainingCases} Cases Left</p>
                </div>
              </div>
            </div>

            {/* Ledger Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                  <Boxes size={18} className="text-blue-600" />
                  Dispatch & Advance History
                </h4>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-3 font-semibold text-gray-500 uppercase">Date</th>
                      <th className="py-3 px-3 font-semibold text-gray-500 uppercase">Ref No.</th>
                      <th className="py-3 px-3 font-semibold text-gray-500 uppercase">Details</th>
                      <th className="py-3 px-3 font-semibold text-gray-500 uppercase">Cases Sent</th>
                      <th className="py-3 px-3 font-semibold text-gray-500 uppercase">Bill Amount</th>
                      <th className="py-3 px-3 font-semibold text-gray-500 uppercase">Remaining Advance</th>
                      <th className="py-3 px-3 font-semibold text-gray-500 uppercase">Remaining Cases</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentCustomerTxList.map((tx, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3 font-medium text-gray-600">{tx.date}</td>
                        <td className="py-3 px-3 font-mono font-semibold text-gray-900">{tx.ref}</td>
                        <td className="py-3 px-3 font-medium text-gray-800">{tx.desc}</td>
                        <td className="py-3 px-3">
                          {tx.type === 'dispatch' ? (
                            <span className="font-bold text-blue-600">−{tx.casesSent} Cases</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`font-bold ${tx.type === 'dispatch' ? 'text-red-500' : 'text-green-600'}`}>
                            {tx.type === 'dispatch' ? '−' : '+' }₹{tx.amount.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-emerald-600">₹{tx.remainingAdvance.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-3 font-semibold text-amber-600">{tx.remainingCases} Cases</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Dispatch Products Modal ── */}
      {isDispatchModalOpen && dispatchCustomer && (
        <Modal
          isOpen={isDispatchModalOpen}
          onClose={() => setIsDispatchModalOpen(false)}
          title={`Dispatch Crackers to ${dispatchCustomer.name}`}
        >
          <form onSubmit={handleProcessDispatch} className="space-y-4">
            {/* Customer Summary Bar */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-blue-900">{dispatchCustomer.name}</p>
                <p className="text-blue-700">Remaining Cases: <strong>{dispatchCustomer.remainingCases} Cases</strong></p>
              </div>
              <div className="text-right">
                <p className="text-blue-700">Advance Balance: <strong>₹{dispatchCustomer.advanceBalance.toLocaleString('en-IN')}</strong></p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Cases to Dispatch <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="casesSent"
                  required
                  min="1"
                  max={dispatchCustomer.remainingCases || 9999}
                  placeholder="e.g. 10"
                  value={dispatchData.casesSent}
                  onChange={handleDispatchInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Calculated Bill Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="billAmount"
                  required
                  placeholder="e.g. 12000"
                  value={dispatchData.billAmount}
                  onChange={handleDispatchInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Dispatch Description / Products Sent
              </label>
              <input
                type="text"
                name="desc"
                placeholder="e.g. 10 Cases of Sparklers & Ground Chakkars"
                value={dispatchData.desc}
                onChange={handleDispatchInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsDispatchModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 text-white font-semibold text-sm rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition-all cursor-pointer"
              >
                Confirm Dispatch & Deduct
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Add Customer & Advance Modal ── */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="New Crackers Customer & Advance Order"
        >
          <form onSubmit={handleAddCustomer} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Customer Name / Shop Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Sri Sai Crackers Store"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. info@shop.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Advance Amount Paid (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="advancePaid"
                  required
                  placeholder="e.g. 50000"
                  value={formData.advancePaid}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Total Cases Booked <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="bookedCases"
                  required
                  placeholder="e.g. 50"
                  value={formData.bookedCases}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all cursor-pointer"
              >
                Save & Book Order
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Customers;
