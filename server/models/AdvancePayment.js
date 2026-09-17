const mongoose = require('mongoose');

const advancePaymentSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
    },
    customerName: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      default: 'SIMBA FW',
    },
    creditAmt: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      default: 'UPI',
    },
    paymentRefId: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AdvancePayment', advancePaymentSchema);
