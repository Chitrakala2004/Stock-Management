const StockTransaction = require('../models/StockTransaction');

let memoryTransactions = [];

const getTransactions = async (req, res) => {
  try {
    const txns = await StockTransaction.find().sort({ createdAt: -1 });
    if (txns && txns.length > 0) return res.status(200).json(txns);
    return res.status(200).json(memoryTransactions);
  } catch (error) {
    return res.status(200).json(memoryTransactions);
  }
};

const createTransaction = async (req, res) => {
  try {
    const newTxn = await StockTransaction.create(req.body);
    return res.status(201).json(newTxn);
  } catch (error) {
    const newTxn = {
      _id: `TXN-${Date.now()}`,
      id: `TXN-${Date.now()}`,
      ...req.body,
    };
    memoryTransactions.unshift(newTxn);
    return res.status(201).json(newTxn);
  }
};

const deleteTransaction = async (req, res) => {
  try {
    await StockTransaction.findByIdAndDelete(req.params.id);
  } catch (error) {
    // fallback
  }
  memoryTransactions = memoryTransactions.filter(t => t._id !== req.params.id && t.id !== req.params.id);
  res.status(200).json({ message: 'Transaction removed' });
};

module.exports = {
  getTransactions,
  createTransaction,
  deleteTransaction,
};
