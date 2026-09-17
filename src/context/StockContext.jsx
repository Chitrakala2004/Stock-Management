import React, { createContext, useContext, useState, useEffect } from 'react';

const StockContext = createContext();

// Seed Brands
const initialBrands = [
  'Standard Crackers',
  'Ajanta Brand',
  'Sri Kaliswari Fireworks',
  'Coronation Fireworks',
  'Vadivel Pyrotechnics',
  'Ayyan Fireworks',
];

// Seed Products (Crackers Inventory)
const initialProducts = [
  {
    id: 'PROD-101',
    brand: 'Standard Crackers',
    name: 'Flower Pot (Deluxe)',
    category: 'Flower Pots',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80',
    pricePerPiece: 2,
    piecesPerCase: 10,
    availableCases: 100,
    minStockCases: 15,
  },
  {
    id: 'PROD-102',
    brand: 'Standard Crackers',
    name: '10cm Electric Sparklers',
    category: 'Sparklers',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300&q=80',
    pricePerPiece: 12,
    piecesPerCase: 100,
    availableCases: 150,
    minStockCases: 20,
  },
  {
    id: 'PROD-103',
    brand: 'Ajanta Brand',
    name: 'Ground Chakkar (Big)',
    category: 'Ground Chakkars',
    image: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=300&q=80',
    pricePerPiece: 5,
    piecesPerCase: 20,
    availableCases: 80,
    minStockCases: 10,
  },
  {
    id: 'PROD-104',
    brand: 'Ajanta Brand',
    name: 'Whistling Rockets',
    category: 'Rockets',
    image: 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=300&q=80',
    pricePerPiece: 15,
    piecesPerCase: 10,
    availableCases: 5, // Low stock
    minStockCases: 15,
  },
  {
    id: 'PROD-105',
    brand: 'Sri Kaliswari Fireworks',
    name: 'Hydro Atom Bomb',
    category: 'Atom Bombs',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300&q=80',
    pricePerPiece: 8,
    piecesPerCase: 50,
    availableCases: 120,
    minStockCases: 25,
  },
  {
    id: 'PROD-106',
    brand: 'Coronation Fireworks',
    name: '30-Shot Multi Color Aerial',
    category: 'Multi Shot',
    image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=300&q=80',
    pricePerPiece: 150,
    piecesPerCase: 1,
    availableCases: 3, // Low stock
    minStockCases: 10,
  },
  {
    id: 'PROD-107',
    brand: 'Vadivel Pyrotechnics',
    name: 'Deepavali Family Gift Box',
    category: 'Gift Boxes',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80',
    pricePerPiece: 380,
    piecesPerCase: 1,
    availableCases: 65,
    minStockCases: 15,
  },
];

// Seed Customers
const initialCustomers = [
  {
    id: 'CUST-101',
    name: 'Kumar',
    phone: '9876543210',
    email: 'kumar@crackersmart.com',
    status: 'Active',
    createdAt: '2024-08-15',
  },
  {
    id: 'CUST-102',
    name: 'Rajesh Traders',
    phone: '9845612370',
    email: 'rajesh@saisaitraders.in',
    status: 'Active',
    createdAt: '2024-08-20',
  },
  {
    id: 'CUST-103',
    name: 'Sunita Sharma',
    phone: '9123456790',
    email: 'sunita@sharmacrackers.com',
    status: 'Active',
    createdAt: '2024-08-25',
  },
  {
    id: 'CUST-104',
    name: 'Priya Enterprises',
    phone: '9988776655',
    email: 'priya@deepavalimart.in',
    status: 'Active',
    createdAt: '2024-09-01',
  },
];

// Seed Advance Payments
const initialAdvancePayments = [
  {
    id: 'ADV-1001',
    customerId: 'CUST-101',
    customerName: 'Kumar',
    amount: 5000,
    date: '2024-08-15',
    paymentReference: 'UPI-982341',
    paymentMethod: 'UPI',
  },
  {
    id: 'ADV-1002',
    customerId: 'CUST-102',
    customerName: 'Rajesh Traders',
    amount: 50000,
    date: '2024-08-20',
    paymentReference: 'NEFT-883920',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'ADV-1003',
    customerId: 'CUST-103',
    customerName: 'Sunita Sharma',
    amount: 100000,
    date: '2024-08-25',
    paymentReference: 'CHQ-445123',
    paymentMethod: 'Cheque',
  },
  {
    id: 'ADV-1004',
    customerId: 'CUST-104',
    customerName: 'Priya Enterprises',
    amount: 150000,
    date: '2024-09-01',
    paymentReference: 'NEFT-901234',
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 'ADV-1005',
    customerId: 'CUST-101',
    customerName: 'Kumar',
    amount: 2000, // Second advance for Kumar
    date: '2024-09-05',
    paymentReference: 'CASH-0021',
    paymentMethod: 'Cash',
  },
];

