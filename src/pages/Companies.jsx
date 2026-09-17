import { useState } from 'react';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Download,
  Building2,
  User,
  Phone,
  Mail,
  FileText,
  Boxes,
} from 'lucide-react';
import Modal from '../components/Modal';

const initialCompanies = [
  { id: 1, name: 'Standard Fireworks Ltd', contact: 'A. Rajaratnam', phone: '9842145670', email: 'orders@standardfireworks.com', products: 28, totalBusiness: '₹12,50,000.00', gst: '33AABCS1234L1Z5', status: 'Active' },
  { id: 2, name: 'Sri Kaliswari Fireworks', contact: 'K. Shanmugam', phone: '9842367890', email: 'sales@kaliswarifireworks.com', products: 22, totalBusiness: '₹8,85,000.00', gst: '33AABCS5678M2Z3', status: 'Active' },
  { id: 3, name: 'Coronation Fireworks', contact: 'V. Sundaram', phone: '9123456790', email: 'info@coronationfireworks.com', products: 18, totalBusiness: '₹6,20,000.00', gst: '33AABCM9012N3Z1', status: 'Active' },
  { id: 4, name: 'Vadivel Pyrotechnics', contact: 'P. Vadivel', phone: '9988776655', email: 'contact@vadivelpyro.in', products: 14, totalBusiness: '₹4,90,000.00', gst: '33AABCP3456O4Z9', status: 'Active' },
  { id: 5, name: 'Metal Powder Crackers Co.', contact: 'M. Arumugam', phone: '9765432109', email: 'sales@metalpowdercrackers.com', products: 12, totalBusiness: '₹3,50,000.00', gst: '33AABCM7890P5Z2', status: 'Active' },
  { id: 6, name: 'Ayyan Fireworks', contact: 'S. Ayyanar', phone: '9654321098', email: 'support@ayyanfireworks.com', products: 16, totalBusiness: '₹5,10,000.00', gst: '33AABCA4321Q6Z8', status: 'Active' },
];

const Companies = () => {
  const [companies, setCompanies] = useState(initialCompanies);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    phone: '',
    email: '',
    gst: '',
    status: 'Active',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCompany = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    const newCompany = {
      id: Date.now(),
      name: formData.name,
      contact: formData.contact || 'N/A',
      phone: formData.phone,
      email: formData.email || 'N/A',
      gst: formData.gst ? formData.gst.toUpperCase() : 'N/A',
      products: 0,
      totalBusiness: '₹0.00',
      status: formData.status,
    };

    setCompanies([newCompany, ...companies]);
    setFormData({ name: '', contact: '', phone: '', email: '', gst: '', status: 'Active' });
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this manufacturer company?')) {
      setCompanies(companies.filter((c) => c.id !== id));
    }
  };

  const filtered = companies.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.contact.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const activeCount = companies.filter((c) => c.status === 'Active').length;
  const totalProducts = companies.reduce((acc, c) => acc + c.products, 0);

  const stats = [
    { label: 'FIREWORKS MANUFACTURERS', value: companies.length.toString(), subtitle: 'Registered suppliers', color: 'text-gray-900' },
    { label: 'ACTIVE BRANDS', value: activeCount.toString(), subtitle: 'Supplying this season', color: 'text-green-600' },
    { label: 'TOTAL CRACKERS VARIETIES', value: totalProducts.toString(), subtitle: 'Across all manufacturers', color: 'text-blue-600' },
    { label: 'MANUFACTURER PROCUREMENT', value: '₹41,05,000.00', subtitle: 'Total stock purchase', color: 'text-purple-600' },
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
          <h3 className="font-semibold text-gray-900 text-[15px]">Fireworks Manufacturer Companies</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search manufacturer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-56 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-1 py-1">
              {['All', 'Active', 'Inactive'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    filterStatus === s ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 text-gray-600 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              <Download size={14} />
              Export
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm shadow-blue-200 cursor-pointer"
            >
              <Plus size={15} />
              Add Company
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">#</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">Manufacturer Company</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">Contact Person</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">Phone</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">GST No.</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">Crackers Items</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">Total Procurement</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">Status</th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, idx) => (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors">
                  <td className="py-3.5 px-4 text-sm text-gray-400">{idx + 1}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                        <Building2 size={15} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{c.name}</p>
                        <p className="text-[11px] text-gray-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-sm text-gray-700">{c.contact}</td>
                  <td className="py-3.5 px-4 text-sm text-gray-600">{c.phone}</td>
                  <td className="py-3.5 px-4 text-[12px] font-mono text-gray-500">{c.gst}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">{c.products} Items</span>
                  </td>
                  <td className="py-3.5 px-4 text-sm font-semibold text-gray-900">{c.totalBusiness}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${
                      c.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Eye size={15} /></button>
                      <button className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"><Edit3 size={15} /></button>
                      <button
                        onClick={() => handleDelete(c.id)}
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

      {/* Add Company Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Fireworks Manufacturer Company"
      >
        <form onSubmit={handleAddCompany} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Manufacturer Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Standard Fireworks Ltd"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Contact Representative
              </label>
              <input
                type="text"
                name="contact"
                placeholder="e.g. Shanmugam"
                value={formData.contact}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="e.g. 9842145670"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="e.g. sales@manufacturer.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                GST Number
              </label>
              <input
                type="text"
                name="gst"
                placeholder="e.g. 33AABCS1234L1Z5"
                value={formData.gst}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-mono"
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
              Save Company
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Companies;
