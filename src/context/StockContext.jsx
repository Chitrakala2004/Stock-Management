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
        setBrands(
          brandRes.data.map((b, idx) => ({
            id: b._id || b.id || idx + 1,
            _id: b._id || b.id,
            name: typeof b === 'string' ? b : b.name,
            address: b.address || 'Sivakasi, Tamil Nadu',
            gst: b.gst || 'N/A',
          }))
        );
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

  // Brand / Company Management (MongoDB Atlas)
  const addBrand = async (brandData) => {
    const brandName = typeof brandData === 'string' ? brandData.trim() : brandData?.name?.trim();
    if (!brandName) return false;

    const payload = typeof brandData === 'string'
      ? { name: brandName, address: 'Sivakasi, Tamil Nadu', gst: 'N/A' }
      : {
          name: brandName,
          address: brandData.address || 'Sivakasi, Tamil Nadu',
          gst: brandData.gst || 'N/A',
        };

    try {
      const res = await brandService.create(payload);
      const saved = res.data;
      const formatted = {
        id: saved._id || saved.id || `BRD-${Date.now()}`,
        _id: saved._id || saved.id,
        name: saved.name,
        address: saved.address || payload.address,
        gst: saved.gst || payload.gst,
      };
      setBrands((prev) => [formatted, ...prev.filter(b => (typeof b === 'string' ? b : b.name) !== brandName)]);
      return formatted;
    } catch (err) {
      console.error('Error creating brand in backend:', err);
      const fallback = {
        id: `BRD-${Date.now()}`,
        name: brandName,
        address: payload.address,
        gst: payload.gst,
      };
      setBrands((prev) => [fallback, ...prev]);
      return fallback;
    }
  };

  const updateBrand = async (id, updatedData) => {
    try {
      const res = await brandService.update(id, updatedData);
      const updated = res.data;
      setBrands((prev) =>
        prev.map((b) =>
          b.id === id || b._id === id || b.name === id
            ? { ...b, ...updated, id: updated._id || updated.id || b.id }
            : b
        )
      );
      return updated;
    } catch (err) {
      console.error('Error updating brand in backend:', err);
      setBrands((prev) =>
        prev.map((b) => (b.id === id || b.name === id ? { ...b, ...updatedData } : b))
      );
    }
  };

  const deleteBrand = async (id) => {
    try {
      await brandService.delete(id);
      setBrands((prev) => prev.filter((b) => b.id !== id && b._id !== id && b.name !== id));
    } catch (err) {
      console.error('Error deleting brand from backend:', err);
      setBrands((prev) => prev.filter((b) => b.id !== id && b.name !== id));
    }
  };

  // Product / Stock Management (MongoDB Atlas)
  const addProduct = async (newProduct) => {
    const defaultBrand = brands[0] ? (typeof brands[0] === 'string' ? brands[0] : brands[0].name) : 'Standard Crackers';
    const payload = {
      brand: newProduct.brand || defaultBrand,
      name: newProduct.name ? newProduct.name.trim() : 'Unnamed Product',
      category: newProduct.category || 'General Crackers',
      image: newProduct.image || '',
      pricePerPiece: parseFloat(newProduct.pricePerPiece) || 10,
      piecesPerCase: parseInt(newProduct.piecesPerCase, 10) || 10,
      availableCases: parseInt(newProduct.availableCases, 10) || 50,
      minStockCases: parseInt(newProduct.minStockCases, 10) || 10,
    };

    try {
      const res = await productService.create(payload);
      const saved = res.data;
      const formatted = {
        ...saved,
        id: saved.id || saved._id,
      };
      setProducts((prev) => [formatted, ...prev]);

      // Log stock transaction
      const logPayload = {
        date: new Date().toISOString().split('T')[0],
        productId: formatted.id,
        productName: formatted.name,
        brand: formatted.brand,
        transactionType: 'Initial Stock Addition',
        casesChanged: formatted.availableCases,
        piecesChanged: formatted.availableCases * formatted.piecesPerCase,
        reason: 'New Product Added by Admin',
      };
      try {
        await transactionService.create(logPayload);
      } catch (e) {}
      setStockTransactions((prev) => [{ id: `STX-${Date.now()}`, ...logPayload }, ...prev]);
      return formatted;
    } catch (err) {
      console.error('Error adding product in backend:', err);
      const fallback = {
        id: `PROD-${Date.now()}`,
        ...payload,
      };
      setProducts((prev) => [fallback, ...prev]);
      return fallback;
    }
  };

  const updateProduct = async (updatedProduct) => {
    const id = updatedProduct.id || updatedProduct._id;
    try {
      const res = await productService.update(id, updatedProduct);
      const updated = res.data;
      const formatted = { ...updated, id: updated.id || updated._id };
      setProducts((prev) =>
        prev.map((p) => (p.id === id || p._id === id ? formatted : p))
      );
      return formatted;
    } catch (err) {
      console.error('Error updating product in backend:', err);
      setProducts((prev) =>
        prev.map((p) => (p.id === id || p._id === id ? { ...p, ...updatedProduct } : p))
      );
    }
  };

  const adjustProductStock = async (productId, caseDelta, reason = 'Admin Manual Adjustment') => {
    try {
      await productService.adjustStock(productId, caseDelta);
    } catch (err) {
      console.error('Error adjusting stock in backend:', err);
    }

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId || p._id === productId) {
          const newCases = Math.max(0, p.availableCases + caseDelta);
          return { ...p, availableCases: newCases };
        }
        return p;
      })
    );

    const targetProd = products.find((p) => p.id === productId || p._id === productId);
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
      try {
        await transactionService.create(log);
      } catch (e) {}
      setStockTransactions((prev) => [log, ...prev]);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productService.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id && p._id !== id));
    } catch (err) {
      console.error('Error deleting product from backend:', err);
      setProducts((prev) => prev.filter((p) => p.id !== id && p._id !== id));
    }
  };

  // Customer ID Sequence Helper (CUST-101, CUST-102, CUST-103...)
  const getNextCustomerId = (custList = customers) => {
    let maxNum = 100;
    (custList || []).forEach((c) => {
      const raw = String(c?.customId || c?.id || c?._id || '');
      const match = raw.match(/CUST-(\d+)/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });
    return `CUST-${maxNum + 1}`;
  };

  // Customer Management
  const addCustomer = async (customerData) => {
    const nextCustomId = customerData.customId || getNextCustomerId(customers);
    try {
      const payload = {
        customId: nextCustomId,
        name: customerData.name,
        phone: customerData.phone || '',
        gst: customerData.gst || 'N/A',
        address: customerData.address || '',
        email: customerData.email || '',
        debit: parseFloat(customerData.debit) || 0,
        credit: parseFloat(customerData.credit) || 0,
        status: customerData.status || 'Active',
      };
      const res = await customerService.create(payload);
      const saved = res.data;
      const formatted = {
        ...saved,
        id: saved.customId || saved.id || saved._id || nextCustomId,
        customId: saved.customId || nextCustomId,
      };
      setCustomers((prev) => [
        formatted,
        ...prev.filter((c) => (c.customId || c.id || c._id) !== formatted.id),
      ]);
      return formatted;
    } catch (err) {
      console.error('Error creating customer in backend:', err);
      const fallbackCust = {
        id: nextCustomId,
        customId: nextCustomId,
        _id: nextCustomId,
        ...customerData,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCustomers((prev) => [
        fallbackCust,
        ...prev.filter((c) => (c.customId || c.id || c._id) !== fallbackCust.id),
      ]);
      return fallbackCust;
    }
  };

  const updateCustomer = async (id, updatedData) => {
    try {
      const res = await customerService.update(id, updatedData);
      const updated = res.data;
      const formatted = {
        ...updated,
        id: updated.customId || updated.id || updated._id,
      };
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === id || c._id === id || c.customId === id ? formatted : c
        )
      );
      return formatted;
    } catch (err) {
      console.error('Error updating customer:', err);
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c))
      );
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await customerService.delete(id);
      setCustomers((prev) =>
        prev.filter((c) => c.id !== id && c._id !== id && c.customId !== id)
      );
    } catch (err) {
      console.error('Error deleting customer:', err);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Advance Payment Management
  const addAdvancePayment = async ({ customerId, customerName, amount, date, paymentReference, paymentMethod }) => {
    const cust = customers.find((c) => c.id === customerId || c._id === customerId || c.customId === customerId);
    const resolvedName = customerName || cust?.name || 'Customer';
    const parsedAmt = parseFloat(amount) || 0;
    if (!parsedAmt) return false;

    const payload = {
      customerId: cust?.customId || cust?.id || customerId,
      customerName: resolvedName,
      amount: parsedAmt,
      creditAmt: parsedAmt,
      date: date || new Date().toISOString().split('T')[0],
      paymentReference: paymentReference || `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentMethod: paymentMethod || 'Cash',
    };

    try {
      const res = await advanceService.create(payload);
      const saved = res.data;
      const formatted = {
        ...saved,
        id: saved.id || saved._id,
      };
      setAdvancePayments((prev) => [formatted, ...prev]);
      return formatted;
    } catch (err) {
      console.error('Error saving advance payment:', err);
      const fallbackAdv = {
        id: `ADV-${Date.now()}`,
        ...payload,
      };
      setAdvancePayments((prev) => [fallbackAdv, ...prev]);
      return fallbackAdv;
    }
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
        updateBrand,
        deleteBrand,
        products,
        addProduct,
        updateProduct,
        adjustProductStock,
        deleteProduct,
        customers,
        getNextCustomerId,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        fetchAllFromBackend,
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
