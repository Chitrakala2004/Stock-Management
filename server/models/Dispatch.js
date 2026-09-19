const mongoose = require('mongoose');

const dispatchItemSchema = new mongoose.Schema({
  productId: { type: String },
  particular: { type: String },
  productName: { type: String },
  brand: { type: String },
  caseRequired: { type: Number, default: 0 },
  caseOut: { type: Number, default: 0 },
  rate: { type: Number, default: 0 },
  pktUnits: { type: Number, default: 1 },
  totalUnits: { type: Number, default: 0 },
  amount: { type: Number, default: 0 },
  pendingCases: { type: Number, default: 0 },
});

const dispatchSchema = new mongoose.Schema(
  {
    dispatchId: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      required: true,
    },
    items: [dispatchItemSchema],
    subtotal: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    packing: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    advanceAmount: {
      type: Number,
      default: 0,
    },
    balanceAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: 'Dispatched',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Dispatch', dispatchSchema);
