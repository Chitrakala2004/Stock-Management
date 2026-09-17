import React, { useState } from 'react';
import { useStock } from '../context/StockContext';
import {
  ShoppingCart,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Package,
  Calculator,
  IndianRupee,
  Boxes,
  User,
  Wallet,
} from 'lucide-react';

const PurchaseEntry = () => {
  const {
    customers,
    brands,
    products,
    confirmPurchase,
    getCustomerRemainingAdvance,
    getCustomerTotalAdvance,
  } = useStock();

  // Selected customer
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);

  // Current item builder inputs
  const [selectedBrand, setSelectedBrand] = useState(brands[0] || 'Standard Crackers');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [casesInput, setCasesInput] = useState('1');

  // Multi-product Cart Items
  const [cartItems, setCartItems] = useState([]);

  // Result / Warning feedback state
  const [feedback, setFeedback] = useState(null);

  // Products filtered by currently selected brand
  const brandProducts = products.filter((p) => p.brand === selectedBrand);

  // Selected product object
  const activeProduct = products.find((p) => p.id === selectedProductId) || brandProducts[0];

  // Auto-calculated item values
  const casesNum = parseInt(casesInput, 10) || 0;
  const piecesPerCase = activeProduct ? activeProduct.piecesPerCase : 0;
  const pricePerPiece = activeProduct ? activeProduct.pricePerPiece : 0;

  const totalPieces = casesNum * piecesPerCase;
  const itemTotalAmount = totalPieces * pricePerPiece;

  // Selected customer object & remaining advance
  const activeCustomer = customers.find((c) => c.id === selectedCustomerId);
  const remainingAdvance = selectedCustomerId ? getCustomerRemainingAdvance(selectedCustomerId) : 0;
  const totalCartAmount = cartItems.reduce((sum, item) => sum + item.totalAmount, 0);

  // Add Item to Cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!activeProduct || casesNum <= 0) return;

    // Check if item already in cart
    const existingIndex = cartItems.findIndex((it) => it.productId === activeProduct.id);
    if (existingIndex !== -1) {
      const updated = [...cartItems];
      const newCases = updated[existingIndex].casesPurchased + casesNum;
      const newPieces = newCases * activeProduct.piecesPerCase;
      const newAmt = newPieces * activeProduct.pricePerPiece;

      updated[existingIndex] = {
        ...updated[existingIndex],
        casesPurchased: newCases,
        totalPieces: newPieces,
        totalAmount: newAmt,
      };
      setCartItems(updated);
    } else {
      const newItem = {
        productId: activeProduct.id,
        productName: activeProduct.name,
        brand: activeProduct.brand,
        casesPurchased: casesNum,
        piecesPerCase: activeProduct.piecesPerCase,
        pricePerPiece: activeProduct.pricePerPiece,
        totalPieces,
        totalAmount: itemTotalAmount,
        availableStockCases: activeProduct.availableCases,
      };
      setCartItems([...cartItems, newItem]);
    }

    setFeedback(null);
    setCasesInput('1');
  };

  const handleRemoveFromCart = (index) => {
    setCartItems(cartItems.filter((_, i) => i !== index));
    setFeedback(null);
  };

  // Confirm Purchase Execution
  const handleConfirmPurchase = () => {
    if (!selectedCustomerId) {
      setFeedback({ type: 'error', message: 'Please select a customer.' });
      return;
    }
    if (cartItems.length === 0) {
      setFeedback({ type: 'error', message: 'Cart is empty. Add at least one crackers product.' });
      return;
    }

    // Call Context confirmation logic
    const result = confirmPurchase({
      customerId: selectedCustomerId,
      items: cartItems,
      purchaseDate,
    });

    if (result.success) {
      setFeedback({
        type: 'success',
        message: `✅ Purchase Order ${result.purchaseId} Confirmed Successfully!`,
        details: `₹${result.totalPurchaseAmount.toLocaleString('en-IN')} deducted from ${activeCustomer.name}'s advance. Updated Remaining Advance: ₹${result.remainingAdvance.toLocaleString('en-IN')}`,
      });
      setCartItems([]);
    } else {
      setFeedback({
        type: 'error',
        message: result.error,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-semibold mb-2">
              💥 Admin Stock Allocation Entry
            </div>
            <h2 className="text-2xl font-extrabold">Customer Purchase Entry & Advance Deduction</h2>
            <p className="text-xs text-slate-300 mt-1">
              Select customer, add products from different brands into the order cart, verify automatic formulas, and confirm purchase to deduct stock & advance balance together.
            </p>
          </div>
        </div>
      </div>

      {/* ── Section 1: Customer Selection & Remaining Advance Banner ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <User size={18} className="text-blue-600" />
          Step 1: Select Customer Account
        </h3>

        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Customer Account <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                setFeedback(null);
              }}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-3">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Purchase Date
            </label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Live Remaining Advance Display */}
          <div className="col-span-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Customer Remaining Advance</p>
              <p className="text-xl font-black text-emerald-700">
                ₹{remainingAdvance.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-right text-[11px] text-emerald-800">
              <p>Total Advance: <strong>₹{getCustomerTotalAdvance(selectedCustomerId).toLocaleString('en-IN')}</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Multi-Brand Product Selection Builder ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
          <Package size={18} className="text-indigo-600" />
          Step 2: Add Crackers Products to Cart (Brand-Specific Selection)
        </h3>

        <form onSubmit={handleAddToCart} className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="grid grid-cols-12 gap-4">
            {/* Brand Dropdown */}
            <div className="col-span-3">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Select Brand <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  const firstOfBrand = products.find((p) => p.brand === e.target.value);
                  if (firstOfBrand) setSelectedProductId(firstOfBrand.id);
                }}
                className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Product Dropdown (filtered by brand) */}
            <div className="col-span-4">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Select Product <span className="text-red-500">*</span>
              </label>
              <select
                value={activeProduct ? activeProduct.id : ''}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {brandProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.availableCases} Cases Stock)
                  </option>
                ))}
                {brandProducts.length === 0 && (
                  <option value="">No products under this brand</option>
                )}
              </select>
            </div>

            {/* Case Quantity Input */}
            <div className="col-span-3">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Case Quantity Purchased <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={casesInput}
                onChange={(e) => setCasesInput(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-extrabold text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Add to Cart Button */}
            <div className="col-span-2 flex items-end">
              <button
                type="submit"
                disabled={!activeProduct}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Plus size={15} /> Add to Cart
              </button>
            </div>
          </div>

          {/* ── Clear Calculation Formula Banner ── */}
          {activeProduct && (
            <div className="bg-white border border-blue-200 rounded-lg p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-800">
                <Calculator size={16} className="text-blue-600" />
                <span className="font-semibold text-gray-500">Auto Calculation Formula:</span>
                <span className="font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md">
                  {casesNum} Cases × {piecesPerCase} Pieces × ₹{pricePerPiece} = ₹{itemTotalAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-gray-500 font-medium">
                Total Pieces: <strong className="text-slate-900">{totalPieces.toLocaleString('en-IN')} Pcs</strong> | Available Godown Stock: <strong className="text-emerald-600">{activeProduct.availableCases} Cases</strong>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* ── Section 3: Cart Summary & Verification ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <ShoppingCart size={18} className="text-amber-600" />
            Step 3: Order Summary Cart ({cartItems.length} Products)
          </h3>
          <span className="text-base font-black text-slate-900">
            Total Purchase Amount: <span className="text-emerald-600">₹{totalCartAmount.toLocaleString('en-IN')}</span>
          </span>
        </div>

        {/* ── Cart Table ── */}
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-4 font-bold text-gray-600 uppercase">Product Name</th>
                <th className="py-2.5 px-4 font-bold text-gray-600 uppercase">Brand</th>
                <th className="py-2.5 px-4 font-bold text-gray-600 uppercase">Cases</th>
                <th className="py-2.5 px-4 font-bold text-gray-600 uppercase">Pieces / Case</th>
                <th className="py-2.5 px-4 font-bold text-gray-600 uppercase">Total Pieces</th>
                <th className="py-2.5 px-4 font-bold text-gray-600 uppercase">Price / Piece</th>
                <th className="py-2.5 px-4 font-bold text-gray-600 uppercase">Total Amount</th>
                <th className="py-2.5 px-4 font-bold text-gray-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cartItems.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{item.productName}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                      {item.brand}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-black text-blue-600">{item.casesPurchased} Cases</td>
                  <td className="py-3 px-4 font-semibold text-gray-700">{item.piecesPerCase} Pcs/Case</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{item.totalPieces} Pcs</td>
                  <td className="py-3 px-4 font-bold text-gray-900">₹{item.pricePerPiece}</td>
                  <td className="py-3 px-4 font-black text-emerald-600">₹{item.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleRemoveFromCart(index)}
                      className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {cartItems.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-400 font-medium">
                    Cart is empty. Add items using the product builder above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Feedback Warning / Success Banners ── */}
        {feedback && (
          <div
            className={`p-4 rounded-xl border text-sm font-medium whitespace-pre-line ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}
          >
            <div className="flex items-start gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle size={20} className="text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold text-base">{feedback.message}</p>
                {feedback.details && <p className="text-xs mt-1">{feedback.details}</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── Confirmation Button ── */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            Clicking confirm will atomically deduct stock cases/pieces & deduct total amount from customer advance.
          </div>
          <button
            onClick={handleConfirmPurchase}
            disabled={cartItems.length === 0}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            Confirm Purchase & Deduct Advance
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseEntry;
