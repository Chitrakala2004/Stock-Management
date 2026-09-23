const mongoose = require('mongoose');

const purchaseItemSchema = new mongoose.Schema({
  productId: { type: String },
  particular: { type: String },
  productName: { type: String },
  brand: { type: String },
  companyName: { type: String },
  caseRequired: { type: Number, default: 0 },
  caseOut: { type: Number, default: 0 },
  caseCount: { type: Number, default: 0 },
  rate: { type: Number, default: 0 },
  pktUnits: { type: Number, default: 1 },
  totalUnits: { type: Number, default: 0 },
  amount: { type: Number, default: 0 },
  pendingCases: { type: Number, default: 0 },
  dispatchedCases: { type: Number, default: 0 },
  rateMode: { type: String, default: 'case' },
});

const purchaseSchema = new mongoose.Schema(
  {
    purchaseId: {
      type: String,
    },
    billNo: {
      type: String,
    },
    customerId: {
      type: String,
      trim: true,
    },
    customer: {
      type: String,
    },
    customerName: {
      type: String,
    },
    companyName: {
      type: String,
      default: 'SIMBA FW',
    },
    date: {
      type: String,
    },
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
    netTotal: {
      type: Number,
      default: 0,
    },
    previousRemaining: {
      type: Number,
      default: 0,
    },
    newAdvancePaid: {
      type: Number,
      default: 0,
    },
    totalAvailableAdvance: {
      type: Number,
      default: 0,
    },
    transport: {
      type: Number,
      default: 0,
    },
    debit: {
      type: Number,
      default: 0,
    },
    credit: {
      type: Number,
      default: 0,
    },
    netBalance: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: 'Confirmed',
    },
    items: [purchaseItemSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Purchase', purchaseSchema);
