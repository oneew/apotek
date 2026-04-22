import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import ModalDialog from '../../components/ui/ModalDialog';
import { FiPlus, FiEdit2, FiTrash2, FiHome } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function MasterGudang() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ id: null, kode_gudang: '', nama_gudang: '', alamat: '', status: 'Aktif' });

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/master/gudang');
      const result = await response.json();
      if (result.status) setData(result.data);
    } catch (err) {
      console.error(err);
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
      setFormData({ id: null, kode_gudang: '', nama_gudang: '', alamat: '', status: 'Aktif' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nama_gudang || !formData.kode_gudang) {
      Swal.fire({ title: 'Opps!', text: 'Kode dan Nama Gudang wajib diisi', icon: 'warning', customClass: { popup: 'rounded-3xl' } });
      return;
    }

    setIsSubmitting(true);
    const url = isEditing 
      ? `http://localhost:8080/api/master/gudang/${formData.id}` 
      : 'http://localhost:8080/api/master/gudang';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (result.status) {
        Swal.fire({ title: 'Berhasil!', text: result.message, icon: 'success', timer: 1500, showConfirmButton: false, customClass: { popup: 'rounded-3xl' } });
        setIsModalOpen(false);
        fetchItems();
      } else {
        Swal.fire({ title: 'Gagal!', text: result.message, icon: 'error', customClass: { popup: 'rounded-3xl' } });
      }
    } catch (err) {
      Swal.fire({ title: 'Error!', text: 'Gagal memproses data', icon: 'error', customClass: { popup: 'rounded-3xl' } });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Hapus Gudang?',
      text: "Seluruh data stok di gudang ini mungkin terpengaruh.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8B5CF6',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      customClass: { popup: 'rounded-3xl' }
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:8080/api/master/gudang/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.status) {
          Swal.fire({ title: 'Terhapus!', text: result.message, icon: 'success', timer: 1200, showConfirmButton: false, customClass: { popup: 'rounded-3xl' } });
          fetchItems();
        }
      } catch (err) {
        Swal.fire({ title: 'Error!', text: 'Gagal menghapus data', icon: 'error', customClass: { popup: 'rounded-3xl' } });
      }
    }
  };

  const columns = [
    { label: 'Warehouse Code', key: 'kode_gudang', width: '150px', render: (val) => <span className="font-semibold text-primary-700">{val}</span> },
    { label: 'Warehouse Name', key: 'nama_gudang', render: (val) => (
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-xs">{val}</span>
        <span className="text-[10px] text-gray-500 font-medium tracking-tight">PHYSICAL STORAGE FACILITY</span>
      </div>
    )},
    { label: 'Location / Address', key: 'alamat', render: (val) => <span className="text-gray-500 font-medium text-[11px] italic">{val || '-'}</span> },
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
        title="Physical Warehousing" 
        subtitle="Manage physical storage locations and pharmaceutical logistics hubs."
        icon={<FiHome size={24} className="text-gray-500" />}
      />

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
        <DataTable 
          data={data}
          columns={columns}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Filter warehouse repository..."
          primaryAction={{ label: "Add Warehouse", onClick: () => handleOpenModal() }}
        />
      </div>

      <ModalDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Modify Facility Signature' : 'Facility Registration'}
        subtitle="Ensure logical mapping of physical inventory locations."
        icon={<FiHome />}
        maxWidth="max-w-xl"
      >
        <div className="p-8 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <FiHome className="text-primary-600" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Facility Attributes</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Warehouse Code</label>
                <input type="text" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-semibold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none uppercase font-mono" value={formData.kode_gudang} onChange={(e) => setFormData({...formData, kode_gudang: e.target.value})} placeholder="GDG-01" />
              </div>
              <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Warehouse Name</label>
                <input type="text" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-semibold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none" value={formData.nama_gudang} onChange={(e) => setFormData({...formData, nama_gudang: e.target.value})} placeholder="Gudang Utama" />
              </div>
            </div>
            <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Address</label>
              <textarea className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none resize-none" value={formData.alamat} onChange={(e) => setFormData({...formData, alamat: e.target.value})} placeholder="Location details..." rows="3" />
            </div>
            <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Operational Status</label>
              <select className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-semibold outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all appearance-none cursor-pointer" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option value="Aktif">Aktif</option>
                <option value="Non-Aktif">Non-Aktif</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-all">Cancel</button>
            <button 
              onClick={handleSave} 
              disabled={isSubmitting}
              className="px-10 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Syncing...' : 'Save Warehouse'}
            </button>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
}
