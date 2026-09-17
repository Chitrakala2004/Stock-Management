import React, { useState, useEffect } from 'react';
import { useStock } from '../context/StockContext';
import {
  User,
  Package,
  Calculator,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Wallet,
  Phone,
  MapPin,
  Calendar,
  Pencil,
  ChevronDown,
  Building2,
  Check,
  X,
  FileText,
} from 'lucide-react';
import Modal from '../components/Modal';

const particularOptions = [
  '20 SKY SHOT',
  '10cm Electric Sparklers',
  'Ground Chakkar Deluxe',
  'Special Flower Pots',
  '30-Shot Multi Color Aerial',
  'Hydro Atom Bomb',
  'Whistling Rockets',
  'Deepavali Gift Box',
];

const defaultProductDetails = {
  '20 SKY SHOT': { rate: 2400, pktUnits: 10 },
  '10cm Electric Sparklers': { rate: 1200, pktUnits: 10 },
  'Ground Chakkar Deluxe': { rate: 1800, pktUnits: 20 },
  'Special Flower Pots': { rate: 1500, pktUnits: 10 },
  '30-Shot Multi Color Aerial': { rate: 4500, pktUnits: 1 },
  'Hydro Atom Bomb': { rate: 1600, pktUnits: 10 },
  'Whistling Rockets': { rate: 2100, pktUnits: 25 },
  'Deepavali Gift Box': { rate: 3800, pktUnits: 1 },
};

const companyOptions = [
  'SIMBA FW',
  'STANDARD FIREWORKS',
  'AJANTA BRAND',
  'AYYAN FIREWORKS',
  'SRI KALISWARI FIREWORKS',
];

