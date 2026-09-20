const AdvancePayment = require('../models/AdvancePayment');
const Customer = require('../models/Customer');
const { memoryCustomers } = require('./customerController');

let memoryAdvances = [];

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
  const amt = parseFloat(req.body.amount || req.body.creditAmt) || 0;
  try {
    const newAdv = await AdvancePayment.create(req.body);
    if (amt > 0) {
      const mongoose = require('mongoose');
      let custUpdated = false;
      if (req.body.customerId) {
        if (mongoose.Types.ObjectId.isValid(req.body.customerId)) {
          const doc = await Customer.findByIdAndUpdate(req.body.customerId, { $inc: { credit: amt } }, { new: true });
          if (doc) custUpdated = true;
        }
        if (!custUpdated) {
          const doc = await Customer.findOneAndUpdate(
            { customId: req.body.customerId },
            { $inc: { credit: amt } },
            { new: true }
          );
          if (doc) custUpdated = true;
        }
      }
      if (!custUpdated && req.body.customerName) {
        await Customer.findOneAndUpdate(
          { name: req.body.customerName },
          { $inc: { credit: amt } },
          { new: true }
        );
      }
    }
    return res.status(201).json(newAdv);
  } catch (error) {
    const newAdv = {
      _id: `ADV-${Date.now()}`,
      id: `ADV-${Date.now()}`,
      ...req.body,
    };
    memoryAdvances.unshift(newAdv);
    if (amt > 0 && memoryCustomers) {
      const cIdx = memoryCustomers.findIndex(
        (c) =>
          c.id === req.body.customerId ||
          c._id === req.body.customerId ||
          c.customId === req.body.customerId ||
          (req.body.customerName && c.name?.toLowerCase() === req.body.customerName.toLowerCase())
      );
      if (cIdx !== -1) {
        memoryCustomers[cIdx].credit = (parseFloat(memoryCustomers[cIdx].credit) || 0) + amt;
      }
    }
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