// Seed Purchases
const initialPurchases = [
  {
    id: 'PUR-2024-001',
    customerId: 'CUST-101',
    customerName: 'Kumar',
    purchaseDate: '2024-09-06',
    status: 'Confirmed',
    items: [
      {
        brand: 'Standard Crackers',
        productName: 'Flower Pot (Deluxe)',
        productId: 'PROD-101',
        casesPurchased: 3,
        piecesPerCase: 10,
        pricePerPiece: 2,
        totalPieces: 30,
        totalAmount: 60,
      },
      {
        brand: 'Ajanta Brand',
        productName: '10cm Electric Sparklers',
        productId: 'PROD-102',
        casesPurchased: 2,
        piecesPerCase: 100,
        pricePerPiece: 12,
        totalPieces: 200,
        totalAmount: 2400,
      },
    ],
    totalPurchaseAmount: 2460,
  },
  {
    id: 'PUR-2024-002',
    customerId: 'CUST-102',
    customerName: 'Rajesh Traders',
    purchaseDate: '2024-09-10',
    status: 'Confirmed',
    items: [
      {
        brand: 'Sri Kaliswari Fireworks',
        productName: 'Hydro Atom Bomb',
        productId: 'PROD-105',
        casesPurchased: 10,
        piecesPerCase: 50,
        pricePerPiece: 8,
        totalPieces: 500,
        totalAmount: 4000,
      },
    ],
    totalPurchaseAmount: 4000,
  },
];

// Seed Stock Transactions Log
const initialStockTransactions = [
  {
    id: 'STX-1001',
    date: '2024-08-10',
    productId: 'PROD-101',
    productName: 'Flower Pot (Deluxe)',
    brand: 'Standard Crackers',
    transactionType: 'Initial Stock Addition',
    casesChanged: 103,
    piecesChanged: 1030,
    reason: 'Opening godown inventory intake',
  },
  {
    id: 'STX-1002',
    date: '2024-09-06',
    productId: 'PROD-101',
    productName: 'Flower Pot (Deluxe)',
    brand: 'Standard Crackers',
    transactionType: 'Purchase Deduction',
    casesChanged: -3,
    piecesChanged: -30,
    reason: 'Purchase PUR-2024-001 confirmed for Customer Kumar',
  },
  {
    id: 'STX-1003',
    date: '2024-09-06',
    productId: 'PROD-102',
    productName: '10cm Electric Sparklers',
    brand: 'Standard Crackers',
    transactionType: 'Purchase Deduction',
    casesChanged: -2,
    piecesChanged: -200,
    reason: 'Purchase PUR-2024-001 confirmed for Customer Kumar',
  },
  {
    id: 'STX-1004',
    date: '2024-09-10',
    productId: 'PROD-105',
    productName: 'Hydro Atom Bomb',
    brand: 'Sri Kaliswari Fireworks',
    transactionType: 'Purchase Deduction',
    casesChanged: -10,
    piecesChanged: -500,
    reason: 'Purchase PUR-2024-002 confirmed for Customer Rajesh Traders',
  },
];

export const StockProvider = ({ children }) => {
  const [brands, setBrands] = useState(() => {
    const saved = localStorage.getItem('crackers_brands');
    return saved ? JSON.parse(saved) : initialBrands;
  });

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('crackers_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('crackers_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [advancePayments, setAdvancePayments] = useState(() => {
    const saved = localStorage.getItem('crackers_advances');
    return saved ? JSON.parse(saved) : initialAdvancePayments;
  });

  const [purchases, setPurchases] = useState(() => {
    const saved = localStorage.getItem('crackers_purchases');
    return saved ? JSON.parse(saved) : initialPurchases;
  });

  const [stockTransactions, setStockTransactions] = useState(() => {
    const saved = localStorage.getItem('crackers_stock_transactions');
    return saved ? JSON.parse(saved) : initialStockTransactions;
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('crackers_brands', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem('crackers_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('crackers_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('crackers_advances', JSON.stringify(advancePayments));
  }, [advancePayments]);

  useEffect(() => {
    localStorage.setItem('crackers_purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('crackers_stock_transactions', JSON.stringify(stockTransactions));
  }, [stockTransactions]);

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
