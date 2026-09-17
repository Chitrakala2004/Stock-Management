const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      default: 'Standard Crackers',
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
    piecesPerCase: {
      type: Number,
      default: 10,
      min: 1,
    },
    availableCases: {
      type: Number,
      default: 50,
      min: 0,
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
