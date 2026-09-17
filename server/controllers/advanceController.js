const AdvancePayment = require('../models/AdvancePayment');

let memoryAdvances = [
  {
    _id: 'ADV-101',
    id: 'ADV-101',
    customerId: 'CUST-101',
    customerName: 'SAI MOHAN MARKETING',
    companyName: 'SIMBA FW',
    creditAmt: 307500.00,
    amount: 307500.00,
    paymentMethod: 'UPI',
    paymentRefId: 'UPI-982341-Raipur',
    date: '10-09-2026',
  },
  {
    _id: 'ADV-102',
    id: 'ADV-102',
    customerId: 'CUST-102',
    customerName: 'SRI SAI TRADERS',
    companyName: 'STANDARD FIREWORKS',
    creditAmt: 150000.00,
    amount: 150000.00,
    paymentMethod: 'Bank Transfer',
    paymentRefId: 'NEFT-55412-Sivakasi',
    date: '12-09-2026',
  },
];

const getAdvances = async (req, res) => {
  try {
    const advances = await AdvancePayment.find().sort({ createdAt: -1 });
    if (advances && advances.length > 0) return res.status(200).json(advances);
    return res.status(200).json(memoryAdvances);
  } catch (error) {
    return res.status(200).json(memoryAdvances);
  }
};

const createAdvance = async (req, res) => {
  try {
    const newAdv = await AdvancePayment.create(req.body);
    return res.status(201).json(newAdv);
  } catch (error) {
    const newAdv = {
      _id: `ADV-${Date.now()}`,
      id: `ADV-${Date.now()}`,
      ...req.body,
    };
    memoryAdvances.unshift(newAdv);
    return res.status(201).json(newAdv);
  }
};

const deleteAdvance = async (req, res) => {
  try {
    await AdvancePayment.findByIdAndDelete(req.params.id);
  } catch (error) {
    // fallback
  }
  memoryAdvances = memoryAdvances.filter(a => a._id !== req.params.id && a.id !== req.params.id);
  res.status(200).json({ message: 'Advance payment removed' });
};

module.exports = {
  getAdvances,
  createAdvance,
  deleteAdvance,
};
