const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add brand name'],
      unique: true,
      trim: true,
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
