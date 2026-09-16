const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a stock name'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please add quantity'],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Please add price'],
      default: 0,
    },
    category: {
      type: String,
      default: 'Uncategorized',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Stock', stockSchema);
