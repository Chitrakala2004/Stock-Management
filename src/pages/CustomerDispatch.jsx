import React, { useState, useEffect } from 'react';
import { useStock } from '../context/StockContext';
import {
  Truck,
  Package,
  Calendar,
  Search,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  FileText,
  Printer,
  ChevronDown,
  Building2,
  Boxes,
  Percent,
  Clock,
  Eye,
  RotateCcw,
} from 'lucide-react';
import Modal from '../components/Modal';

const CustomerDispatch = () => {
  const stockContext = useStock();
  const {
    customers = [],
    purchases = [],
    dispatches = [],
    addDispatch,
    getCustomerTotalAdvance,
    getCustomerRemainingAdvance,
  } = stockContext || {};

  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [dispatchDate, setDispatchDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [searchFilter, setSearchFilter] = useState('');

  // Selected customer object
  const activeCustomer =
    customers.find((c) => c.id === selectedCustomerId || c.customId === selectedCustomerId) ||
    customers[0];

  useEffect(() => {
    if (!selectedCustomerId && customers.length > 0) {
      setSelectedCustomerId(customers[0].id || customers[0].customId);
    }
  }, [customers, selectedCustomerId]);

  // Extract customer saved products from confirmed purchases
  const customerPurchases = purchases.filter(
    (p) =>
      p.customerId === (activeCustomer?.customId || activeCustomer?.id) ||
      p.customer === activeCustomer?.name ||
      p.customerName === activeCustomer?.name
  );

  // Aggregate customer items with totalCase, dispatchedCase, pendingCase
  const [customerProducts, setCustomerProducts] = useState([]);

  useEffect(() => {
    const aggregated = [];
    customerPurchases.forEach((pur) => {
      (pur.items || []).forEach((item, idx) => {
        const totalCase = parseFloat(item.caseRequired || item.totalCases || item.caseCount) || 0;
        const previouslyDispatched = parseFloat(item.dispatchedCases || item.caseOut) || 0;
        const initialPending = Math.max(0, totalCase - previouslyDispatched);

        aggregated.push({
          purchaseId: pur.id || pur.purchaseId,
          itemId: item.productId || `${pur.id || pur.purchaseId}-${idx + 1}`,
          brand: item.brand || pur.companyName || 'SIMBA FW',
          productName: item.productName || item.particular || 'Product',
          totalCase: totalCase,
          piecesPerCase: parseFloat(item.pktUnits || item.piecesPerCase) || 1,
          totalPieces: (totalCase * (parseFloat(item.pktUnits || item.piecesPerCase) || 1)),
          ratePerPiece: parseFloat(item.rate || item.ratePerPiece) || 0,
          totalProductAmount: parseFloat(item.amount || item.totalProductAmount) || 0,
          previouslyDispatched: previouslyDispatched,
          pendingCase: initialPending,
          dispatchCase: 0, // Current batch dispatch input
        });
      });
    });
    setCustomerProducts(aggregated);
  }, [selectedCustomerId, purchases]);

  // Handle Dispatch Case input change
  const handleDispatchCaseChange = (index, value) => {
    const entered = value === '' ? '' : Math.max(0, parseFloat(value) || 0);
    setCustomerProducts((prev) => {
      const updated = [...prev];
      const item = { ...updated[index] };
      const maxAllowed = item.totalCase - item.previouslyDispatched;

      // Cap at available pending case
      const validVal = entered === '' ? '' : Math.min(entered, maxAllowed);
      item.dispatchCase = validVal;
      item.pendingCase = maxAllowed - (parseFloat(validVal) || 0);

      updated[index] = item;
      return updated;
    });
  };

  // Calculations for Dispatched Products
  const dispatchedItems = customerProducts
    .filter((p) => (parseFloat(p.dispatchCase) || 0) > 0)
    .map((p) => {
      const dCase = parseFloat(p.dispatchCase) || 0;
      const dPieces = dCase * p.piecesPerCase;
      const dAmount = dPieces * p.ratePerPiece;
      return {
        ...p,
        totalDispatchedPieces: dPieces,
        dispatchedProductAmount: dAmount,
      };
    });

  const subtotal = dispatchedItems.reduce(
    (sum, item) => sum + item.dispatchedProductAmount,
    0
  );

  // Discount & Packing & Tax states
  const [discountPercent, setDiscountPercent] = useState('');
  const [packingPercent, setPackingPercent] = useState('');
  const [taxAmountInput, setTaxAmountInput] = useState('');

  const discountVal = parseFloat(discountPercent) || 0;
  const discountAmount = (subtotal * discountVal) / 100;
  const amountAfterDiscount = subtotal - discountAmount;

  const packingVal = parseFloat(packingPercent) || 0;
  const netAfterDisc = Math.max(0, amountAfterDiscount);
  const packingAmount = (netAfterDisc * packingVal) / 100;

  const manualTaxAmount = parseFloat(taxAmountInput) || 0;

  const finalDispatchAmount =
    netAfterDisc + packingAmount + manualTaxAmount;

  // Advance calculations
  const originalAdvanceAmount = activeCustomer
    ? (getCustomerTotalAdvance ? getCustomerTotalAdvance(activeCustomer.id) : activeCustomer.credit) || 0
    : 0;

  const previousRemainingAdvance = activeCustomer
    ? (getCustomerRemainingAdvance ? getCustomerRemainingAdvance(activeCustomer.id) : (originalAdvanceAmount - (activeCustomer.debit || 0))) || 0
    : 0;

  const remainingAdvanceAmount = previousRemainingAdvance - finalDispatchAmount;

  // Modal & Warning states
  const [isConfirmOverdraftOpen, setIsConfirmOverdraftOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [selectedDispatchForModal, setSelectedDispatchForModal] = useState(null);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(val || 0);
  };

  // Submit Dispatch
  const handleSaveDispatch = async (confirmedOverdraft = false) => {
    if (dispatchedItems.length === 0) {
      alert('Please enter dispatch cases for at least one product.');
      return;
    }

    if (remainingAdvanceAmount < 0 && !confirmedOverdraft) {
      setIsConfirmOverdraftOpen(true);
      return;
    }

    setIsSubmitting(true);

    const dispatchId = `DSP-${Date.now().toString().slice(-6)}`;
    const payload = {
      dispatchId,
      customerId: activeCustomer?.customId || activeCustomer?.id || selectedCustomerId,
      customerName: activeCustomer?.name || 'Customer',
      customerPhone: activeCustomer?.phone || '',
      date: dispatchDate,
      items: dispatchedItems.map((item) => ({
        productId: item.itemId,
        brand: item.brand,
        productName: item.productName,
        caseRequired: item.totalCase,
        dispatchCase: parseFloat(item.dispatchCase) || 0,
        piecesPerCase: item.piecesPerCase,
        totalDispatchedPieces: item.totalDispatchedPieces,
        ratePerPiece: item.ratePerPiece,
        dispatchedProductAmount: item.dispatchedProductAmount,
        previousPendingCase: item.totalCase - item.previouslyDispatched,
        updatedPendingCase: item.pendingCase,
      })),
      subtotal,
      discount: discountAmount,
      packing: packingAmount,
      tax: manualTaxAmount,
      totalAmount: finalDispatchAmount,
      advanceAmount: previousRemainingAdvance,
      balanceAmount: remainingAdvanceAmount,
      status: remainingAdvanceAmount < 0 ? 'Balance Payable' : 'Dispatched',
    };

    try {
      if (addDispatch) {
        await addDispatch(payload);
      }
      setFeedback({
        type: 'success',
        message: `✅ Dispatch ${dispatchId} Saved Successfully!`,
        details: `${formatCurrency(finalDispatchAmount)} recorded. Remaining Advance: ${formatCurrency(remainingAdvanceAmount)}.`,
      });

      // Reset inputs & update customer products list
      setCustomerProducts((prev) =>
        prev.map((p) => {
          const matched = dispatchedItems.find((d) => d.itemId === p.itemId);
          if (matched) {
            const added = parseFloat(matched.dispatchCase) || 0;
            return {
              ...p,
              previouslyDispatched: p.previouslyDispatched + added,
              dispatchCase: 0,
              pendingCase: Math.max(0, p.totalCase - (p.previouslyDispatched + added)),
            };
          }
          return p;
        })
      );

      setDiscountPercent('');
      setPackingPercent('');
      setTaxAmountInput('');
    } catch (err) {
      console.error('Error saving dispatch:', err);
      setFeedback({
        type: 'error',
        message: 'Failed to save dispatch. Please check connection.',
      });
    } finally {
      setIsSubmitting(false);
      setIsConfirmOverdraftOpen(false);
    }
  };

  // Filtered customer dispatches history
  const customerDispatches = dispatches.filter(
    (d) =>
      d.customerId === (activeCustomer?.customId || activeCustomer?.id) ||
      d.customerName === activeCustomer?.name
  );

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
            <span className="p-2 bg-blue-600 text-white rounded-xl shadow-xs">
              <Truck size={20} />
            </span>
            Customer Dispatch & Pending Case Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage dispatch batches, auto-calculate pending cases, discounts, packing, manual tax, and advance balance deduction.
          </p>
        </div>

        {/* Customer Selector & Date */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px]">
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs appearance-none"
            >
              {customers.map((c) => (
                <option key={c.id || c.customId} value={c.id || c.customId}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <input
              type="date"
              value={dispatchDate}
              onChange={(e) => setDispatchDate(e.target.value)}
              className="pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
            />
            <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div>
            <p className="font-bold">{feedback.message}</p>
            {feedback.details && <p className="mt-0.5 opacity-90">{feedback.details}</p>}
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="font-bold text-slate-500 hover:text-slate-800"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Customer Details & Financial Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Customer Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Customer Details</p>
          <h2 className="text-base font-black text-slate-900 mt-1 truncate">
            {activeCustomer ? activeCustomer.name : 'Select Customer'}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">Phone: {activeCustomer?.phone || 'N/A'}</p>
          <p className="text-xs text-slate-500 mt-0.5 truncate">GST: {activeCustomer?.gst || 'N/A'}</p>
        </div>

        {/* Advance Balance Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            {previousRemainingAdvance < 0 ? 'Previous Pending Dues' : 'Advance Balance Status'}
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-xl font-black ${previousRemainingAdvance < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
              {previousRemainingAdvance < 0 ? `Pending: ${formatCurrency(Math.abs(previousRemainingAdvance))}` : formatCurrency(previousRemainingAdvance)}
            </span>
            <span className="text-xs font-bold text-slate-400">
              / {formatCurrency(originalAdvanceAmount)} Original
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">
            Current Dispatch Total: <strong className="text-slate-900">{formatCurrency(finalDispatchAmount)}</strong>
          </p>
        </div>

        {/* Projected Remaining Advance */}
        <div className={`rounded-2xl border p-5 shadow-xs transition-all ${
          remainingAdvanceAmount >= 0
            ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white border-emerald-600'
            : 'bg-gradient-to-br from-rose-600 to-red-700 text-white border-rose-600'
        }`}>
          <p className="text-[10px] font-extrabold uppercase tracking-wider opacity-80">
            Projected Remaining Advance
          </p>
          <p className="text-2xl font-black mt-1">
            {formatCurrency(remainingAdvanceAmount)}
          </p>
          <p className="text-[11px] opacity-90 mt-1">
            {remainingAdvanceAmount >= 0 ? 'Advance Sufficient' : '⚠️ Balance Payable (Overdraft)'}
          </p>
        </div>
      </div>

      {/* ── Section 2: Customer Product List Table ── */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Boxes size={18} className="text-blue-600" />
              Customer Purchased Products & Dispatch Allocation
            </h2>
            <p className="text-xs text-slate-500">
              Enter dispatch cases. Pending case = Total Case - Total Dispatched. Cannot exceed pending case.
            </p>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search product, brand..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
            />
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3 text-center w-12">S.NO</th>
                  <th className="py-3 px-3">CUSTOMER NAME</th>
                  <th className="py-3 px-3">BRAND</th>
                  <th className="py-3 px-4 min-w-[140px]">PRODUCT NAME</th>
                  <th className="py-3 px-3 text-center">TOTAL CASE</th>
                  <th className="py-3 px-3 text-center">PIECES / CASE</th>
                  <th className="py-3 px-3 text-center">TOTAL PIECES</th>
                  <th className="py-3 px-3 text-center">RATE / PIECE</th>
                  <th className="py-3 px-3 text-right">TOTAL PRODUCT AMT</th>
                  <th className="py-3 px-4 text-center text-blue-700 bg-blue-50/60 w-32 font-extrabold">DISPATCH CASE</th>
                  <th className="py-3 px-3 text-center w-28">PENDING CASE</th>
                  <th className="py-3 px-3 text-center w-20">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {customerProducts
                  .filter((p) =>
                    (p.productName || '').toLowerCase().includes(searchFilter.toLowerCase()) ||
                    (p.brand || '').toLowerCase().includes(searchFilter.toLowerCase())
                  )
                  .map((row, idx) => (
                    <tr key={row.itemId || idx} className="hover:bg-blue-50/20 transition-colors">
                      <td className="py-3 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{activeCustomer?.name}</td>
                      <td className="py-3 px-3 font-semibold text-slate-700">{row.brand}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{row.productName}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-800">{row.totalCase}</td>
                      <td className="py-3 px-3 text-center text-slate-600">{row.piecesPerCase}</td>
                      <td className="py-3 px-3 text-center text-slate-600 font-semibold">{row.totalPieces}</td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-800">₹{row.ratePerPiece.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">{formatCurrency(row.totalProductAmount)}</td>
                      
                      {/* Dispatch Case (Editable) */}
                      <td className="py-2 px-3 text-center bg-blue-50/30">
                        <input
                          type="number"
                          min="0"
                          max={row.totalCase - row.previouslyDispatched}
                          value={row.dispatchCase !== undefined ? row.dispatchCase : ''}
                          onChange={(e) => handleDispatchCaseChange(idx, e.target.value)}
                          placeholder="0"
                          disabled={row.totalCase - row.previouslyDispatched <= 0}
                          className="w-20 px-2 py-1 text-center font-bold text-xs text-blue-700 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                        />
                      </td>

                      {/* Pending Case Badge */}
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-black ${
                          row.pendingCase === 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {row.pendingCase} Cases
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        {row.pendingCase === 0 ? (
                          <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Completed</span>
                        ) : row.previouslyDispatched > 0 ? (
                          <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Partial</span>
                        ) : (
                          <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Pending</span>
                        )}
                      </td>
                    </tr>
                  ))}

                {customerProducts.length === 0 && (
                  <tr>
                    <td colSpan="12" className="py-8 text-center text-slate-400 font-medium">
                      No customer products found for {activeCustomer?.name}. Please create a customer purchase in Performo first.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Section 3: Dispatched Product Summary & Calculations ── */}
      {dispatchedItems.length > 0 && (
        <section className="bg-white rounded-2xl border border-blue-200/80 p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Receipt size={18} className="text-blue-600" />
              Current Dispatch Batch Summary & Final Total Calculation
            </h2>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
              {dispatchedItems.length} Products Dispatched
            </span>
          </div>

          {/* Dispatched Products Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">BRAND</th>
                  <th className="py-3 px-4">PRODUCT NAME</th>
                  <th className="py-3 px-3 text-center">DISPATCH CASE</th>
                  <th className="py-3 px-3 text-center">PIECES / CASE</th>
                  <th className="py-3 px-3 text-center">TOTAL DISPATCHED PIECES</th>
                  <th className="py-3 px-3 text-center">RATE / PIECE</th>
                  <th className="py-3 px-4 text-right">DISPATCHED PRODUCT AMOUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {dispatchedItems.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-700">{item.brand}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{item.productName}</td>
                    <td className="py-2.5 px-3 text-center font-black text-blue-700">{item.dispatchCase}</td>
                    <td className="py-2.5 px-3 text-center text-slate-600">{item.piecesPerCase}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-800">{item.totalDispatchedPieces}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-slate-800">₹{item.ratePerPiece.toFixed(2)}</td>
                    <td className="py-2.5 px-4 text-right font-black text-slate-900">{formatCurrency(item.dispatchedProductAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Form Controls Grid: Discount, Packing, Manual Tax, and Final Total */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
            {/* Input Adjustments (8 cols) */}
            <div className="md:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Discount % */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Discount (%)</span>
                    <Percent size={12} className="text-slate-400" />
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="0"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                  <p className="text-[11px] text-rose-600 font-semibold mt-1">
                    - {formatCurrency(discountAmount)}
                  </p>
                </div>

                {/* Packing % */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Packing (%)</span>
                    <Percent size={12} className="text-slate-400" />
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    placeholder="0"
                    value={packingPercent}
                    onChange={(e) => setPackingPercent(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                  <p className="text-[11px] text-slate-700 font-semibold mt-1">
                    + {formatCurrency(packingAmount)}
                  </p>
                </div>

                {/* Manual Tax Amount */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tax Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={taxAmountInput}
                    onChange={(e) => setTaxAmountInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                  />
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    Manual entry (₹0 if no tax)
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSaveDispatch(false)}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm rounded-xl transition-all shadow-md shadow-blue-600/20 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Truck size={18} />
                  {isSubmitting ? 'Saving Dispatch...' : 'Save & Confirm Customer Dispatch'}
                </button>
              </div>
            </div>

            {/* Financial Summary Highlight Card (5 cols) */}
            <div className="md:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-md flex flex-col justify-between space-y-4">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400">
                  Final Dispatch Total Summary
                </p>
                <div className="space-y-1.5 text-xs text-slate-300 mt-3">
                  <div className="flex justify-between">
                    <span>Dispatched Product Subtotal:</span>
                    <strong className="text-white">{formatCurrency(subtotal)}</strong>
                  </div>
                  <div className="flex justify-between text-rose-300">
                    <span>Discount Amount (-):</span>
                    <strong>- {formatCurrency(discountAmount)}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Amount After Discount:</span>
                    <strong>{formatCurrency(amountAfterDiscount)}</strong>
                  </div>
                  <div className="flex justify-between text-indigo-300">
                    <span>Packing Amount (+):</span>
                    <strong>+ {formatCurrency(packingAmount)}</strong>
                  </div>
                  <div className="flex justify-between text-amber-300">
                    <span>Manual Tax (+):</span>
                    <strong>+ {formatCurrency(manualTaxAmount)}</strong>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-700/80 pt-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold text-slate-200">Final Dispatch Amount:</span>
                  <span className="text-2xl font-black text-emerald-400">
                    {formatCurrency(finalDispatchAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>Advance Deducted: {formatCurrency(finalDispatchAmount)}</span>
                  <span>Balance Advance: {formatCurrency(remainingAdvanceAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Section 10: Customer Dispatch History ── */}
      <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock size={18} className="text-blue-600" />
              Customer Dispatch History
            </h2>
            <p className="text-xs text-slate-500">
              Permanent record of all previous dispatches for {activeCustomer?.name}.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {customerDispatches.length} Records
          </span>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">DISPATCH ID</th>
                  <th className="py-3 px-3">DATE</th>
                  <th className="py-3 px-4">PRODUCTS</th>
                  <th className="py-3 px-3 text-right">SUBTOTAL</th>
                  <th className="py-3 px-3 text-right">DISCOUNT</th>
                  <th className="py-3 px-3 text-right">FINAL TOTAL</th>
                  <th className="py-3 px-3 text-right">ADVANCE BAL</th>
                  <th className="py-3 px-3 text-center">STATUS</th>
                  <th className="py-3 px-3 text-center">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {customerDispatches.map((disp) => (
                  <tr key={disp.dispatchId || disp.id || disp._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-blue-700">{disp.dispatchId}</td>
                    <td className="py-3 px-3 font-medium text-slate-600">{disp.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {(disp.items || []).map((it) => `${it.productName} (${it.dispatchCase} cs)`).join(', ') || '-'}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-700">{formatCurrency(disp.subtotal)}</td>
                    <td className="py-3 px-3 text-right text-rose-600 font-medium">- {formatCurrency(disp.discount)}</td>
                    <td className="py-3 px-3 text-right font-black text-slate-900">{formatCurrency(disp.totalAmount)}</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-700">{formatCurrency(disp.balanceAmount)}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        disp.status === 'Balance Payable'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {disp.status || 'Dispatched'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => setSelectedDispatchForModal(disp)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="View Dispatch Slip"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}

                {customerDispatches.length === 0 && (
                  <tr>
                    <td colSpan="9" className="py-8 text-center text-slate-400 font-medium">
                      No dispatches recorded yet for this customer.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Overdraft Warning Modal ── */}
      {isConfirmOverdraftOpen && (
        <Modal
          isOpen={isConfirmOverdraftOpen}
          onClose={() => setIsConfirmOverdraftOpen(false)}
          title="⚠️ Advance Balance Overdraft Confirmation"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900">
              <p className="font-bold text-sm">Dispatch Amount Exceeds Customer Advance!</p>
              <p className="mt-1">
                The current dispatch amount of <strong>{formatCurrency(finalDispatchAmount)}</strong> exceeds the available advance balance of <strong>{formatCurrency(previousRemainingAdvance)}</strong>.
              </p>
              <p className="mt-2 font-semibold">
                Excess Amount Payable by Customer: <span className="text-rose-700 font-black">{formatCurrency(Math.abs(remainingAdvanceAmount))}</span>.
              </p>
            </div>
            <p className="text-slate-600">
              Do you want to confirm this dispatch and record the remaining balance as payable debit for <strong>{activeCustomer?.name}</strong>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmOverdraftOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveDispatch(true)}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm"
              >
                Confirm & Record Payable
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Dispatch Slip Modal ── */}
      {selectedDispatchForModal && (
        <Modal
          isOpen={!!selectedDispatchForModal}
          onClose={() => setSelectedDispatchForModal(null)}
          title={`Dispatch Slip — ${selectedDispatchForModal.dispatchId}`}
        >
          <div className="space-y-4 text-xs">
            <div className="flex justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Customer: {selectedDispatchForModal.customerName}</h3>
                <p className="text-slate-500">Date: {selectedDispatchForModal.date}</p>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-blue-700">{selectedDispatchForModal.dispatchId}</span>
                <p className="text-emerald-700 font-bold">{selectedDispatchForModal.status}</p>
              </div>
            </div>

            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-2">Product</th>
                  <th className="p-2 text-center">Cases</th>
                  <th className="p-2 text-center">Rate</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(selectedDispatchForModal.items || []).map((it, idx) => (
                  <tr key={idx}>
                    <td className="p-2 font-medium text-slate-900">{it.productName} ({it.brand})</td>
                    <td className="p-2 text-center font-bold text-blue-700">{it.dispatchCase}</td>
                    <td className="p-2 text-center">₹{it.ratePerPiece}</td>
                    <td className="p-2 text-right font-bold">{formatCurrency(it.dispatchedProductAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="bg-slate-50 p-3 rounded-xl space-y-1 text-slate-700 font-medium">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(selectedDispatchForModal.subtotal)}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Discount:</span>
                <span>- {formatCurrency(selectedDispatchForModal.discount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Packing:</span>
                <span>+ {formatCurrency(selectedDispatchForModal.packing)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>+ {formatCurrency(selectedDispatchForModal.tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-1 mt-1">
                <span>Final Dispatch Amount:</span>
                <span className="text-blue-600">{formatCurrency(selectedDispatchForModal.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-emerald-700 pt-1">
                <span>Remaining Customer Advance:</span>
                <span>{formatCurrency(selectedDispatchForModal.balanceAmount)}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl flex items-center gap-1.5 text-xs shadow-xs"
              >
                <Printer size={14} /> Print Slip
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CustomerDispatch;
