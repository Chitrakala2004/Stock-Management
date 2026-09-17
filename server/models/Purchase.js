const mongoose = require('mongoose');

const purchaseItemSchema = new mongoose.Schema({
  particular: { type: String },
  caseCount: { type: Number },
  rate: { type: Number },
  pktUnits: { type: Number },
  totalUnits: { type: Number },
  amount: { type: Number },
  rateMode: { type: String },
});

const purchaseSchema = new mongoose.Schema(
  {
    purchaseId: {
      type: String,
    },
    billNo: {
      type: String,
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
