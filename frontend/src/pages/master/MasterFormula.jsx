import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import ModalDialog from '../../components/ui/ModalDialog';
import { FiPlus, FiTrash2, FiActivity, FiLayers, FiInfo, FiSearch } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function MasterFormula() {
  const [formulas, setFormulas] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    nama_formula: '',
    produk_id: '',
    keterangan: '',
    items: []
  });

  const fetchFormulas = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/master/formula');
      const result = await response.json();
      if (result.status) setFormulas(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/produk');
      const result = await response.json();
      if (result.status) setProducts(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFormulas();
    fetchProducts();
  }, []);

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { produk_id: '', jumlah_formula: 1, satuan_id: 1 }]
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.nama_formula || !formData.produk_id || formData.items.length === 0) {
      Swal.fire('Validation Error', 'Please complete the formula header and add at least one ingredient.', 'warning');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/master/formula', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (result.status) {
        Swal.fire('Success', 'Formula created successfully', 'success');
        setIsModalOpen(false);
        fetchFormulas();
      }
    } catch (err) {
      Swal.fire('Error', 'Failed to save formula', 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirm.isConfirmed) {
      try {
        await fetch(`http://localhost:8080/api/master/formula/${id}`, { method: 'DELETE' });
        Swal.fire('Deleted!', 'Formula has been deleted.', 'success');
        fetchFormulas();
      } catch (err) {
        Swal.fire('Error', 'Failed to delete formula', 'error');
      }
    }
  };

  const columns = [
    { label: 'Formula Name', key: 'nama_formula', render: (val) => <span className="font-semibold text-gray-900">{val}</span> },
    { label: 'Resulting Product', key: 'hasil_produk', render: (val) => <span className="text-primary-600 font-medium uppercase text-xs">{val}</span> },
    { label: 'Created At', key: 'created_at', render: (val) => <span className="text-xs text-gray-500">{new Date(val).toLocaleDateString()}</span> },
    { label: 'Action', key: 'id', align: 'right', render: (id) => (
      <button onClick={() => handleDelete(id)} className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-gray-50 transition-all">
        <FiTrash2 size={16} />
      </button>
    )}
  ];

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-20">
      <SectionHeader 
        title="Drug Compounding Formulas" 
        subtitle="Manage master recipes for compounded pharmaceuticals and ingredient ratios."
        icon={<FiLayers size={24} className="text-gray-500" />}
      />

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <DataTable 
          data={formulas}
          columns={columns}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          primaryAction={{
            label: "Define New Formula",
            onClick: () => {
              setFormData({ nama_formula: '', produk_id: '', keterangan: '', items: [] });
              setIsModalOpen(true);
            }
          }}
        />
      </div>

      <ModalDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Formula Definition Wizard"
        subtitle="Specify ingredients and ratios for the resulting compounded product."
        maxWidth="max-w-3xl"
        icon={<FiActivity />}
      >
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase">Formula Target Product</label>
              <select 
                name="produk_id"
                value={formData.produk_id}
                onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-primary-500"
              >
                <option value="">Select Result Product...</option>
                {products.filter(p => p.tipe_produk === 'racika' || p.tipe_produk === 'obat').map(p => (
                  <option key={p.id} value={p.id}>{p.nama_produk}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase">Master Formula Name</label>
              <input 
                type="text"
                value={formData.nama_formula}
                onChange={(e) => setFormData({...formData, nama_formula: e.target.value})}
                placeholder="e.g., Capsule Flu Heavy Mix A"
                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-tight">Ingredient List</h4>
              <button onClick={handleAddItem} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-primary-600 rounded-lg text-[10px] font-bold uppercase hover:bg-primary-50 transition-all">
                <FiPlus size={14} /> Add Ingredient
              </button>
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <div className="col-span-6 space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Product</label>
                    <select 
                      value={item.produk_id}
                      onChange={(e) => handleItemChange(index, 'produk_id', e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-xs font-medium outline-none"
                    >
                      <option value="">Select Ingredient...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.nama_produk}</option>)}
                    </select>
                  </div>
                  <div className="col-span-4 space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Qty Ratio</label>
                    <input 
                      type="number"
                      value={item.jumlah_formula}
                      onChange={(e) => handleItemChange(index, 'jumlah_formula', e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-lg px-2 py-1.5 text-xs font-medium outline-none"
                    />
                  </div>
                  <div className="col-span-2 pt-5">
                    <button onClick={() => handleRemoveItem(index)} className="w-full p-1.5 text-gray-400 hover:text-red-500 transition-all flex justify-center">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {formData.items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <FiLayers size={32} strokeWidth={1.5} className="mb-2 opacity-20" />
                  <span className="text-xs font-medium">No ingredients added yet.</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-xs font-bold uppercase text-gray-500 hover:bg-gray-100 rounded-lg transition-all">Discard</button>
            <button onClick={handleSubmit} className="px-10 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-[11px] uppercase rounded-lg shadow-sm transition-all active:scale-95">Save Master Formula</button>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
}
