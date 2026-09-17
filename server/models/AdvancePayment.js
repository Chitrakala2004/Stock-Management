const mongoose = require('mongoose');

const advancePaymentSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please add advance payment amount'],
      min: 0,
    },
    date: {
      type: String,
      required: true,
    },
    paymentReference: {
      type: String,
      default: '',
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Cash', 'Bank Transfer', 'Cheque', 'NEFT'],
      default: 'UPI',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AdvancePayment', advancePaymentSchema);
