const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      default: 'Standard Crackers',
    },
    companyName: {
      type: String,
    },
    name: {
      type: String,
      required: [true, 'Please add product name'],
      trim: true,
    },
    category: {
      type: String,
      default: 'General Crackers',
    },
    image: {
      type: String,
      default: '',
    },
    pricePerPiece: {
      type: Number,
      default: 10,
      min: 0,
    },
    rate: {
      type: Number,
      default: 10,
    },
    piecesPerCase: {
      type: Number,
      default: 10,
      min: 1,
    },
    pktUnits: {
      type: Number,
      default: 10,
    },
    availableCases: {
      type: Number,
      default: 50,
      min: 0,
    },
    cases: {
      type: Number,
      default: 50,
    },
    minStockCases: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for auto-calculated Available Piece Quantity
productSchema.virtual('availablePieces').get(function () {
  return this.availableCases * this.piecesPerCase;
});

// Virtual for auto-calculated Total Stock Value
productSchema.virtual('totalStockValue').get(function () {
  return this.availableCases * this.piecesPerCase * this.pricePerPiece;
});

module.exports = mongoose.model('Product', productSchema);
