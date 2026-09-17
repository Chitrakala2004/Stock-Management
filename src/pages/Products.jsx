import { useState } from 'react';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Download,
  Package,
  AlertTriangle,
  Tag,
  IndianRupee,
  Building2,
  BarChart2,
  Boxes,
} from 'lucide-react';
import Modal from '../components/Modal';

const initialProducts = [
  { id: 1, name: '10cm Electric Sparklers (10 Pkts Box)', sku: 'CRK-SPK-01', company: 'Standard Fireworks Ltd', price: '₹1,200.00', stock: 150, unit: 'Cases', minStock: 30, status: 'In Stock' },
  { id: 2, name: 'Ground Chakkar Deluxe (20 Pcs Carton)', sku: 'CRK-CHK-02', company: 'Sri Kaliswari Fireworks', price: '₹2,400.00', stock: 80, unit: 'Cases', minStock: 20, status: 'In Stock' },
  { id: 3, name: 'Special Flower Pots (Large 10 Pcs)', sku: 'CRK-POT-01', company: 'Coronation Fireworks', price: '₹1,850.00', stock: 45, unit: 'Cases', minStock: 15, status: 'In Stock' },
  { id: 4, name: '30-Shot Multi Color Aerial Fountain', sku: 'CRK-AER-30', company: 'Vadivel Pyrotechnics', price: '₹4,500.00', stock: 8, unit: 'Cases', minStock: 10, status: 'Low Stock' },
  { id: 5, name: 'Hydro Atom Bomb (Super Sound)', sku: 'CRK-BMB-05', company: 'Metal Powder Crackers Co.', price: '₹1,600.00', stock: 120, unit: 'Cases', minStock: 25, status: 'In Stock' },
  { id: 6, name: 'Whistling Rockets (25 Pcs Pack)', sku: 'CRK-RKT-03', company: 'Ayyan Fireworks', price: '₹2,100.00', stock: 6, unit: 'Cases', minStock: 15, status: 'Low Stock' },
  { id: 7, name: 'Deepavali Family Gift Box (25 Items)', sku: 'CRK-GFT-25', company: 'Standard Fireworks Ltd', price: '₹3,800.00', stock: 65, unit: 'Boxes', minStock: 15, status: 'In Stock' },
];

const companiesList = [
  'Standard Fireworks Ltd',
  'Sri Kaliswari Fireworks',
  'Coronation Fireworks',
  'Vadivel Pyrotechnics',
  'Metal Powder Crackers Co.',
  'Ayyan Fireworks',
];

const Products = () => {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [filterCompany, setFilterCompany] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    company: 'Standard Fireworks Ltd',
    price: '',
    stock: '',
    unit: 'Cases',
    minStock: '10',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) return;

    const stockNum = parseInt(formData.stock, 10) || 0;
    const minStockNum = parseInt(formData.minStock, 10) || 10;
    const priceNum = parseFloat(formData.price) || 0;

    const newProduct = {
      id: Date.now(),
      name: formData.name,
      sku: formData.sku ? formData.sku.toUpperCase() : `CRK-${Math.floor(100 + Math.random() * 900)}`,
      company: formData.company,
      price: `₹${priceNum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      stock: stockNum,
      unit: formData.unit || 'Cases',
      minStock: minStockNum,
      status: stockNum <= minStockNum ? 'Low Stock' : 'In Stock',
    };

    setProducts([newProduct, ...products]);
    setFormData({
      name: '',
      sku: '',
      company: 'Standard Fireworks Ltd',
      price: '',
      stock: '',
      unit: 'Cases',
      minStock: '10',
    });
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this crackers item?')) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.company.toLowerCase().includes(search.toLowerCase());
    const matchCompany = filterCompany === 'All' || p.company === filterCompany;
    return matchSearch && matchCompany;
  });

  const getStockBarWidth = (stock, minStock) => {
    const ratio = Math.min(stock / (minStock * 5), 1);
    return `${ratio * 100}%`;
  };

  const getStockBarColor = (stock, minStock) => {
    if (stock <= minStock) return 'bg-red-400';
    if (stock <= minStock * 2) return 'bg-amber-400';
    return 'bg-green-400';
  };

  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;
  const uniqueCompanies = Array.from(new Set(products.map((p) => p.company))).length;

  const stats = [
    { label: 'TOTAL CRACKERS ITEMS', value: products.length.toString(), subtitle: 'Products in inventory', color: 'text-gray-900' },
    { label: 'FIREWORKS MANUFACTURERS', value: uniqueCompanies.toString(), subtitle: 'Brand suppliers', color: 'text-blue-600' },
    { label: 'LOW STOCK CRACKERS', value: lowStockCount.toString(), subtitle: 'Needs manufacturer order', color: 'text-amber-500' },
    { label: 'CRACKERS STOCK VALUE', value: '₹14,85,200.00', subtitle: 'Inventory valuation', color: 'text-green-600' },
  ];

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow duration-300">
            <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-3">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color} leading-tight`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1.5">{s.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-gray-900 text-[15px]">Crackers Inventory Stock</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search crackers item or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-56 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="All">All Manufacturers</option>
              {companiesList.map((comp) => (
                <option key={comp} value={comp}>{comp}</option>
              ))}
            </select>
            <button className="flex items-center gap-1.5 px-3 py-2 text-gray-600 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              <Download size={14} />
              Export
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm shadow-blue-200 cursor-pointer"
            >
              <Plus size={15} />
              Add Crackers Product
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">#</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">Crackers Product</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">Item Code</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">Manufacturer Company</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">Price / Case</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">Stock Level</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                  <td className="py-3.5 px-4 text-sm text-gray-400">{idx + 1}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                        <Boxes size={15} />
                      </div>
                      <p className="text-sm font-medium text-gray-900">{p.name}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[12px] font-mono text-gray-500">{p.sku}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <Building2 size={13} className="text-purple-500" />
                      <span className="text-xs font-medium text-gray-700">{p.company}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-sm font-semibold text-gray-900">{p.price}</td>
                  <td className="py-3.5 px-4">
                    <div className="w-32">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-800">{p.stock} {p.unit}</span>
                        {p.stock <= p.minStock && <AlertTriangle size={12} className="text-amber-500" />}
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${getStockBarColor(p.stock, p.minStock)}`}
                          style={{ width: getStockBarWidth(p.stock, p.minStock) }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${
                      p.status === 'In Stock' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Eye size={15} /></button>
                      <button className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"><Edit3 size={15} /></button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Crackers Product"
      >
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Crackers Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. 30-Shot Multi Color Aerial Fountain"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Item Code / SKU
              </label>
              <input
                type="text"
                name="sku"
                placeholder="e.g. CRK-AER-30"
                value={formData.sku}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Manufacturer Company <span className="text-red-500">*</span>
              </label>
              <select
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {companiesList.map((comp) => (
                  <option key={comp} value={comp}>{comp}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Price per Case (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                required
                placeholder="e.g. 4500"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Packaging Unit
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="Cases">Cases</option>
                <option value="Cartons">Cartons</option>
                <option value="Boxes">Boxes</option>
                <option value="Packs">Packs</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Initial Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                required
                placeholder="e.g. 50"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Minimum Alert Cases
              </label>
              <input
                type="number"
                name="minStock"
                placeholder="e.g. 10"
                value={formData.minStock}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all cursor-pointer"
            >
              Save Crackers Product
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;
