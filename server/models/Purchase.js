const mongoose = require('mongoose');

const purchaseItemSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  productName: { type: String, required: true },
  productId: { type: String, required: true },
  casesPurchased: { type: Number, required: true, min: 1 },
  piecesPerCase: { type: Number, required: true }, // Snapshot at purchase time
  pricePerPiece: { type: Number, required: true }, // Snapshot at purchase time
  totalPieces: { type: Number, required: true },   // casesPurchased * piecesPerCase
  totalAmount: { type: Number, required: true },   // totalPieces * pricePerPiece
});

const purchaseSchema = new mongoose.Schema(
  {
    purchaseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    purchaseDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'Confirmed',
    },
    items: [purchaseItemSchema],
    totalPurchaseAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Purchase', purchaseSchema);
