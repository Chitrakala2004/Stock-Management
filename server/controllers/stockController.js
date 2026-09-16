const Stock = require('../models/Stock');

// @desc    Get all stocks
// @route   GET /api/stocks
const getStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single stock
// @route   GET /api/stocks/:id
const getStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create stock
// @route   POST /api/stocks
const createStock = async (req, res) => {
  try {
    const stock = await Stock.create(req.body);
    res.status(201).json(stock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update stock
// @route   PUT /api/stocks/:id
const updateStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    res.status(200).json(stock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete stock
// @route   DELETE /api/stocks/:id
const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    if (!stock) {
      return res.status(404).json({ message: 'Stock not found' });
    }
    res.status(200).json({ message: 'Stock removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStocks, getStock, createStock, updateStock, deleteStock };
