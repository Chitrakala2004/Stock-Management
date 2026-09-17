const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
    },
    name: {
      type: String,
      required: [true, 'Please add customer name'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    gst: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    debit: {
      type: Number,
      default: 0,
    },
    credit: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Customer', customerSchema);
