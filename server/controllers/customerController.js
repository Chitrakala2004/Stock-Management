const Customer = require('../models/Customer');

// In-Memory Fallback Store if DB not connected
let memoryCustomers = [
  {
    _id: 'CUST-101',
    id: 'CUST-101',
    name: 'SAI MOHAN MARKETING',
    phone: '86020 05900',
    gst: '22ADWPN7742F1Z7',
    address: 'Plot No. 45, Commercial Complex, Raipur, Chhattisgarh - 492001',
    debit: 307506.00,
    credit: 307500.00,
    status: 'Active',
  },
  {
    _id: 'CUST-102',
    id: 'CUST-102',
    name: 'SRI SAI TRADERS',
    phone: '98765 43210',
    gst: '33AAACR1234F1Z1',
    address: 'Main Market Road, Sivakasi, Tamil Nadu - 626123',
    debit: 150000.00,
    credit: 150000.00,
    status: 'Active',
  },
  {
    _id: 'CUST-103',
    id: 'CUST-103',
    name: 'SHARMA CRACKERS STORE',
    phone: '98456 12370',
    gst: '27AABCS5678G2Z3',
    address: 'Station Road, Mumbai, Maharashtra - 400001',
    debit: 225000.00,
    credit: 200000.00,
    status: 'Active',
  },
  {
    _id: 'CUST-104',
    id: 'CUST-104',
    name: 'MEENA STORES & FIREWORKS',
    phone: '91234 56790',
    gst: '36AAAFM9012H1Z5',
    address: 'Market Yard, Hyderabad, Telangana - 500001',
    debit: 85000.00,
    credit: 85000.00,
    status: 'Active',
  },
];

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    if (customers && customers.length > 0) {
      return res.status(200).json(customers);
    }
    return res.status(200).json(memoryCustomers);
  } catch (error) {
    return res.status(200).json(memoryCustomers);
  }
};

const createCustomer = async (req, res) => {
  try {
    let customId = req.body.customId;
    if (!customId) {
      const count = await Customer.countDocuments();
      customId = `CUST-${101 + count}`;
    }
    const newCust = await Customer.create({ ...req.body, customId });
    return res.status(201).json(newCust);
  } catch (error) {
    console.error('Error in createCustomer:', error);
    const newCust = {
      _id: `CUST-${Date.now()}`,
      id: `CUST-${Date.now()}`,
      ...req.body,
      status: 'Active',
    };
    memoryCustomers.unshift(newCust);
    return res.status(201).json(newCust);
  }
};

const updateCustomer = async (req, res) => {
  try {
    let updated;
    const mongoose = require('mongoose');
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      updated = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    }
    if (!updated) {
      updated = await Customer.findOneAndUpdate({ customId: req.params.id }, req.body, { new: true });
    }
    if (updated) return res.status(200).json(updated);
  } catch (error) {
    console.error('Error in updateCustomer:', error);
  }
  const idx = memoryCustomers.findIndex(c => c._id === req.params.id || c.id === req.params.id);
  if (idx !== -1) {
    memoryCustomers[idx] = { ...memoryCustomers[idx], ...req.body };
    return res.status(200).json(memoryCustomers[idx]);
  }
  res.status(404).json({ message: 'Customer not found' });
};

const deleteCustomer = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    let deleted;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      deleted = await Customer.findByIdAndDelete(req.params.id);
    }
    if (!deleted) {
      deleted = await Customer.findOneAndDelete({ customId: req.params.id });
    }
    return res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error in deleteCustomer:', error);
  }
  memoryCustomers = memoryCustomers.filter(c => c._id !== req.params.id && c.id !== req.params.id);
  res.status(200).json({ message: 'Customer deleted successfully' });
};

module.exports = {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
