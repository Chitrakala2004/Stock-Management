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
  const custName = (req.body.customerName || req.body.customer || '').trim();
  if (!custName || custName.toLowerCase() === 'general customer') {
    return res.status(400).json({ message: 'A valid customer account is required to create a purchase order.' });
  }

  // Ensure customerId is present
  if (!req.body.customerId) {
    try {
      const foundCust = await Customer.findOne({ name: new RegExp('^' + custName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') });
      if (foundCust) {
        req.body.customerId = foundCust.customId || foundCust._id.toString();
      }
    } catch (e) {}
  }

  const debitAmt = parseFloat(req.body.netTotal || req.body.debit || req.body.totalPurchaseAmount) || 0;
  const newAdvance = parseFloat(req.body.newAdvancePaid) || 0;
  try {
    const newPur = await Purchase.create(req.body);

    // Auto-sync products into Product collection if they do not exist
    if (Array.isArray(req.body.items) && req.body.items.length > 0) {
      const Product = require('../models/Product');
      for (const item of req.body.items) {
        const prodName = (item.particular || item.productName || '').trim();
        if (prodName) {
          try {
            const existingProd = await Product.findOne({
              name: new RegExp('^' + prodName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i')
            });
            if (!existingProd) {
              await Product.create({
                name: prodName,
                brand: item.brand || item.companyName || req.body.companyName || 'SIMBA FW',
                companyName: item.companyName || item.brand || req.body.companyName || 'SIMBA FW',
                pricePerPiece: parseFloat(item.rate) || 10,
                rate: parseFloat(item.rate) || 10,
                piecesPerCase: parseInt(item.pktUnits, 10) || 10,
                pktUnits: parseInt(item.pktUnits, 10) || 10,
                availableCases: 50,
                cases: 50,
                category: 'General Crackers',
              });
              console.log(`✨ Auto-created product in DB from purchase: ${prodName}`);
            }
          } catch (pErr) {
            console.warn('Product auto-sync warning:', pErr.message);
          }
        }
      }
    }

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