const PurchaseEntry = () => {
  const stockContext = useStock();
  const {
    customers: contextCustomers = [],
    purchases: contextPurchases = [],
    advancePayments: contextAdvances = [],
    stockTransactions: contextTransactions = [],
    products: contextProducts = [],
    getCustomerRemainingAdvance = () => 0,
    getCustomerTotalAdvance = () => 0,
    addCustomer,
    addAdvancePayment,
    selectedCustomerIdForStatement,
    targetPerformoTab,
    clearCustomerStatementNav,
  } = stockContext || {};

  // Sync Live Data from Context (MongoDB)
  const [customersList, setCustomersList] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [performoBills, setPerformoBills] = useState([]);
  const [creditEntries, setCreditEntries] = useState([]);

  useEffect(() => {
    if (contextCustomers && contextCustomers.length > 0) {
      const mapped = contextCustomers.map((c) => ({
        id: c.customId || c.id || c._id,
        mongoId: c._id || c.id,
        name: c.name,
        phone: c.phone || '9876543210',
        gst: c.gst || 'N/A',
        address: c.address || 'Delivery Address Not Specified',
        debit: c.debit || stockContext?.getCustomerTotalPurchases?.(c.id) || 0,
        credit: c.credit || stockContext?.getCustomerTotalAdvance?.(c.id) || 0,
      }));
      setCustomersList(mapped);

      // Ensure selectedCustomerId is pointing to an existing customer in the live list
      setSelectedCustomerId((prevId) => {
        if (prevId && mapped.some((m) => m.id === prevId)) {
          return prevId;
        }
        return mapped[0]?.id || '';
      });
    } else {
      setCustomersList([]);
    }
  }, [contextCustomers]);

  useEffect(() => {
    if (contextPurchases && contextPurchases.length > 0) {
      setPerformoBills(
        contextPurchases.map((p) => ({
          ...p,
          id: p.id || p._id,
          customer: p.customer || p.customerName,
        }))
      );
    }
  }, [contextPurchases]);

  useEffect(() => {
    if (contextAdvances && contextAdvances.length > 0) {
      setCreditEntries(
        contextAdvances.map((a) => ({
          ...a,
          id: a.id || a._id,
          creditAmt: a.creditAmt || a.amount,
        }))
      );
    }
  }, [contextAdvances]);

  useEffect(() => {
    if (contextTransactions && contextTransactions.length > 0) {
      setTransactions(
        contextTransactions.map((t) => ({
          ...t,
          id: t.id || t._id,
        }))
      );
    }
  }, [contextTransactions]);

  // Active Sub-Tab State inside Performo Page (Default: Select Customer Account)
  const [activeTab, setActiveTab] = useState('customer');

  // Selected customer & purchase date
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    customersList[0]?.id || 'CUST-101'
  );

  // Listen for Statement navigation requests from All Performo or other pages
  useEffect(() => {
    if (selectedCustomerIdForStatement) {
      const match = customersList.find(
        (c) =>
          c.id === selectedCustomerIdForStatement ||
          c.name.toLowerCase() === selectedCustomerIdForStatement.toLowerCase() ||
          c.name.toLowerCase().includes(selectedCustomerIdForStatement.toLowerCase())
      );
      if (match) {
        setSelectedCustomerId(match.id);
      }
      if (targetPerformoTab) {
        setActiveTab(targetPerformoTab);
      }
      if (clearCustomerStatementNav) {
        clearCustomerStatementNav();
      }
    }
  }, [selectedCustomerIdForStatement, targetPerformoTab, customersList, clearCustomerStatementNav]);

  const handleViewCustomerStatement = (customerNameOrId) => {
    const match = customersList.find(
      (c) =>
        c.id === customerNameOrId ||
        c.name.toLowerCase() === (customerNameOrId || '').toLowerCase() ||
        c.name.toLowerCase().includes((customerNameOrId || '').toLowerCase())
    );
    if (match) {
      setSelectedCustomerId(match.id);
    }
    setActiveTab('account');
  };
  const [purchaseDate, setPurchaseDate] = useState('2026-09-17');
  const [customerAdvanceInput, setCustomerAdvanceInput] = useState('');

  // Auto-sync customer name & advance input when selectedCustomerId or customersList changes
  useEffect(() => {
    if (selectedCustomerId && customersList.length > 0) {
      const cust = customersList.find((c) => c.id === selectedCustomerId);
      if (cust) {
        setStep2Customer(cust.name);
        const adv = getCustomerTotalAdvance(cust.id);
        setCustomerAdvanceInput(adv ? adv.toString() : '');
      }
    }
  }, [selectedCustomerId, customersList]);

  // Quick Add Customer Modal State inside Performo
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    phone: '',
    gst: '',
    address: '',
    advanceAmount: '',
  });

  const handleQuickAddCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomerForm.name.trim() || !newCustomerForm.phone.trim()) {
      alert('Please enter customer Name and Phone Number.');
      return;
    }

    const initAdv = parseFloat(newCustomerForm.advanceAmount) || 0;
    const payload = {
      name: newCustomerForm.name.trim().toUpperCase(),
      phone: newCustomerForm.phone.trim(),
      gst: newCustomerForm.gst ? newCustomerForm.gst.trim().toUpperCase() : 'N/A',
      address: newCustomerForm.address ? newCustomerForm.address.trim().toUpperCase() : 'N/A',
      credit: initAdv,
      debit: 0,
    };

    let created;
    if (addCustomer) {
      created = await addCustomer(payload);
    }

    const createdId = created?.customId || created?.id || created?._id || `CUST-${Date.now()}`;

    if (initAdv > 0 && addAdvancePayment && created) {
      await addAdvancePayment({
        customerId: createdId,
        customerName: payload.name,
        amount: initAdv,
        date: purchaseDate || new Date().toISOString().split('T')[0],
        paymentReference: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
        paymentMethod: 'Cash',
      });
    }

    setSelectedCustomerId(createdId);
    setStep2Customer(payload.name);
    setCustomerAdvanceInput(initAdv ? initAdv.toString() : '');

    setNewCustomerForm({
      name: '',
      phone: '',
      gst: '',
      address: '',
      advanceAmount: '',
    });
    setIsAddCustomerModalOpen(false);

    setFeedback({
      type: 'success',
      message: `Customer "${payload.name}" added successfully and selected!`,
    });
  };

  // Step 2 Item Entry Row State
  const [entryParticular, setEntryParticular] = useState('');
  const [entryCase, setEntryCase] = useState('');
  const [entryRate, setEntryRate] = useState('');
  const [entryPktUnits, setEntryPktUnits] = useState('');
  const [rateMode, setRateMode] = useState('case'); // 'case' | 'unit'
  const [editingRowIndex, setEditingRowIndex] = useState(null);

  // Step 2 Billing & Customer Form Controls State
  const [step2Customer, setStep2Customer] = useState('');
  const [step2CaseCount, setStep2CaseCount] = useState('0');
  const [step2Company, setStep2Company] = useState('SIMBA FW');
  const [step2Discount, setStep2Discount] = useState('');
  const [step2Transport, setStep2Transport] = useState('');
  const [step2Packing, setStep2Packing] = useState('');
  const [step2BillNo, setStep2BillNo] = useState('101');
  const [step2Tax, setStep2Tax] = useState('');
  const [step2Date, setStep2Date] = useState('2026-09-17');

  // Product Table Rows State
  const [productRows, setProductRows] = useState([]);

  // Performo / Cart Items (legacy sync)
  const [performoRefNo, setPerformoRefNo] = useState(
    `PRF-2024-${Math.floor(100 + Math.random() * 900)}`
  );

  // Add Credit Form State
  const [creditForm, setCreditForm] = useState({
    customerName: 'SAI MOHAN MARKETING',
    companyName: 'SIMBA FW',
    amount: '',
    paymentMethod: 'UPI',
    ref: '',
    date: '2026-09-17',
    desc: '',
  });

  const handleDeletePerformoBill = (id) => {
    setPerformoBills(performoBills.filter((b) => b.id !== id));
  };

  const handleEditPerformoBill = (bill) => {
    if (!bill) return;
    setStep2BillNo(bill.billNo || '');
    setStep2Customer(bill.customer || '');
    setStep2Company(bill.companyName || 'SIMBA FW');
    setStep2Date(bill.date || '2026-09-17');
    setStep2Discount(bill.discount ? bill.discount.toString() : '');
    setStep2Transport(bill.transport ? bill.transport.toString() : '');
    setStep2Packing(bill.packing ? bill.packing.toString() : '');
    setStep2Tax(bill.tax ? bill.tax.toString() : '');
    setActiveTab('product');
    setFeedback({
      type: 'success',
      message: `Loaded Bill #${bill.billNo} into Product Entry for editing.`,
    });
  };

  const handleDeleteCreditEntry = (id) => {
    setCreditEntries(creditEntries.filter((c) => c.id !== id));
  };

  const handleEditCreditEntry = (crd) => {
    if (!crd) return;
    setCreditForm({
      customerName: crd.customerName || '',
      companyName: crd.companyName || '',
      amount: crd.creditAmt ? crd.creditAmt.toString() : '',
      paymentMethod: crd.paymentMethod || 'UPI',
      ref: crd.paymentRefId || '',
      date: crd.date || '2026-09-17',
      desc: '',
    });
    setActiveTab('credit');
    setCreditFeedback({
      type: 'success',
      message: `Loaded Credit Entry for "${crd.customerName}" into form for editing.`,
    });
  };

  const handleEditTransaction = (trx) => {
    if (!trx) return;
    setStep2Company(trx.companyName || 'SIMBA FW');
    setStep2Date(trx.date || '2026-09-17');
    setActiveTab('product');
    setFeedback({
      type: 'success',
      message: `Loaded Transaction for "${trx.customerName || 'Customer'}" into Product Entry for editing.`,
    });
  };

  // Notifications
  const [feedback, setFeedback] = useState(null);
  const [creditFeedback, setCreditFeedback] = useState(null);

  // Auto calculation for entry row amount (Wholesale Crackers Formula)
  const casesVal = parseFloat(entryCase) || 0;
  const rateVal = parseFloat(entryRate) || 0;
  const pktUnitsVal = parseFloat(entryPktUnits) || 0;

  // Formula: Total units = Case × Pkt / Units (e.g. 5 × 10 = 50 Units)
  const totalUnitsCalculated = casesVal * (pktUnitsVal > 0 ? pktUnitsVal : 1);

  // Formula: Product amount = Total Units × Rate (e.g. 50 × ₹20 = ₹1,000.00)
  const calculatedEntryAmount = (pktUnitsVal > 0 ? totalUnitsCalculated : casesVal) * rateVal;

  // Active Customer
  const activeCustomer =
    customersList.find((c) => c.id === selectedCustomerId) ||
    customersList[0];

  const remainingAdvance = selectedCustomerId
    ? getCustomerRemainingAdvance(selectedCustomerId)
    : 0;

  // Filter transactions for active customer
  const customerTransactionsList = transactions.filter(
    (t) =>
      t.customerId === activeCustomer?.id ||
      t.customerName?.toLowerCase() === activeCustomer?.name?.toLowerCase()
  );

  // Filter Performo bills for active customer
  const customerPerformoBills = performoBills.filter(
    (b) =>
      b.customerId === activeCustomer?.id ||
      b.customer?.toLowerCase() === activeCustomer?.name?.toLowerCase()
  );

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(val || 0);
  };

  // Add or Update Product in Table
  const handleAddProductRow = (e) => {
    e.preventDefault();
    if (!entryParticular || casesVal <= 0 || rateVal <= 0) {
      setFeedback({
        type: 'error',
        message: 'Please enter valid Particular, Case count (> 0), and Rate (> 0).',
      });
      return;
    }

    const rowData = {
      particular: entryParticular,
      caseCount: casesVal,
      rate: rateVal,
      pktUnits: pktUnitsVal,
      totalUnits: totalUnitsCalculated,
      amount: calculatedEntryAmount,
      rateMode,
    };

    if (editingRowIndex !== null) {
      const updated = [...productRows];
      updated[editingRowIndex] = rowData;
      setProductRows(updated);
      setEditingRowIndex(null);
      setFeedback({
        type: 'success',
        message: `Updated product "${entryParticular}" in table.`,
      });
    } else {
      setProductRows([...productRows, rowData]);
      setFeedback({
        type: 'success',
        message: `Added "${entryParticular}" to table.`,
      });
    }

    // Reset entry inputs
    setEntryCase('');
    setEntryRate('');
    setEntryPktUnits('');
  };

  // Clear Product Entry Input Row (Cross icon action)
  const handleClearProductInput = (e) => {
    if (e) e.preventDefault();
    setEntryCase('');
    setEntryRate('');
    setEntryPktUnits('');
    setEditingRowIndex(null);
  };

  // Edit Row
  const handleEditRow = (index) => {
    const row = productRows[index];
    if (!row) return;
    setEntryParticular(row.particular);
    setEntryCase(row.caseCount.toString());
    setEntryRate(row.rate.toString());
    setEntryPktUnits(row.pktUnits ? row.pktUnits.toString() : '');
    setRateMode(row.rateMode || 'case');
    setEditingRowIndex(index);
  };

  // Delete Row
  const handleDeleteRow = (index) => {
    setProductRows(productRows.filter((_, i) => i !== index));
    if (editingRowIndex === index) {
      setEditingRowIndex(null);
      setEntryCase('');
      setEntryRate('');
      setEntryPktUnits('');
    }
  };

  // Summary Card & Dynamic Deductions Calculations
  const totalAddedCases = productRows.reduce((sum, row) => sum + (parseFloat(row.caseCount) || 0), 0);
  const subtotalAmount = productRows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);

  const initialCasesAllocated = parseFloat(step2CaseCount) || 0;
  const initialAdvanceAmt = getCustomerTotalAdvance(selectedCustomerId) || parseFloat(customerAdvanceInput) || 0;

  // Dynamic Reductions as products are added/accumulated in table
  const dynamicRemainingCases = initialCasesAllocated - totalAddedCases;
  const dynamicRemainingAdvance = initialAdvanceAmt > 0
    ? Math.max(0, initialAdvanceAmt - subtotalAmount)
    : 0;

  const discountVal = parseFloat(step2Discount) || 0;
  const transportVal = parseFloat(step2Transport) || 0;
  const packingVal = parseFloat(step2Packing) || 0;
  const taxVal = parseFloat(step2Tax) || 0;

  const discountAmount = (subtotalAmount * discountVal) / 100;
  const packingAmount = (subtotalAmount * packingVal) / 100;
  const taxableBase = subtotalAmount - discountAmount + packingAmount;
  const taxAmount = (taxableBase * taxVal) / 100;

  const grandTotalAmount =
    subtotalAmount - discountAmount + packingAmount + transportVal + taxAmount;

  // Create Performo Invoice
  const handleCreateInvoice = (e) => {
    if (e && e.preventDefault) e.preventDefault();

    let currentBillNo = step2BillNo.trim();
    if (!currentBillNo) {
      currentBillNo = (101 + performoBills.length).toString();
      setStep2BillNo(currentBillNo);
    }

    if (productRows.length === 0) {
      setFeedback({
        type: 'error',
        message: 'Product table is empty. Add at least one product before creating.',
      });
      return;
    }

    const targetCustomerName =
      step2Customer && step2Customer !== 'SAI MOHAN M...'
        ? step2Customer
        : activeCustomer
        ? activeCustomer.name
        : 'SAI MOHAN MARKETING';

    // 1. Update customer debit balance
    if (activeCustomer) {
      setCustomersList((prev) =>
        prev.map((c) =>
          c.id === activeCustomer.id
            ? { ...c, debit: c.debit + grandTotalAmount }
            : c
        )
      );
    }

    // 2. Add new Performo Bill
    const newBill = {
      id: `PRF-BILL-${Date.now()}`,
      purchaseId: `PRF-${currentBillNo}`,
      billNo: currentBillNo,
      customer: targetCustomerName,
      companyName: step2Company || 'SIMBA FW',
      date: step2Date || purchaseDate,
      subtotal: subtotalAmount,
      discount: discountAmount,
      packing: packingAmount,
      tax: taxAmount,
      netTotal: grandTotalAmount,
      transport: transportVal,
      debit: grandTotalAmount,
      credit: activeCustomer ? activeCustomer.credit : 0,
      netBalance: grandTotalAmount - (activeCustomer ? activeCustomer.credit : 0),
    };
    setPerformoBills((prev) => [newBill, ...prev]);

    // 3. Add to ledger transactions history
    const newTxn = {
      id: `TXN-${Date.now()}`,
      customerId: activeCustomer ? activeCustomer.id : 'CUST-101',
      customerName: targetCustomerName,
      date: step2Date || purchaseDate,
      companyName: step2Company || 'SIMBA FW',
      debit: grandTotalAmount,
      credit: 0.00,
      balance: (activeCustomer ? activeCustomer.debit : 0) + grandTotalAmount,
    };
    setTransactions((prev) => [newTxn, ...prev]);

    setFeedback({
      type: 'success',
      message: `✅ Bill #${currentBillNo} Created Successfully!`,
      details: `${formatCurrency(grandTotalAmount)} billed to ${targetCustomerName} (Company: ${step2Company || 'SIMBA FW'}). Switched to Performo Details.`,
    });

    // Reset product rows and increment bill number for next bill
    setProductRows([]);
    const nextBillNo = (parseInt(currentBillNo, 10) + 1 || 102).toString();
    setStep2BillNo(nextBillNo);

    // Auto-navigate to Performo Details tab to show created bill
    setActiveTab('performo');
  };

  // Save Performo Order (Step 4 legacy)
  const handleSavePerformo = () => {
    if (!activeCustomer) return;
    if (productRows.length === 0) {
      setFeedback({
        type: 'error',
        message: 'Performo item list is empty. Add products in Step 2 above.',
      });
      return;
    }

    setCustomersList(
      customersList.map((c) =>
        c.id === activeCustomer.id
          ? { ...c, debit: c.debit + grandTotalAmount }
          : c
      )
    );

    setFeedback({
      type: 'success',
      message: `✅ Performo ${performoRefNo} Generated Successfully!`,
      details: `${formatCurrency(grandTotalAmount)} added to ${activeCustomer.name}'s Performo statement.`,
    });

    setPerformoRefNo(`PRF-2024-${Math.floor(100 + Math.random() * 900)}`);
  };

  // Submit Add Credit / Payment Received
  const handleAddCreditSubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(creditForm.amount) || 0;
    if (amt <= 0) {
      setCreditFeedback({
        type: 'error',
        message: 'Please enter a valid Credit Amount (> 0).',
      });
      return;
    }

    const targetCustomer =
      customersList.find((c) => c.name === creditForm.customerName) || activeCustomer;

    const newCreditEntry = {
      id: `CRD-${Date.now()}`,
      customerName: creditForm.customerName || (targetCustomer ? targetCustomer.name : 'SAI MOHAN MARKETING'),
      companyName: creditForm.companyName || 'SIMBA FW',
      creditAmt: amt,
      paymentMethod: creditForm.paymentMethod || 'UPI',
      paymentRefId: creditForm.ref || `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      date: creditForm.date || '2026-09-17',
    };
    setCreditEntries((prev) => [newCreditEntry, ...prev]);

    if (addAdvancePayment && targetCustomer) {
      addAdvancePayment({
        customerId: targetCustomer.id,
        amount: amt,
        date: creditForm.date || '2026-09-17',
        paymentReference: creditForm.ref || `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
        paymentMethod: creditForm.paymentMethod,
      });
    }

    setCustomersList(
      customersList.map((c) =>
        c.name === creditForm.customerName || (targetCustomer && c.id === targetCustomer.id)
          ? { ...c, credit: c.credit + amt }
          : c
      )
    );

    setCreditFeedback({
      type: 'success',
      message: `✅ Payment Credit of ${formatCurrency(amt)} Recorded Successfully!`,
      details: `Customer: ${creditForm.customerName || targetCustomer?.name} | Company: ${creditForm.companyName} | Method: ${creditForm.paymentMethod} | Date: ${creditForm.date}`,
    });

    setCreditForm({
      customerName: activeCustomer ? activeCustomer.name : 'SAI MOHAN MARKETING',
      companyName: 'SIMBA FW',
      amount: '',
      paymentMethod: 'UPI',
      ref: '',
      date: '2026-09-17',
      desc: '',
    });
  };

  const netBalance = activeCustomer ? activeCustomer.debit - activeCustomer.credit : 0;
  const isDue = netBalance > 0;

  return (
    <div className="space-y-8 pb-12">
      {/* ── Top Header Banner ── */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Performo</h1>
        <p className="text-sm text-slate-500 mt-1">
          Performo billing, product allocation, customer account ledger, and credit entry
        </p>
      </div>

      {/* ── Sub-Navigation Tabs inside Performo ── */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('customer')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'customer'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <User size={16} />
          Select Customer Account
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('product')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'product'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Package size={16} />
          Product Entry & Billing Setup
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('account')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'account'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <User size={16} />
          Account Details
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('performo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'performo'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileSpreadsheet size={16} />
          Performo Details
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('credit')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'credit'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Wallet size={16} />
          Add Credit
        </button>
      </div>

      {/* ========================================================================= */}
      {/* ── STEP 1: SELECT CUSTOMER ACCOUNT ── */}
      {/* ========================================================================= */}
      {activeTab === 'customer' && (
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
              <User size={20} className="text-blue-600" />
              Select Customer Account
            </h2>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
              Customer Account & Allocation Setup
            </span>
          </div>

          {/* Row 1: Select Customer & Purchase Date & Live Remaining Advance */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5">
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Customer Account <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddCustomerModalOpen(true)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer bg-blue-50 hover:bg-blue-100 px-2.5 py-0.5 rounded-lg transition-colors"
                >
                  <Plus size={13} /> Add Customer
                </button>
              </div>
              <select
                value={selectedCustomerId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedCustomerId(id);
                  const cust = customersList.find((c) => c.id === id);
                  if (cust) {
                    setStep2Customer(cust.name);
                    const adv = getCustomerTotalAdvance(cust.id);
                    setCustomerAdvanceInput(adv ? adv.toString() : '');
                  }
                  setFeedback(null);
                  setCreditFeedback(null);
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer shadow-xs"
              >
                {customersList.length === 0 ? (
                  <option value="">No customers found - Click + Add Customer</option>
                ) : (
                  customersList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone || c.id})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Purchase Date
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => {
                  setPurchaseDate(e.target.value);
                  setStep2Date(e.target.value);
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            {/* Live Remaining Advance Display Banner */}
            <div className="md:col-span-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between shadow-2xs">
              <div>
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  Customer Remaining Advance
                </p>
                <p className="text-xl font-black text-emerald-700">
                  {formatCurrency(remainingAdvance)}
                </p>
              </div>
              <div className="text-right text-[11px] text-emerald-800 font-medium">
                <p>Total Advance: <strong>{formatCurrency(getCustomerTotalAdvance(selectedCustomerId))}</strong></p>
              </div>
            </div>
          </div>

          {/* Row 2: Customer Advance Amt & No. of Cases Input Fields */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Advance Amount (₹)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Enter Advance Amount"
                value={customerAdvanceInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomerAdvanceInput(val);
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-emerald-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
              />
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Total Ordered Cases</span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Manual Entry</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="Enter Total Cases (e.g. 10)"
                value={step2CaseCount}
                onChange={(e) => setStep2CaseCount(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
              />
            </div>

            <div className="md:col-span-4">
              <button
                type="button"
                onClick={() => setActiveTab('product')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                Proceed to Product Entry & Billing Setup →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* ── STEP 2: PRODUCT ENTRY ROW & BILLING SYSTEM ── */}
      {/* ========================================================================= */}
      {activeTab === 'product' && (
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
            <Package size={20} className="text-blue-600" />
            Product Entry & Billing Setup
          </h2>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Rate Mode:</span>
            <button
              type="button"
              onClick={() => setRateMode(rateMode === 'case' ? 'unit' : 'case')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md text-slate-700 font-bold text-[11px] cursor-pointer"
            >
              {rateMode === 'case' ? 'Rate per Case' : 'Rate per Unit'}
            </button>
          </div>
        </div>

        {/* Dynamic Case Count & Advance Amount Reduction Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-slate-50 p-4 rounded-xl border border-blue-200/80 shadow-2xs">
          <div>
            <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">
              Customer Account
            </p>
            <p className="text-sm font-black text-slate-900 mt-0.5 truncate">
              {activeCustomer ? activeCustomer.name : 'SAI MOHAN MARKETING'}
            </p>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
              Phone: {activeCustomer ? activeCustomer.phone : 'N/A'}
            </p>
          </div>

          <div className="border-l border-slate-200 pl-4">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              Remaining Cases / Allocated Cases
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`text-xl font-black ${dynamicRemainingCases < 0 ? 'text-rose-600' : 'text-blue-700'}`}>
                {dynamicRemainingCases} Cases
              </span>
              <span className="text-xs font-bold text-slate-400">
                / {initialCasesAllocated} Total
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-semibold mt-0.5">
              Added in Table: <strong className="text-slate-900">{totalAddedCases} Cases</strong>
            </p>
          </div>

          <div className="border-l border-slate-200 pl-4">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              Remaining Advance Balance
            </p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`text-xl font-black ${dynamicRemainingAdvance < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                {formatCurrency(dynamicRemainingAdvance)}
              </span>
              <span className="text-xs font-bold text-slate-400">
                / {formatCurrency(initialAdvanceAmt)}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-semibold mt-0.5">
              Added Product Total: <strong className="text-slate-900">{formatCurrency(subtotalAmount)}</strong>
            </p>
          </div>
        </div>

        {/* ── Product Entry Row ── */}
        <form onSubmit={handleAddProductRow} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            {/* Particular dropdown */}
            <div className="md:col-span-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Particular
              </label>
              <div className="relative flex items-center">
                <select
                  value={entryParticular}
                  onChange={(e) => setEntryParticular(e.target.value)}
                  className="w-full pl-3 pr-14 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer shadow-2xs appearance-none"
                >
                  <option value="">-- Select Product --</option>
                  {particularOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                {/* Inner Action Group: Cross Clear Icon + Dropdown Arrow */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {entryParticular && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEntryParticular('');
                        setEntryCase('');
                        setEntryRate('');
                        setEntryPktUnits('');
                        setEditingRowIndex(null);
                      }}
                      title="Clear"
                      className="w-5 h-5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                    >
                      <X size={12} />
                    </button>
                  )}
                  <ChevronDown
                    size={14}
                    className="text-slate-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Case input */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Case
              </label>
              <input
                type="number"
                min="1"
                placeholder="Case"
                value={entryCase}
                onChange={(e) => setEntryCase(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
              />
            </div>

            {/* Rate input */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Rate
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Rate"
                value={entryRate}
                onChange={(e) => setEntryRate(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
              />
            </div>

            {/* Pkt / Units input */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pkt / Units
              </label>
              <input
                type="number"
                min="1"
                placeholder="Pkt / Units"
                value={entryPktUnits}
                onChange={(e) => setEntryPktUnits(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
              />
            </div>

            {/* Amount field (Read-only / auto-calculated) */}
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Amount
              </label>
              <input
                type="text"
                readOnly
                placeholder="Amount"
                value={calculatedEntryAmount ? calculatedEntryAmount.toFixed(2) : ''}
                className="w-full px-2.5 py-2.5 bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none cursor-not-allowed shadow-2xs"
              />
            </div>

            {/* Add button (Blue square button) */}
            <div className="md:col-span-1 flex justify-end">
              <button
                type="submit"
                title={editingRowIndex !== null ? "Update Product" : "Add Product"}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-all shadow-sm cursor-pointer shrink-0"
              >
                {editingRowIndex !== null ? <Check size={18} /> : <Plus size={18} />}
              </button>
            </div>
          </div>

          {/* Live Units & Amount Formula Calculation Display */}
          {(casesVal > 0 || pktUnitsVal > 0 || rateVal > 0) && (
            <div className="bg-blue-50/90 border border-blue-200 rounded-lg px-3.5 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-semibold text-blue-950">
              <div className="flex items-center gap-2">
                <Calculator size={14} className="text-blue-600 shrink-0" />
                <span>
                  Total Units = {casesVal || 0} Case × {pktUnitsVal || 0} Pkt/Units ={' '}
                  <strong className="text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200 font-bold">
                    {totalUnitsCalculated} Units
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>
                  Product Amount = {pktUnitsVal > 0 ? `${totalUnitsCalculated} Units` : `${casesVal} Case`} × ₹{rateVal || 0} ={' '}
                  <strong className="text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200 font-bold">
                    {formatCurrency(calculatedEntryAmount)}
                  </strong>
                </span>
              </div>
            </div>
          )}
        </form>

        {/* ── Product Table ── */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase">
                  PARTICULAR
                </th>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase">
                  CASE
                </th>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase">
                  RATE
                </th>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase">
                  PKT / UNITS
                </th>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase">
                  AMOUNT
                </th>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase text-center">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {productRows.map((row, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    editingRowIndex === idx ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {row.particular}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {row.caseCount}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    ₹{row.rate.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {row.pktUnits ? (
                      <span>
                        {row.pktUnits} Pkt{' '}
                        <span className="text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded text-[11px]">
                          ({row.totalUnits} Units)
                        </span>
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {formatCurrency(row.amount)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditRow(idx)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Row"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteRow(idx)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Row"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {productRows.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-8 text-slate-400 font-medium"
                  >
                    No products added to table yet. Fill the row above and click + to add.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Customer & Billing Controls Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
          {/* Left Form Inputs (8 cols) */}
          <div className="md:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Customer */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer
                </label>
                <div className="relative">
                  <select
                    value={step2Customer}
                    onChange={(e) => setStep2Customer(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer shadow-2xs appearance-none"
                  >
                    <option value="SAI MOHAN M...">SAI MOHAN M...</option>
                    {customersList.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Case Count */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Case Count</span>
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Ordered Total</span>
                </label>
                <input
                  type="number"
                  readOnly
                  value={totalAddedCases}
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-black text-blue-700 focus:outline-none shadow-2xs cursor-not-allowed"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Company
                </label>
                <div className="relative">
                  <select
                    value={step2Company}
                    onChange={(e) => setStep2Company(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer shadow-2xs appearance-none"
                  >
                    {companyOptions.map((comp) => (
                      <option key={comp} value={comp}>
                        {comp}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Discount (%) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Discount %"
                  value={step2Discount}
                  onChange={(e) => setStep2Discount(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
                />
              </div>

              {/* Transport */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Transport
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Transport charges"
                  value={step2Transport}
                  onChange={(e) => setStep2Transport(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
                />
              </div>

              {/* Packing (%) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Packing (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Packing %"
                  value={step2Packing}
                  onChange={(e) => setStep2Packing(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
                />
              </div>

              {/* Bill No * */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bill No <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter Bill No (e.g. 101)"
                  value={step2BillNo}
                  onChange={(e) => setStep2BillNo(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
                />
              </div>

              {/* Tax */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tax (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Tax %"
                  value={step2Tax}
                  onChange={(e) => setStep2Tax(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
                />
              </div>
            </div>

            {/* Date and Create Button Row */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              {/* Date picker with calendar icon */}
              <div className="relative w-full sm:w-1/2">
                <input
                  type="date"
                  value={step2Date}
                  onChange={(e) => setStep2Date(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-2xs"
                />
                <Calendar
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
                />
              </div>

              {/* Blue gradient Create Button */}
              <button
                type="button"
                onClick={handleCreateInvoice}
                className="w-full sm:w-1/2 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                Click to Create
              </button>
            </div>
          </div>

          {/* Right Summary Card (4 cols) */}
          <div className="md:col-span-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>Amount Summary</span>
                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Auto Calculated</span>
              </h3>

              {/* Two Column Grid: Subtotal Amount | Net Total */}
              <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase">
                    Subtotal Amt
                  </p>
                  <p className="text-sm font-black text-slate-900 mt-0.5">
                    {formatCurrency(subtotalAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-500 uppercase">
                    Net Total
                  </p>
                  <p className="text-sm font-black text-blue-600 mt-0.5">
                    {formatCurrency(grandTotalAmount)}
                  </p>
                </div>
              </div>

              {/* Detail breakdown list */}
              <div className="space-y-2 text-xs border-t border-slate-200 pt-3">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Subtotal Amount:</span>
                  <span className="font-bold text-slate-900">{formatCurrency(subtotalAmount)}</span>
                </div>
                
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Discount ({discountVal}%):</span>
                  <span className="font-bold text-rose-600">- {formatCurrency(discountAmount)}</span>
                </div>
                
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Packing ({packingVal}%):</span>
                  <span className="font-bold text-slate-800">+ {formatCurrency(packingAmount)}</span>
                </div>
                
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Transport Charges:</span>
                  <span className="font-bold text-slate-800">+ {formatCurrency(transportVal)}</span>
                </div>
                
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Tax ({taxVal}%):</span>
                  <span className="font-bold text-slate-800">+ {formatCurrency(taxAmount)}</span>
                </div>

                <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
                  <span>Net Payable Total:</span>
                  <span className="text-blue-600 font-black">{formatCurrency(grandTotalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ========================================================================= */}
      {/* ── STEP 3: ACCOUNT DETAILS ── */}
      {/* ========================================================================= */}
      {activeTab === 'account' && (
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
            <User size={20} className="text-blue-600" />
            Account Details
          </h2>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {activeCustomer ? activeCustomer.name : 'Selected Customer'}
          </span>
        </div>

        {/* Selected Customer Transaction Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase">SL.NO</th>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase">DATE</th>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase">CUSTOMER</th>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase">COMPANY NAME</th>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase">DEBIT</th>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase">CREDIT</th>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase">BALANCE</th>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {customerTransactionsList.map((trx, index) => (
                <tr key={trx.id || index} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-600">
                    {index + 1}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {trx.date}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {trx.customerName || (activeCustomer ? activeCustomer.name : '-')}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">
                    {trx.companyName || 'SIMBA FW'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {trx.debit > 0 ? formatCurrency(trx.debit) : '-'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-600">
                    {trx.credit > 0 ? formatCurrency(trx.credit) : '-'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {formatCurrency(trx.balance)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditTransaction(trx)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Transaction"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(trx.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Transaction"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {customerTransactionsList.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-400 font-medium">
                    No transactions found for {activeCustomer ? activeCustomer.name : 'this customer'}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      )}

      {/* ========================================================================= */}
      {/* ── PERFORMO DETAILS ── */}
      {/* ========================================================================= */}
      {activeTab === 'performo' && (
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
            <FileSpreadsheet size={20} className="text-blue-600" />
            Performo Details
          </h2>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
            {activeCustomer ? activeCustomer.name : 'Selected Customer'} ({customerPerformoBills.length} Bills)
          </span>
        </div>

        {/* Selected Customer Performo Bills Detailed Table */}
        <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
          <table className="w-full text-left text-xs border-collapse min-w-[950px]">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase whitespace-nowrap">BILL.NO</th>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase whitespace-nowrap">CUSTOMER</th>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase whitespace-nowrap">COMPANY NAME</th>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase whitespace-nowrap">DATE</th>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase whitespace-nowrap">SUBTOTAL</th>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase whitespace-nowrap">DISCOUNT</th>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase whitespace-nowrap">PACKING</th>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase whitespace-nowrap">TAX</th>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase whitespace-nowrap">NET TOTAL</th>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase whitespace-nowrap">TRANSPORT</th>
                <th className="py-3 px-4 font-bold text-slate-700 uppercase text-center whitespace-nowrap">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {customerPerformoBills.map((bill, index) => (
                <tr key={bill.id || index} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600 whitespace-nowrap">
                    #{bill.billNo}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {bill.customer}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                    {bill.companyName || 'SIMBA FW'}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-600 whitespace-nowrap">
                    {bill.date}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {formatCurrency(bill.subtotal || bill.debit || 0)}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-rose-600 whitespace-nowrap">
                    {bill.discount > 0 ? formatCurrency(bill.discount) : '-'}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                    {bill.packing > 0 ? formatCurrency(bill.packing) : '-'}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                    {bill.tax > 0 ? formatCurrency(bill.tax) : '-'}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-blue-700 whitespace-nowrap">
                    {formatCurrency(bill.netTotal || bill.debit || 0)}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                    {bill.transport > 0 ? formatCurrency(bill.transport) : '-'}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewCustomerStatement(bill.customer)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[11px]"
                        title="View Account Details Statement"
                      >
                        <FileText size={13} />
                        <span>Statement</span>
                      </button>
                      <button
                        onClick={() => handleEditPerformoBill(bill)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Bill"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDeletePerformoBill(bill.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Bill"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {customerPerformoBills.length === 0 && (
                <tr>
                  <td colSpan="11" className="text-center py-8 text-slate-400 font-medium">
                    No Performo bills found for {activeCustomer ? activeCustomer.name : 'this customer'}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      )}



      {/* ========================================================================= */}
      {/* ── STEP 5: ADD CREDIT ── */}
      {/* ========================================================================= */}
      {activeTab === 'credit' && (
        <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
            <Wallet size={20} className="text-blue-600" />
            Add Credit
          </h2>
          <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
            Record Payment / Advance Credit
          </span>
        </div>

        {/* Add Credit Form */}
        <form onSubmit={handleAddCreditSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Customer Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={creditForm.customerName}
                  onChange={(e) =>
                    setCreditForm({ ...creditForm, customerName: e.target.value })
                  }
                  className="w-full pl-4 pr-9 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer appearance-none"
                >
                  {customersList.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={creditForm.companyName}
                  onChange={(e) =>
                    setCreditForm({ ...creditForm, companyName: e.target.value })
                  }
                  className="w-full pl-4 pr-9 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer appearance-none"
                >
                  {companyOptions.map((comp) => (
                    <option key={comp} value={comp}>
                      {comp}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Credit Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Credit Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="e.g. 50000.00"
                value={creditForm.amount}
                onChange={(e) =>
                  setCreditForm({ ...creditForm, amount: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Payment Method */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Payment Method
              </label>
              <div className="relative">
                <select
                  value={creditForm.paymentMethod}
                  onChange={(e) =>
                    setCreditForm({ ...creditForm, paymentMethod: e.target.value })
                  }
                  className="w-full pl-4 pr-9 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer appearance-none"
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="NEFT">NEFT / RTGS</option>
                  <option value="Cheque">Cheque</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Reference No / Txn ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Payment Reference / Txn ID
              </label>
              <input
                type="text"
                placeholder="e.g. UPI-982341 or CHQ-445123"
                value={creditForm.ref}
                onChange={(e) =>
                  setCreditForm({ ...creditForm, ref: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Payment Date
              </label>
              <input
                type="date"
                value={creditForm.date}
                onChange={(e) =>
                  setCreditForm({ ...creditForm, date: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-1">
            

            {/* Submit Button */}
            <div className="md:col-span-4 flex items-end justify-end h-full">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Add Credit Payment
              </button>
            </div>
          </div>
        </form>

        {/* Credit Feedback Banner */}
        {creditFeedback && (
          <div
            className={`p-4 rounded-xl border text-xs font-semibold ${
              creditFeedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}
          >
            <div className="flex items-start gap-2">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">{creditFeedback.message}</p>
                {creditFeedback.details && <p className="mt-0.5">{creditFeedback.details}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Credit Payment Records Table */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Wallet size={16} className="text-blue-600" />
            Credit Payment Records
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-x-auto shadow-2xs">
            <table className="w-full text-left text-xs border-collapse min-w-[800px]">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold text-slate-700 uppercase whitespace-nowrap">SL.NO</th>
                  <th className="py-3 px-4 font-bold text-slate-700 uppercase whitespace-nowrap">CUSTOMER NAME</th>
                  <th className="py-3 px-4 font-bold text-slate-700 uppercase whitespace-nowrap">COMPANY NAME</th>
                  <th className="py-3 px-4 font-bold text-slate-700 uppercase whitespace-nowrap">CREDIT AMT</th>
                  <th className="py-3 px-4 font-bold text-slate-700 uppercase whitespace-nowrap">PAYMENT METHOD</th>
                  <th className="py-3 px-4 font-bold text-slate-700 uppercase whitespace-nowrap">PAYMENT REF ID</th>
                  <th className="py-3 px-4 font-bold text-slate-700 uppercase whitespace-nowrap">DATE</th>
                  <th className="py-3 px-4 font-bold text-slate-700 uppercase text-center whitespace-nowrap">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {creditEntries.map((crd, index) => (
                  <tr key={crd.id || index} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-600 whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {crd.customerName}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                      {crd.companyName}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-600 whitespace-nowrap">
                      {formatCurrency(crd.creditAmt)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-[11px]">
                        {crd.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                      {crd.paymentRefId}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-600 whitespace-nowrap">
                      {crd.date}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditCreditEntry(crd)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Credit Entry"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteCreditEntry(crd.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Credit Entry"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {creditEntries.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-slate-400 font-medium">
                      No credit payment records found. Add credit using the form above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      )}
      {/* ── Quick Add Customer Modal ── */}
      <Modal
        isOpen={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
        title="Add New Customer"
      >
        <form onSubmit={handleQuickAddCustomer} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Customer / Business Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. SRI RAM FIREWORKS"
              value={newCustomerForm.name}
              onChange={(e) =>
                setNewCustomerForm({ ...newCustomerForm, name: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 9876543210"
                value={newCustomerForm.phone}
                onChange={(e) =>
                  setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                GST Number
              </label>
              <input
                type="text"
                placeholder="e.g. 33AABCS1234L1Z5"
                value={newCustomerForm.gst}
                onChange={(e) =>
                  setNewCustomerForm({ ...newCustomerForm, gst: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Address / Location
            </label>
            <input
              type="text"
              placeholder="e.g. Sivakasi, Tamil Nadu"
              value={newCustomerForm.address}
              onChange={(e) =>
                setNewCustomerForm({ ...newCustomerForm, address: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Opening / Advance Amount (₹)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="e.g. 50000"
              value={newCustomerForm.advanceAmount}
              onChange={(e) =>
                setNewCustomerForm({ ...newCustomerForm, advanceAmount: e.target.value })
              }
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-emerald-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddCustomerModalOpen(false)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Save Customer & Select
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PurchaseEntry;
