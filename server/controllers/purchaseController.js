const Purchase = require('../models/Purchase');

let memoryPurchases = [
  {
    _id: 'PRF-BILL-101',
    id: 'PRF-BILL-101',
    purchaseId: 'PRF-101',
    billNo: '101',
    customerName: 'SAI MOHAN MARKETING',
    customer: 'SAI MOHAN MARKETING',
    companyName: 'SIMBA FW',
    purchaseDate: '10-09-2026',
    date: '10-09-2026',
    subtotal: 307506.00,
    discount: 0,
    packing: 0,
    tax: 0,
    netTotal: 307506.00,
    debit: 307506.00,
    credit: 307500.00,
    netBalance: 6.00,
    status: 'Confirmed',
    items: [],
  },
  {
    _id: 'PRF-BILL-102',
    id: 'PRF-BILL-102',
    purchaseId: 'PRF-102',
    billNo: '102',
    customerName: 'SRI SAI TRADERS',
    customer: 'SRI SAI TRADERS',
    companyName: 'STANDARD FIREWORKS',
    purchaseDate: '12-09-2026',
    date: '12-09-2026',
    subtotal: 150000.00,
    discount: 0,
    packing: 0,
    tax: 0,
    netTotal: 150000.00,
    debit: 150000.00,
    credit: 150000.00,
    netBalance: 0.00,
    status: 'Confirmed',
    items: [],
  },
];

const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ createdAt: -1 });
    if (purchases && purchases.length > 0) return res.status(200).json(purchases);
    return res.status(200).json(memoryPurchases);
  } catch (error) {
    return res.status(200).json(memoryPurchases);
  }
};

const createPurchase = async (req, res) => {
  try {
    const newPur = await Purchase.create(req.body);
    return res.status(201).json(newPur);
  } catch (error) {
    const newPur = {
      _id: `PRF-BILL-${Date.now()}`,
      id: `PRF-BILL-${Date.now()}`,
      ...req.body,
    };
    memoryPurchases.unshift(newPur);
    return res.status(201).json(newPur);
  }
};

const deletePurchase = async (req, res) => {
  try {
    await Purchase.findByIdAndDelete(req.params.id);
  } catch (error) {
    // fallback
  }
  memoryPurchases = memoryPurchases.filter(p => p._id !== req.params.id && p.id !== req.params.id);
  res.status(200).json({ message: 'Purchase bill removed' });
};

module.exports = {
  getPurchases,
  createPurchase,
  deletePurchase,
};
