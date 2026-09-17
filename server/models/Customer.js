const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add customer name'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please add customer mobile number'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
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
