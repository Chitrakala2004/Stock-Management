import { useState, useEffect } from 'react';
import { useStock } from '../context/StockContext';
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Building2,
  MapPin,
  FileText,
} from 'lucide-react';
import Modal from '../components/Modal';

const Companies = () => {
  const { brands = [], addBrand, updateBrand, deleteBrand } = useStock();
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    if (brands && brands.length > 0) {
      setCompanies(
        brands.map((b, idx) => ({
          id: b._id || b.id || idx + 1,
          name: typeof b === 'string' ? b : b.name,
          address: (typeof b === 'object' && b.address) ? b.address : 'Sivakasi, Tamil Nadu',
          gst: (typeof b === 'object' && b.gst) ? b.gst : 'N/A',
        }))
      );
    } else {
      setCompanies([]);
    }
  }, [brands]);
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    gst: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const payload = {
      name: formData.name.toUpperCase(),
      address: formData.address || 'Sivakasi, Tamil Nadu',
      gst: formData.gst ? formData.gst.toUpperCase() : 'N/A',
    };

    if (addBrand) {
      await addBrand(payload);
    }

    setFormData({ name: '', address: '', gst: '' });
    setIsAddModalOpen(false);
  };

  const openEditModal = (comp) => {
    setEditingCompany(comp);
    setFormData({
      name: comp.name,
      address: comp.address,
      gst: comp.gst,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    if (!editingCompany || !formData.name) return;

    const updatePayload = {
      name: formData.name.toUpperCase(),
      address: formData.address,
      gst: formData.gst.toUpperCase(),
    };

    if (updateBrand) {
      await updateBrand(editingCompany.id, updatePayload);
    }

    setCompanies(
      companies.map((c) =>
        c.id === editingCompany.id ? { ...c, ...updatePayload } : c
      )
    );

    setIsEditModalOpen(false);
    setEditingCompany(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      if (deleteBrand) {
        await deleteBrand(id);
      }
      setCompanies(companies.filter((c) => c.id !== id));
    }
  };

  const filtered = companies.filter((c) => {
    const query = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(query) ||
      c.address.toLowerCase().includes(query) ||
      c.gst.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Company</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">
            Registered supplier & manufacturer company directory
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:flex-initial">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search company or GSTIN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-xs"
            />
          </div>

          {/* Add New Company Button */}
          <button
            onClick={() => {
              setFormData({ name: '', address: '', gst: '' });
              setIsAddModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm active:scale-[0.98] transition-all shadow-sm shadow-blue-500/20 cursor-pointer w-full sm:w-auto"
          >
            <Plus size={16} />
            Add New Company
          </button>
        </div>
      </div>

      {/* Companies Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  #
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  COMPANY NAME
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  ADDRESS
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  GSTIN
                </th>
                <th className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map((c, idx) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* # */}
                  <td className="py-4 px-6 font-mono text-slate-400 text-xs font-medium">
                    {idx + 1}
                  </td>

                  {/* Company Name */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-xs shrink-0">
                        <Building2 size={16} />
                      </div>
                      <p className="font-bold text-slate-900 text-sm tracking-wide uppercase">
                        {c.name}
                      </p>
                    </div>
                  </td>

                  {/* Address */}
                  <td className="py-4 px-6 font-medium text-slate-700 text-xs">
                    {c.address}
                  </td>

                  {/* GSTIN */}
                  <td className="py-4 px-6 font-mono text-slate-700 text-xs font-semibold">
                    {c.gst}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(c)}
                        title="Edit Company"
                        className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        onClick={() => handleDelete(c.id)}
                        title="Delete Company"
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
                  <td colSpan="5" className="text-center py-12 text-slate-400 text-sm">
                    No companies found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal 1: Add New Company ── */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Company"
          width="max-w-xl"
        >
          <form onSubmit={handleAddCompany} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. STANDARD FIREWORKS LTD"
                value={formData.name}
                onChange={handleInputChange}
                name="name"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Main Factory Road, Sivakasi, Tamil Nadu - 626123"
                value={formData.address}
                onChange={handleInputChange}
                name="address"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                GSTIN
              </label>
              <input
                type="text"
                placeholder="e.g. 33AABCS1234L1Z5"
                value={formData.gst}
                onChange={handleInputChange}
                name="gst"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
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
                Save Company
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ── Modal 2: Edit Company ── */}
      {isEditModalOpen && editingCompany && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Edit Company - ${editingCompany.name}`}
          width="max-w-xl"
        >
          <form onSubmit={handleUpdateCompany} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                name="name"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={formData.address}
                onChange={handleInputChange}
                name="address"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                GSTIN
              </label>
              <input
                type="text"
                value={formData.gst}
                onChange={handleInputChange}
                name="gst"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm uppercase font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
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
                Update Company
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Companies;
