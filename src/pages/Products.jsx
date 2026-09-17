import { useState, useEffect } from 'react';
import { useStock } from '../context/StockContext';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Package,
  Boxes,
} from 'lucide-react';
import Modal from '../components/Modal';

const Products = () => {
  const { products: contextProducts = [] } = useStock();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (contextProducts && contextProducts.length > 0) {
      setProducts(contextProducts);
    } else {
      setProducts([]);
    }
  }, [contextProducts]);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({ name: '' });

  const handleInputChange = (e) => {
    setFormData({ name: e.target.value });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const newProduct = {
      id: Date.now(),
      name: formData.name.trim(),
    };

    setProducts([newProduct, ...products]);
    setFormData({ name: '' });
    setIsAddModalOpen(false);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({ name: p.name });
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    if (!editingProduct || !formData.name.trim()) return;

    setProducts(
      products.map((p) =>
        p.id === editingProduct.id ? { ...p, name: formData.name.trim() } : p
      )
    );

    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Product</h1>
          <p className="text-sm text-slate-500 mt-1">
            Product catalog and item management
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-xs"
            />
          </div>

          {/* Add Product Button */}
          <button
            onClick={() => {
              setFormData({ name: '' });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm active:scale-[0.98] transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-16">
                  #
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  PRODUCT NAME
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider w-36 text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map((p, idx) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* # */}
                  <td className="py-4 px-6 font-mono text-slate-400 text-xs font-medium">
                    {idx + 1}
                  </td>

                  {/* Product Name */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                        <Boxes size={16} />
                      </div>
                      <p className="font-semibold text-slate-900 text-sm">
                        {p.name}
                      </p>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(p)}
                        title="Edit Product"
                        className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        onClick={() => handleDelete(p.id)}
                        title="Delete Product"
                        className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-12 text-slate-400 text-sm">
                    No products found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal 1: Add New Product ── */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add Product"
          width="max-w-xl"
        >
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 30-Shot Multi Color Aerial Fountain"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-sm cursor-pointer"
              >
                Save Product
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Modal 2: Edit Product ── */}
      {isEditModalOpen && editingProduct && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Product - ${editingProduct.name}`}
          width="max-w-xl"
        >
          <form onSubmit={handleUpdateProduct} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-all shadow-sm cursor-pointer"
              >
                Update Product
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Products;
