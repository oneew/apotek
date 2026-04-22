import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import ModalDialog from '../../components/ui/ModalDialog';
import { FiActivity, FiEdit2, FiPlus, FiTrash2, FiThermometer } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function ProdukLab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ id: null, kode_produk: '', nama_produk: '', harga: '', status: 'Aktif' });

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/master/produk-lab');
      const result = await response.json();
      if (result.status) setData(result.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setIsEditing(true);
      setFormData({ ...item });
    } else {
      setIsEditing(false);
      setFormData({ id: null, kode_produk: '', nama_produk: '', harga: '', status: 'Aktif' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nama_produk || !formData.harga) {
      Swal.fire('Oops!', 'Nama Produk dan Harga wajib diisi', 'warning');
      return;
    }

    setIsSubmitting(true);
    const url = isEditing 
      ? `http://localhost:8080/api/master/produk-lab/${formData.id}` 
      : 'http://localhost:8080/api/master/produk-lab';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (result.status) {
        Swal.fire('Berhasil!', result.message, 'success');
        setIsModalOpen(false);
        fetchItems();
      } else {
        Swal.fire('Gagal!', result.message, 'error');
      }
    } catch (err) {
      Swal.fire('Error!', 'Terjadi kesalahan sistem', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Apakah anda yakin?',
      text: "Data ini akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:8080/api/master/produk-lab/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.status) {
          Swal.fire('Terhapus!', result.message, 'success');
          fetchItems();
        }
      } catch (err) {
        Swal.fire('Error!', 'Gagal menghapus data', 'error');
      }
    }
  };

  const columns = [
    { label: 'Identifier', key: 'kode_produk', width: '150px', render: (val) => <span className="font-semibold text-primary-700">{val || 'N/A'}</span> },
    { label: 'Lab Product Name', key: 'nama_produk', render: (val) => (
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-xs">{val}</span>
        <span className="text-[10px] text-gray-500 font-medium tracking-tight">DIAGNOSTIC TEST REPOSITORY</span>
      </div>
    )},
    { label: 'Standard Fee', key: 'harga', width: '180px', align: 'right', render: (val) => (
      <span className="font-bold text-gray-900 dark:text-gray-100 tabular-nums">
        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)}
      </span>
    )},
    { label: 'Status', key: 'status', align: 'center', width: '120px', render: (val) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${val === 'Aktif' ? 'bg-success-50 text-success-700 border border-success-200' : 'bg-error-50 text-error-700 border border-error-200'}`}>
        {val}
      </span>
    ) },
    { label: '', key: 'aksi', align: 'right', width: '80px', render: (_, item) => (
      <div className="flex gap-1 justify-end">
        <button onClick={() => handleOpenModal(item)} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-all rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"><FiEdit2 size={16} /></button>
        <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-error-600 transition-all rounded-lg hover:bg-error-50 dark:hover:bg-error-900/20"><FiTrash2 size={16} /></button>
      </div>
    ) }
  ];

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-20">
      <SectionHeader 
        title="Diagnostic Products" 
        subtitle="Manage laboratory test items and diagnostic checkup services fee structures."
        icon={<FiThermometer size={24} className="text-gray-500" />}
      />

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
        <DataTable 
          data={data}
          columns={columns}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Filter diagnostic catalog..."
          primaryAction={{ label: "Add Diagnostic Item", onClick: () => handleOpenModal() }}
        />
      </div>

      <ModalDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Modify Test Identity' : 'Test Registration'}
        subtitle="Establishing boundaries for diagnostic laboratory services."
        icon={<FiThermometer />}
        maxWidth="max-w-xl"
      >
        <div className="p-8 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <FiThermometer className="text-primary-600" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Test Attributes</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Identifier (Code)</label>
                <input 
                  type="text" 
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-semibold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none uppercase font-mono" 
                  value={formData.kode_produk} 
                  onChange={(e) => setFormData({...formData, kode_produk: e.target.value})} 
                  placeholder="Ex: LAB-GDA" 
                />
              </div>
              <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Formal Test Designation <span className="text-red-500 font-bold">*</span></label>
                <input 
                  type="text" 
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-semibold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none" 
                  value={formData.nama_produk} 
                  onChange={(e) => setFormData({...formData, nama_produk: e.target.value})} 
                  placeholder="Ex: Gula Darah Acak" 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Standard Service Fee (IDR)</label>
                <input 
                  type="number" 
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none" 
                  value={formData.harga} 
                  onChange={(e) => setFormData({...formData, harga: e.target.value})} 
                  placeholder="50000" 
                />
              </div>
              <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Operational Integrity</label>
                <select 
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all appearance-none cursor-pointer" 
                  value={formData.status} 
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Non-Aktif">Non-Aktif</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button className="px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-all" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button 
              className="px-10 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50" 
              onClick={handleSave} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Syncing...' : 'Save Diagnostic Item'}
            </button>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
}
