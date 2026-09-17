import React, { useState } from 'react';
import { useStock } from '../context/StockContext';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Package,
  Building2,
  AlertTriangle,
  Layers,
  IndianRupee,
  Boxes,
  PlusCircle,
  Filter,
} from 'lucide-react';
import Modal from '../components/Modal';

const categoriesList = [
  'Flower Pots',
  'Sparklers',
  'Ground Chakkars',
  'Rockets',
  'Atom Bombs',
  'Multi Shot',
  'Gift Boxes',
  'Electric Crackers',
  'Other',
];

const StockManagement = () => {
  const {
    brands,
    addBrand,
    products,
    addProduct,
    updateProduct,
    adjustProductStock,
    deleteProduct,
  } = useStock();

  const [search, setSearch] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [stockStatusFilter, setStockStatusFilter] = useState('All');

  // Modals state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
  const [adjustingProduct, setAdjustingProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states
  const [newBrandName, setNewBrandName] = useState('');
  const [productForm, setProductForm] = useState({
    brand: (typeof brands[0] === 'string' ? brands[0] : brands[0]?.name) || 'Standard Crackers',
    name: '',
    category: 'Flower Pots',
    image: '',
    pricePerPiece: '',
    piecesPerCase: '10',
    availableCases: '50',
    minStockCases: '10',
  });

  const [stockAdjustment, setStockAdjustment] = useState({
    caseDelta: '',
    reason: 'New stock shipment received from manufacturer',
  });

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBrandSubmit = async (e) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    const result = await addBrand(newBrandName.trim());
    if (result) {
      setProductForm((prev) => ({ ...prev, brand: newBrandName.trim() }));
      setNewBrandName('');
      setIsAddBrandOpen(false);
    } else {
      alert('Brand already exists or invalid!');
    }
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.pricePerPiece || !productForm.piecesPerCase) return;

    await addProduct(productForm);
    setProductForm({
      brand: (typeof brands[0] === 'string' ? brands[0] : brands[0]?.name) || 'Standard Crackers',
      name: '',
      category: 'Flower Pots',
      image: '',
      pricePerPiece: '',
      piecesPerCase: '10',
      availableCases: '50',
      minStockCases: '10',
    });
    setIsAddProductOpen(false);
  };

  const handleAdjustStockSubmit = (e) => {
    e.preventDefault();
    if (!adjustingProduct) return;
    const delta = parseInt(stockAdjustment.caseDelta, 10) || 0;
    if (delta === 0) return;

    adjustProductStock(adjustingProduct.id, delta, stockAdjustment.reason);
    setAdjustingProduct(null);
    setStockAdjustment({ caseDelta: '', reason: 'New stock shipment received' });
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());

    const matchBrand = selectedBrandFilter === 'All' || p.brand === selectedBrandFilter;
    const matchCategory = selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter;

    let matchStatus = true;
    if (stockStatusFilter === 'Low Stock') {
      matchStatus = p.availableCases > 0 && p.availableCases <= (p.minStockCases || 10);
    } else if (stockStatusFilter === 'Out of Stock') {
      matchStatus = p.availableCases === 0;
    } else if (stockStatusFilter === 'In Stock') {
      matchStatus = p.availableCases > (p.minStockCases || 10);
    }

    return matchSearch && matchBrand && matchCategory && matchStatus;
  });

  const totalCases = filteredProducts.reduce((acc, p) => acc + p.availableCases, 0);
  const totalPieces = filteredProducts.reduce((acc, p) => acc + p.availableCases * p.piecesPerCase, 0);
  const totalStockValue = filteredProducts.reduce(
    (acc, p) => acc + p.availableCases * p.piecesPerCase * p.pricePerPiece,
    0
  );

  return (
    <div className="space-y-6">
      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Crackers Items</p>
          <p className="text-2xl font-black text-slate-900">{filteredProducts.length}</p>
          <p className="text-xs text-gray-500 mt-1">{brands.length} Active Brands</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Stock Cases Quantity</p>
          <p className="text-2xl font-black text-blue-600">{totalCases.toLocaleString('en-IN')} Cases</p>
          <p className="text-xs text-blue-700 mt-1 font-medium">{totalPieces.toLocaleString('en-IN')} Total Pieces</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Stock Value</p>
          <p className="text-2xl font-black text-emerald-600">₹{totalStockValue.toLocaleString('en-IN')}</p>
          <p className="text-xs text-emerald-700 mt-1 font-medium">Auto-calculated valuation</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddBrandOpen(true)}
              className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Building2 size={14} /> Add Brand
            </button>
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm shadow-blue-200 cursor-pointer"
            >
              <Plus size={14} /> Add Crackers
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Inventory Section ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Admin Crackers Inventory Management</h3>
            <p className="text-xs text-gray-400">Specify Pieces Per Case & Price Per Piece for precise automated stock & purchase deductions</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search brand, product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-56 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Brand Filter */}
            <select
              value={selectedBrandFilter}
              onChange={(e) => setSelectedBrandFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Brands ({brands.length})</option>
              {brands.map((b) => {
                const name = typeof b === 'string' ? b : b.name;
                return (
                  <option key={b.id || name} value={name}>{name}</option>
                );
              })}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categoriesList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={stockStatusFilter}
              onChange={(e) => setStockStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* ── Products Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Product & Brand</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Price / Piece</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Pieces / Case</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Available Cases</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Available Pieces</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Value</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredProducts.map((p) => {
                const totalPieces = p.availableCases * p.piecesPerCase;
                const totalVal = totalPieces * p.pricePerPiece;

                let statusBadge = (
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    In Stock
                  </span>
                );
                if (p.availableCases === 0) {
                  statusBadge = (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                      Out of Stock
                    </span>
                  );
                } else if (p.availableCases <= (p.minStockCases || 10)) {
                  statusBadge = (
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 w-fit">
                      <AlertTriangle size={12} /> Low Stock
                    </span>
                  );
                }

                return (
                  <tr key={p.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-gray-200" />
                        ) : (
                          <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center font-bold text-xs">
                            <Boxes size={18} />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                          <span className="inline-block text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md mt-0.5">
                            {p.brand}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium text-gray-600">{p.category}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">₹{p.pricePerPiece.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-blue-700 bg-blue-50/80 px-2.5 py-1 rounded-md w-fit">
                      {p.piecesPerCase} Pcs/Case
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">{p.availableCases} Cases</td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">{totalPieces.toLocaleString('en-IN')} Pcs</td>
                    <td className="py-3.5 px-4 font-black text-emerald-600">₹{totalVal.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4">{statusBadge}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setAdjustingProduct(p)}
                          title="Adjust Stock (+/- Cases)"
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          ± Stock
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-gray-400 text-sm">
                    No crackers products found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal: Add Brand ── */}
      {isAddBrandOpen && (
        <Modal
          isOpen={isAddBrandOpen}
          onClose={() => setIsAddBrandOpen(false)}
          title="Add New Fireworks Brand"
        >
          <form onSubmit={handleAddBrandSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Brand Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Standard Crackers, Ajanta Brand"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsAddBrandOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all cursor-pointer"
              >
                Save Brand
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Modal: Add Crackers Product ── */}
      {isAddProductOpen && (
        <Modal
          isOpen={isAddProductOpen}
          onClose={() => setIsAddProductOpen(false)}
          title="Add Crackers Product Under Brand"
        >
          <form onSubmit={handleAddProductSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Brand Name <span className="text-red-500">*</span>
                </label>
                <select
                  name="brand"
                  value={productForm.brand}
                  onChange={handleProductInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {brands.map((b) => {
                    const name = typeof b === 'string' ? b : b.name;
                    return (
                      <option key={b.id || name} value={name}>{name}</option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Product Category
                </label>
                <select
                  name="category"
                  value={productForm.category}
                  onChange={handleProductInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {categoriesList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Crackers Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Flower Pot (Deluxe)"
                value={productForm.name}
                onChange={handleProductInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Price Per Piece (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="pricePerPiece"
                  required
                  step="0.01"
                  placeholder="e.g. 2"
                  value={productForm.pricePerPiece}
                  onChange={handleProductInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Pieces Per Case <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="piecesPerCase"
                  required
                  min="1"
                  placeholder="e.g. 10"
                  value={productForm.piecesPerCase}
                  onChange={handleProductInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Available Case Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="availableCases"
                  required
                  min="0"
                  placeholder="e.g. 100"
                  value={productForm.availableCases}
                  onChange={handleProductInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Minimum Stock Threshold (Cases)
                </label>
                <input
                  type="number"
                  name="minStockCases"
                  placeholder="e.g. 10"
                  value={productForm.minStockCases}
                  onChange={handleProductInputChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Live Calculation Preview Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-900 font-medium space-y-1">
              <div className="flex justify-between">
                <span>Calculated Total Pieces:</span>
                <strong className="text-blue-700">{((parseInt(productForm.availableCases, 10) || 0) * (parseInt(productForm.piecesPerCase, 10) || 0)).toLocaleString('en-IN')} Pieces</strong>
              </div>
              <div className="flex justify-between border-t border-blue-200/60 pt-1">
                <span>Calculated Total Stock Value:</span>
                <strong className="text-emerald-700">₹{(((parseInt(productForm.availableCases, 10) || 0) * (parseInt(productForm.piecesPerCase, 10) || 0)) * (parseFloat(productForm.pricePerPiece) || 0)).toLocaleString('en-IN')}</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsAddProductOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition-all cursor-pointer"
              >
                Save Product & Stock
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Modal: Adjust Stock Quantity ── */}
      {adjustingProduct && (
        <Modal
          isOpen={!!adjustingProduct}
          onClose={() => setAdjustingProduct(null)}
          title={`Adjust Stock Cases for ${adjustingProduct.name}`}
        >
          <form onSubmit={handleAdjustStockSubmit} className="space-y-4">
            <div className="bg-slate-100 p-3 rounded-xl text-xs space-y-1">
              <p className="font-bold text-slate-800">{adjustingProduct.brand} → {adjustingProduct.name}</p>
              <p className="text-slate-600">Current Stock: <strong>{adjustingProduct.availableCases} Cases</strong> ({adjustingProduct.availableCases * adjustingProduct.piecesPerCase} Pieces)</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Cases to Add or Remove <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                placeholder="Enter +10 to add stock, or -5 to reduce stock"
                value={stockAdjustment.caseDelta}
                onChange={(e) => setStockAdjustment({ ...stockAdjustment, caseDelta: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              />
              <p className="text-[11px] text-gray-400 mt-1">Use positive numbers to add cases, negative to remove.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Adjustment Reason
              </label>
              <input
                type="text"
                placeholder="e.g. Received new shipment from manufacturer"
                value={stockAdjustment.reason}
                onChange={(e) => setStockAdjustment({ ...stockAdjustment, reason: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setAdjustingProduct(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
              >
                Update Stock
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default StockManagement;
