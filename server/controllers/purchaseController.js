const Purchase = require('../models/Purchase');
const Customer = require('../models/Customer');
const { memoryCustomers } = require('./customerController');

let memoryPurchases = [];

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
  const debitAmt = parseFloat(req.body.netTotal || req.body.debit || req.body.totalPurchaseAmount) || 0;
  const newAdvance = parseFloat(req.body.newAdvancePaid) || 0;
  try {
    const newPur = await Purchase.create(req.body);
    const update = {};
    if (debitAmt > 0) update.$inc = { debit: debitAmt };
    if (newAdvance > 0) {
      if (!update.$inc) update.$inc = {};
      update.$inc.credit = newAdvance;
    }
    if (Object.keys(update).length > 0) {
      const mongoose = require('mongoose');
      let custUpdated = false;
      if (req.body.customerId) {
        if (mongoose.Types.ObjectId.isValid(req.body.customerId)) {
          const doc = await Customer.findByIdAndUpdate(req.body.customerId, update, { new: true });
          if (doc) custUpdated = true;
        }
        if (!custUpdated) {
          const doc = await Customer.findOneAndUpdate({ customId: req.body.customerId }, update, { new: true });
          if (doc) custUpdated = true;
        }
      }
      if (!custUpdated && (req.body.customerName || req.body.customer)) {
        await Customer.findOneAndUpdate({ name: req.body.customerName || req.body.customer }, update, { new: true });
      }
    }
    return res.status(201).json(newPur);
  } catch (error) {
    const newPur = {
      _id: `PRF-BILL-${Date.now()}`,
      id: `PRF-BILL-${Date.now()}`,
      ...req.body,
    };
    memoryPurchases.unshift(newPur);
    if (memoryCustomers) {
      const cIdx = memoryCustomers.findIndex(
        (c) =>
          c.id === req.body.customerId ||
          c._id === req.body.customerId ||
          c.customId === req.body.customerId ||
          (req.body.customerName && c.name?.toLowerCase() === req.body.customerName.toLowerCase()) ||
          (req.body.customer && c.name?.toLowerCase() === req.body.customer.toLowerCase())
      );
      if (cIdx !== -1) {
        if (debitAmt > 0) {
          memoryCustomers[cIdx].debit = (parseFloat(memoryCustomers[cIdx].debit) || 0) + debitAmt;
        }
        if (newAdvance > 0) {
          memoryCustomers[cIdx].credit = (parseFloat(memoryCustomers[cIdx].credit) || 0) + newAdvance;
        }
      }
    }
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
