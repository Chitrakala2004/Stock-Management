import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  customerService,
  productService,
  brandService,
  purchaseService,
  advanceService,
  transactionService,
} from '../services/api';

const StockContext = createContext();


export const StockProvider = ({ children }) => {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [advancePayments, setAdvancePayments] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [stockTransactions, setStockTransactions] = useState([]);

  // Fetch Live Data from Backend MongoDB Database on Mount
  const fetchAllFromBackend = async () => {
    try {
      const [custRes, prodRes, brandRes, purRes, advRes, txnRes] = await Promise.all([
        customerService.getAll().catch(() => ({ data: [] })),
        productService.getAll().catch(() => ({ data: [] })),
        brandService.getAll().catch(() => ({ data: [] })),
        purchaseService.getAll().catch(() => ({ data: [] })),
        advanceService.getAll().catch(() => ({ data: [] })),
        transactionService.getAll().catch(() => ({ data: [] })),
      ]);

      if (custRes.data && custRes.data.length > 0) {
        setCustomers(custRes.data.map(c => ({
          ...c,
          id: c.customId || c.id || c._id,
        })));
      }
      if (prodRes.data && prodRes.data.length > 0) {
        setProducts(prodRes.data.map(p => ({
          ...p,
          id: p.id || p._id,
        })));
      }
      if (brandRes.data && brandRes.data.length > 0) {
        setBrands(brandRes.data.map(b => typeof b === 'string' ? b : b.name));
      } else {
        setBrands([]);
      }
      if (purRes.data && purRes.data.length > 0) {
        setPurchases(purRes.data.map(p => ({
          ...p,
          id: p.id || p._id,
        })));
      }
      if (advRes.data && advRes.data.length > 0) {
        setAdvancePayments(advRes.data.map(a => ({
          ...a,
          id: a.id || a._id,
        })));
      }
      if (txnRes.data && txnRes.data.length > 0) {
        setStockTransactions(txnRes.data.map(t => ({
          ...t,
          id: t.id || t._id,
        })));
      }
    } catch (err) {
      console.error('Error fetching MongoDB live data:', err);
    }
  };

  useEffect(() => {
    fetchAllFromBackend();
  }, []);

  // Brand Management
  const addBrand = (brandName) => {
    if (!brandName || brands.includes(brandName.trim())) return false;
    setBrands((prev) => [...prev, brandName.trim()]);
    return true;
  };

  // Product / Stock Management
  const addProduct = (newProduct) => {
    const id = `PROD-${Date.now()}`;
    const p = {
      id,
      brand: newProduct.brand,
      name: newProduct.name,
      category: newProduct.category || 'General Crackers',
      image: newProduct.image || '',
      pricePerPiece: parseFloat(newProduct.pricePerPiece) || 0,
      piecesPerCase: parseInt(newProduct.piecesPerCase, 10) || 1,
      availableCases: parseInt(newProduct.availableCases, 10) || 0,
      minStockCases: parseInt(newProduct.minStockCases, 10) || 10,
    };

    setProducts((prev) => [p, ...prev]);

    // Log stock transaction
    const log = {
      id: `STX-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      productId: p.id,
      productName: p.name,
      brand: p.brand,
      transactionType: 'Initial Stock Addition',
      casesChanged: p.availableCases,
      piecesChanged: p.availableCases * p.piecesPerCase,
      reason: 'New Product Added by Admin',
    };
    setStockTransactions((prev) => [log, ...prev]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p))
    );
  };

  const adjustProductStock = (productId, caseDelta, reason = 'Admin Manual Adjustment') => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newCases = Math.max(0, p.availableCases + caseDelta);
          return { ...p, availableCases: newCases };
        }
        return p;
      })
    );

    const targetProd = products.find((p) => p.id === productId);
    if (targetProd) {
      const piecesDelta = caseDelta * targetProd.piecesPerCase;
      const log = {
        id: `STX-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        productId: targetProd.id,
        productName: targetProd.name,
        brand: targetProd.brand,
        transactionType: caseDelta >= 0 ? 'Stock Addition' : 'Stock Reduction',
        casesChanged: caseDelta,
        piecesChanged: piecesDelta,
        reason,
      };
      setStockTransactions((prev) => [log, ...prev]);
    }
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Customer Management
  const addCustomer = (customerData) => {
    const newCust = {
      id: `CUST-${Date.now()}`,
      name: customerData.name,
      phone: customerData.phone,
      email: customerData.email || '',
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCust, ...prev]);
    return newCust;
  };

  const deleteCustomer = (id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  // Advance Payment Management
  const addAdvancePayment = ({ customerId, amount, date, paymentReference, paymentMethod }) => {
    const cust = customers.find((c) => c.id === customerId);
    if (!cust || !amount) return false;

    const newAdv = {
      id: `ADV-${Date.now()}`,
      customerId,
      customerName: cust.name,
      amount: parseFloat(amount) || 0,
      date: date || new Date().toISOString().split('T')[0],
      paymentReference: paymentReference || `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentMethod: paymentMethod || 'Cash',
    };

    setAdvancePayments((prev) => [newAdv, ...prev]);
    return true;
  };

  // Customer Financial Calculation Helpers
  const getCustomerTotalAdvance = (customerId) => {
    return advancePayments
      .filter((a) => a.customerId === customerId)
      .reduce((sum, a) => sum + (a.amount || 0), 0);
  };

  const getCustomerTotalPurchases = (customerId) => {
    return purchases
      .filter((p) => p.customerId === customerId && p.status === 'Confirmed')
      .reduce((sum, p) => sum + (p.totalPurchaseAmount || 0), 0);
  };

  const getCustomerRemainingAdvance = (customerId) => {
    const totalAdv = getCustomerTotalAdvance(customerId);
    const totalPur = getCustomerTotalPurchases(customerId);
    return totalAdv - totalPur;
  };

  // Purchase Confirmation (Multi-Product Cart Allocation)
  const confirmPurchase = ({ customerId, items, purchaseDate }) => {
    const cust = customers.find((c) => c.id === customerId);
    if (!cust) return { success: false, error: 'Invalid Customer selected.' };
    if (!items || items.length === 0) return { success: false, error: 'Purchase cart is empty.' };

    // Calculate total purchase amount
    const totalPurchaseAmount = items.reduce((sum, item) => sum + item.totalAmount, 0);

    // 1. Validate Customer Remaining Advance Balance
    const currentRemainingAdvance = getCustomerRemainingAdvance(customerId);
    if (currentRemainingAdvance < totalPurchaseAmount) {
      return {
        success: false,
        error: `Insufficient Customer Advance Balance!\n\nRequired Amount: ₹${totalPurchaseAmount.toLocaleString('en-IN')}\nAvailable Advance Balance: ₹${currentRemainingAdvance.toLocaleString('en-IN')}\n\nPlease add advance payment for ${cust.name} first.`,
      };
    }

    // 2. Validate Stock Availability for each item
    for (const item of items) {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod) {
        return { success: false, error: `Product "${item.productName}" no longer exists in stock.` };
      }
      if (prod.availableCases < item.casesPurchased) {
        return {
          success: false,
          error: `Insufficient Stock for "${item.brand} - ${item.productName}"!\n\nRequested: ${item.casesPurchased} Cases\nAvailable Stock: ${prod.availableCases} Cases`,
        };
      }
    }

    // All validations passed! Proceed with atomic update.
    const purchaseId = `PUR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const today = purchaseDate || new Date().toISOString().split('T')[0];

    // Snapshot purchase items with prices & pieces per case at time of purchase
    const snapshottedItems = items.map((item) => ({
      brand: item.brand,
      productName: item.productName,
      productId: item.productId,
      casesPurchased: item.casesPurchased,
      piecesPerCase: item.piecesPerCase,
      pricePerPiece: item.pricePerPiece,
      totalPieces: item.totalPieces,
      totalAmount: item.totalAmount,
    }));

    const newPurchase = {
      id: purchaseId,
      customerId,
      customerName: cust.name,
      purchaseDate: today,
      status: 'Confirmed',
      items: snapshottedItems,
      totalPurchaseAmount,
    };

    // Deduct stock for each item & log stock transaction
    const updatedProducts = [...products];
    const newStockLogs = [];

    for (const item of items) {
      const prodIndex = updatedProducts.findIndex((p) => p.id === item.productId);
      if (prodIndex !== -1) {
        const p = updatedProducts[prodIndex];
        const newCases = p.availableCases - item.casesPurchased;
        updatedProducts[prodIndex] = { ...p, availableCases: newCases };

        newStockLogs.push({
          id: `STX-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          date: today,
          productId: p.id,
          productName: p.name,
          brand: p.brand,
          transactionType: 'Purchase Deduction',
          casesChanged: -item.casesPurchased,
          piecesChanged: -item.totalPieces,
          reason: `Confirmed Purchase ${purchaseId} for Customer ${cust.name}`,
        });
      }
    }

    setProducts(updatedProducts);
    setStockTransactions((prev) => [...newStockLogs, ...prev]);
    setPurchases((prev) => [newPurchase, ...prev]);

    return {
      success: true,
      purchaseId,
      totalPurchaseAmount,
      remainingAdvance: currentRemainingAdvance - totalPurchaseAmount,
    };
  };

  // Dashboard Aggregated Metrics
  const totalCustomersCount = customers.length;
  const totalAdvanceCollected = advancePayments.reduce((sum, a) => sum + (a.amount || 0), 0);
  const totalPurchaseValue = purchases
    .filter((p) => p.status === 'Confirmed')
    .reduce((sum, p) => sum + (p.totalPurchaseAmount || 0), 0);
  const totalRemainingAdvance = totalAdvanceCollected - totalPurchaseValue;

  const totalStockCases = products.reduce((sum, p) => sum + (p.availableCases || 0), 0);
  const totalStockPieces = products.reduce(
    (sum, p) => sum + (p.availableCases || 0) * (p.piecesPerCase || 1),
    0
  );

  const lowStockProductsCount = products.filter(
    (p) => p.availableCases <= (p.minStockCases || 10)
  ).length;

  const pendingCustomersCount = customers.filter(
    (c) => getCustomerRemainingAdvance(c.id) <= 0
  ).length;

  // Performo / Account Statement Navigation State
  const [selectedCustomerIdForStatement, setSelectedCustomerIdForStatement] = useState(null);
  const [targetPerformoTab, setTargetPerformoTab] = useState(null);

  const openCustomerStatement = (customerIdOrName) => {
    setSelectedCustomerIdForStatement(customerIdOrName);
    setTargetPerformoTab('account');
  };

  const clearCustomerStatementNav = () => {
    setSelectedCustomerIdForStatement(null);
    setTargetPerformoTab(null);
  };

  return (
    <StockContext.Provider
      value={{
        brands,
        addBrand,
        products,
        addProduct,
        updateProduct,
        adjustProductStock,
        deleteProduct,
        customers,
        addCustomer,
        deleteCustomer,
        advancePayments,
        addAdvancePayment,
        purchases,
        confirmPurchase,
        stockTransactions,
        getCustomerTotalAdvance,
        getCustomerTotalPurchases,
        getCustomerRemainingAdvance,
        // Dashboard Metrics
        totalCustomersCount,
        totalAdvanceCollected,
        totalPurchaseValue,
        totalRemainingAdvance,
        totalStockCases,
        totalStockPieces,
        lowStockProductsCount,
        pendingCustomersCount,
        // Performo Statement Navigation
        selectedCustomerIdForStatement,
        targetPerformoTab,
        openCustomerStatement,
        clearCustomerStatementNav,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};
