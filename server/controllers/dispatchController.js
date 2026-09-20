const Dispatch = require('../models/Dispatch');
const Customer = require('../models/Customer');

let memoryDispatches = [];

const getDispatches = async (req, res) => {
  try {
    const { customerId } = req.query;
    const query = customerId ? { customerId } : {};
    const dispatches = await Dispatch.find(query).sort({ createdAt: -1 });
    if (dispatches && dispatches.length > 0) return res.status(200).json(dispatches);
    return res.status(200).json(
      customerId ? memoryDispatches.filter((d) => d.customerId === customerId) : memoryDispatches
    );
  } catch (error) {
    return res.status(200).json(memoryDispatches);
  }
};

const createDispatch = async (req, res) => {
  try {
    const newDispatch = await Dispatch.create(req.body);
    // Also deduct customer credit/advance if customerId is passed
    if (req.body.customerId && req.body.totalAmount) {
      try {
        const mongoose = require('mongoose');
        const query = mongoose.Types.ObjectId.isValid(req.body.customerId)
          ? { _id: req.body.customerId }
          : { customId: req.body.customerId };
        await Customer.findOneAndUpdate(
          query,
          { $inc: { debit: req.body.totalAmount } }
        );
      } catch (err) {
        console.error('Error updating customer debit:', err);
      }
    }
    return res.status(201).json(newDispatch);
  } catch (error) {
    const fallbackDispatch = {
      _id: `DSP-${Date.now()}`,
      id: `DSP-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString(),
    };
    memoryDispatches.unshift(fallbackDispatch);
    return res.status(201).json(fallbackDispatch);
  }
};

const deleteDispatch = async (req, res) => {
  try {
    await Dispatch.findByIdAndDelete(req.params.id);
  } catch (error) {}
  memoryDispatches = memoryDispatches.filter(
    (d) => d._id !== req.params.id && d.id !== req.params.id
  );
  res.status(200).json({ message: 'Dispatch record removed' });
};

module.exports = {
  getDispatches,
  createDispatch,
  deleteDispatch,
};
