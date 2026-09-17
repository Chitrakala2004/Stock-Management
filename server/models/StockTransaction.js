const mongoose = require('mongoose');

const stockTransactionSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    productId: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    transactionType: {
      type: String,
      enum: ['Initial Stock Addition', 'Stock Addition', 'Stock Reduction', 'Purchase Deduction'],
      required: true,
    },
    casesChanged: {
      type: Number,
      required: true,
    },
    piecesChanged: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StockTransaction', stockTransactionSchema);
