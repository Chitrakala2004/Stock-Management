const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, 'Please add brand name'],
    },
    name: {
      type: String,
      required: [true, 'Please add product name'],
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
      required: [true, 'Please add price per piece'],
      min: 0,
    },
    piecesPerCase: {
      type: Number,
      required: [true, 'Please add pieces per case'],
      min: 1,
    },
    availableCases: {
      type: Number,
      required: [true, 'Please add available case quantity'],
      min: 0,
      default: 0,
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
