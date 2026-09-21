import { useState } from 'react';
import {
  Search,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Send,
  Wallet,
} from 'lucide-react';

const allTransactions = [
  { id: 'DSP-2024-095', date: '2024-09-15', customer: 'Priya Enterprises (Deepavali Mart)', desc: 'Dispatched 60 Cases (Family Gift Packs & Fountains)', type: 'dispatch', amount: '₹60,000.00', cases: 60, method: 'Transport Dispatch', ref: 'DSP-95' },
  { id: 'DSP-2024-089', date: '2024-09-14', customer: 'Rajesh Kumar (Sri Sai Traders)', desc: 'Dispatched 10 Cases (Sparklers & Ground Chakkars)', type: 'dispatch', amount: '₹12,000.00', cases: 10, method: 'Lorry Freight', ref: 'DSP-89' },
  { id: 'DSP-2024-072', date: '2024-09-12', customer: 'Sunita Sharma (Sharma Crackers)', desc: 'Dispatched 30 Cases (Flower Pots & Gift Boxes)', type: 'dispatch', amount: '₹25,000.00', cases: 30, method: 'Tempo Transport', ref: 'DSP-72' },
  { id: 'DSP-2024-065', date: '2024-09-11', customer: 'Meena Stores', desc: 'Dispatched 25 Cases (Mixed Crackers Carton)', type: 'dispatch', amount: '₹25,000.00', cases: 25, method: 'Lorry Freight', ref: 'DSP-65' },
  { id: 'DSP-2024-045', date: '2024-09-10', customer: 'Rajesh Kumar (Sri Sai Traders)', desc: 'Dispatched 18 Cases (Rockets & Multi-shot Aerial)', type: 'dispatch', amount: '₹16,000.00', cases: 18, method: 'Tempo Transport', ref: 'DSP-45' },
  { id: 'DSP-2024-031', date: '2024-09-05', customer: 'Sunita Sharma (Sharma Crackers)', desc: 'Dispatched 50 Cases (Sparklers & Atom Bombs)', type: 'dispatch', amount: '₹40,000.00', cases: 50, method: 'Lorry Freight', ref: 'DSP-31' },
  { id: 'ADV-2024-022', date: '2024-09-01', customer: 'Priya Enterprises (Deepavali Mart)', desc: 'Advance Booking Received (150 Cases Booked)', type: 'advance', amount: '₹1,50,000.00', cases: 0, method: 'Bank Transfer', ref: 'NEFT-93847' },
  { id: 'ADV-2024-015', date: '2024-08-25', customer: 'Meena Stores', desc: 'Advance Booking Received (80 Cases Booked)', type: 'advance', amount: '₹75,000.00', cases: 0, method: 'Cash', ref: 'ADV-15' },
  { id: 'ADV-2024-008', date: '2024-08-20', customer: 'Sunita Sharma (Sharma Crackers)', desc: 'Advance Booking Received (120 Cases Booked)', type: 'advance', amount: '₹1,00,000.00', cases: 0, method: 'NEFT', ref: 'NEFT-82736' },
  { id: 'ADV-2024-012', date: '2024-08-15', customer: 'Rajesh Kumar (Sri Sai Traders)', desc: 'Advance Booking Received (50 Cases Booked)', type: 'advance', amount: '₹50,000.00', cases: 0, method: 'UPI', ref: 'UPI-76253' },
];

const Transactions = () => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');

  const filtered = allTransactions.filter((t) => {
    const matchSearch =
      t.customer.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.ref.toLowerCase().includes(search.toLowerCase());
    const matchType =
      typeFilter === 'All' ||
      (typeFilter === 'Dispatch' && t.type === 'dispatch') ||
      (typeFilter === 'Advance' && t.type === 'advance');
    const matchMethod = methodFilter === 'All' || t.method === methodFilter;
    return matchSearch && matchType && matchMethod;
  });

  const totalAdvanceReceived = '₹3,75,000.00';
  const totalDispatchedValue = '₹1,78,000.00';
  const totalCasesSent = '193 Cases';

  return (
    <div>
      {/* Summary Strip */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          {/* Total Transactions */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
              <Receipt size={18} className="text-slate-600" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total Entries</p>
              <p className="text-lg font-bold text-gray-900">{allTransactions.length}</p>
            </div>
          </div>

          {/* Advance Received */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
              <Wallet size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total Advance Received</p>
              <p className="text-lg font-bold text-green-600">{totalAdvanceReceived}</p>
            </div>
          </div>

          {/* Total Dispatched Value */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
              <Send size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Dispatched Value</p>
              <p className="text-lg font-bold text-blue-600">{totalDispatchedValue}</p>
            </div>
          </div>

          {/* Cases Delivered */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
              <Filter size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total Cases Sent</p>
              <p className="text-lg font-bold text-purple-600">{totalCasesSent}</p>
            </div>
          </div>
        </div>

        <button className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm shadow-blue-200 cursor-pointer w-full lg:w-auto shrink-0">
          <Download size={15} />
          Export Ledger Report
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer, description, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Date Range */}
        <div className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
          <Calendar size={14} className="text-gray-400" />
          <span>Aug 15 – Sep 15, 2024</span>
        </div>

        {/* Type Filter */}
        <div className="flex items-center justify-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-1 py-1">
          {['All', 'Dispatch', 'Advance'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                typeFilter === t
                  ? t === 'Dispatch'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : t === 'Advance'
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-5">Entry ID</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">Date</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">Customer</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">Dispatch / Payment Details</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">Cases Sent</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">Method</th>
                <th className="text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-5">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors group">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        t.type === 'advance' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {t.type === 'advance' ? <Wallet size={15} /> : <Send size={15} />}
                      </div>
                      <span className="text-xs font-mono font-semibold text-gray-700">{t.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{t.date}</td>
                  <td className="py-4 px-4 text-sm font-semibold text-gray-900">{t.customer}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{t.desc}</td>
                  <td className="py-4 px-4 text-sm font-semibold">
                    {t.type === 'dispatch' ? (
                      <span className="text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">−{t.cases} Cases</span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[11px] font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">{t.method}</span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <span className={`text-sm font-bold ${t.type === 'advance' ? 'text-green-600' : 'text-red-500'}`}>
                      {t.type === 'advance' ? '+' : '−'}{t.amount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
