const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add brand name'],
      unique: true,
      trim: true,
    },
    address: {
      type: String,
      default: 'Sivakasi, Tamil Nadu',
    },
    gst: {
      type: String,
      default: 'N/A',
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Brand', brandSchema);
