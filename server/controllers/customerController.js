const Customer = require('../models/Customer');

// In-Memory Fallback Store if DB not connected
let memoryCustomers = [
  {
    _id: 'CUST-101',
    id: 'CUST-101',
    customId: 'CUST-101',
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
    customId: 'CUST-102',
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
    customId: 'CUST-103',
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
    customId: 'CUST-104',
    name: 'MEENA STORES & FIREWORKS',
    phone: '91234 56790',
    gst: '36AAAFM9012H1Z5',
    address: 'Market Yard, Hyderabad, Telangana - 500001',
    debit: 85000.00,
    credit: 85000.00,
    status: 'Active',
  },
];

// Helper to compute next sequential customer ID (e.g. CUST-101, CUST-102, CUST-105...)
const computeNextCustomerId = async () => {
  let maxNum = 100;
  try {
    const dbCustomers = await Customer.find({}, 'customId').lean();
    if (dbCustomers && dbCustomers.length > 0) {
      dbCustomers.forEach((c) => {
        const match = String(c.customId || '').match(/CUST-(\d+)/i);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        }
      });
    }
  } catch (err) {
    // Database query error handled silently, proceed to check memory store
  }

  memoryCustomers.forEach((c) => {
    const raw = String(c.customId || c.id || c._id || '');
    const match = raw.match(/CUST-(\d+)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  });

  return `CUST-${maxNum + 1}`;
};

// Deduplicate customers in MongoDB (removes duplicate documents with same customId)
const cleanupDuplicateCustomers = async () => {
  try {
    const all = await Customer.find().sort({ createdAt: -1 });
    const seen = new Set();
    const toDeleteIds = [];
    for (const c of all) {
      const cid = c.customId;
      if (cid && seen.has(cid)) {
        toDeleteIds.push(c._id);
      } else if (cid) {
        seen.add(cid);
      }
    }
    if (toDeleteIds.length > 0) {
      await Customer.deleteMany({ _id: { $in: toDeleteIds } });
      console.log(`Cleaned up ${toDeleteIds.length} duplicate customer records from MongoDB.`);
    }
  } catch (e) {
    // Non-fatal if DB not connected
  }
};

// Run duplicate cleanup on load
setTimeout(cleanupDuplicateCustomers, 1500);

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    if (customers && customers.length > 0) {
      const seen = new Set();
      const unique = [];
      for (const c of customers) {
        const obj = c.toObject();
        const key = obj.customId || String(obj._id);
        if (!seen.has(key)) {
          seen.add(key);
          unique.push({
            ...obj,
            id: obj.customId || obj._id,
            customId: obj.customId || obj._id,
          });
        }
      }
      return res.status(200).json(unique);
    }
    const memSeen = new Set();
    const uniqueMem = [];
    for (const c of memoryCustomers) {
      const key = c.customId || c.id || c._id;
      if (!memSeen.has(key)) {
        memSeen.add(key);
        uniqueMem.push(c);
      }
    }
    return res.status(200).json(uniqueMem);
  } catch (error) {
    const memSeen = new Set();
    const uniqueMem = [];
    for (const c of memoryCustomers) {
      const key = c.customId || c.id || c._id;
      if (!memSeen.has(key)) {
        memSeen.add(key);
        uniqueMem.push(c);
      }
    }
    return res.status(200).json(uniqueMem);
  }
};

const createCustomer = async (req, res) => {
  const nameTrimmed = (req.body.name || '').trim();
  const phoneTrimmed = (req.body.phone || '').trim();

  // 1. Guard against duplicate customer submissions
  try {
    const duplicateQuery = [];
    if (req.body.customId) {
      duplicateQuery.push({ customId: req.body.customId });
    }
    if (nameTrimmed && phoneTrimmed) {
      duplicateQuery.push({
        name: { $regex: new RegExp(`^${nameTrimmed.replace(/[-\\/\\\\^$*+?.()|[\\]{}]/g, '\\\\$&')}$`, 'i') },
        phone: phoneTrimmed,
      });
    }

    if (duplicateQuery.length > 0) {
      const existing = await Customer.findOne({ $or: duplicateQuery });
      if (existing) {
        const formatted = {
          ...existing.toObject(),
          id: existing.customId || existing._id,
          customId: existing.customId || existing._id,
        };
        return res.status(200).json(formatted);
      }
    }
  } catch (err) {
    console.warn('Duplicate check warning:', err.message);
  }

  // Check memory store for duplicate
  const existingMem = memoryCustomers.find(
    (c) =>
      (req.body.customId && (c.customId === req.body.customId || c.id === req.body.customId)) ||
      (nameTrimmed && phoneTrimmed && c.name?.toLowerCase() === nameTrimmed.toLowerCase() && c.phone === phoneTrimmed)
  );
  if (existingMem) {
    return res.status(200).json(existingMem);
  }

  let customId = req.body.customId;
  if (!customId || !customId.startsWith('CUST-')) {
    customId = await computeNextCustomerId();
  }

  try {
    const newCust = await Customer.create({
      ...req.body,
      name: nameTrimmed.toUpperCase(),
      customId,
    });
    const formatted = {
      ...newCust.toObject(),
      id: newCust.customId || newCust._id,
      customId: newCust.customId || customId,
    };
    memoryCustomers.unshift(formatted);
    return res.status(201).json(formatted);
  } catch (error) {
    console.error('Error in createCustomer:', error);
    const newCust = {
      _id: customId,
      id: customId,
      customId: customId,
      ...req.body,
      name: nameTrimmed.toUpperCase(),
      status: req.body.status || 'Active',
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
    if (!updated) {
      updated = await Customer.findOneAndUpdate({ name: req.params.id }, req.body, { new: true });
    }
    if (updated) return res.status(200).json(updated);
  } catch (error) {
    console.error('Error in updateCustomer:', error);
  }
  const idx = memoryCustomers.findIndex(
    (c) =>
      c._id === req.params.id ||
      c.id === req.params.id ||
      c.customId === req.params.id ||
      (c.name && c.name.toLowerCase() === req.params.id.toLowerCase())
  );
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
  memoryCustomers,
};
