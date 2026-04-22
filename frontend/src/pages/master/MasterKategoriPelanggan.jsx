import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import ModalDialog from '../../components/ui/ModalDialog';
import Swal from 'sweetalert2';
import { FiUsers, FiTag, FiPercent, FiPlus, FiTrash2 } from 'react-icons/fi';

export default function MasterKategoriPelanggan() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ id: null, nama_kategori: '', potongan_persen: 0 });

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/master/kategori-pelanggan');
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
      setFormData({ id: null, nama_kategori: '', potongan_persen: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nama_kategori) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Category Name is a required field.',
        confirmButtonColor: '#7F56D9'
      });
      return;
    }

    setIsSubmitting(true);
    const url = isEditing 
      ? `http://localhost:8080/api/master/kategori-pelanggan/${formData.id}` 
      : 'http://localhost:8080/api/master/kategori-pelanggan';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (result.status) {
        Swal.fire({
          icon: 'success',
          title: 'Synchronized',
          text: 'Loyalty tier has been successfully updated.',
          showConfirmButton: false,
          timer: 1500
        });
        setIsModalOpen(false);
        fetchItems();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Sync Failure',
          text: result.message,
          confirmButtonColor: '#7F56D9'
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'System Error',
        text: 'Persistence infrastructure is currently restricted.',
        confirmButtonColor: '#7F56D9'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Authorize Purge?',
      text: "This loyalty tier and its associated discount structures will be removed.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#D92D20',
      cancelButtonColor: '#98A2B3',
      confirmButtonText: 'Confirm Deletion',
      cancelButtonText: 'Abort'
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:8080/api/master/kategori-pelanggan/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.status) {
          Swal.fire({
            icon: 'success',
            title: 'Purged',
            text: 'Tier data has been successfully removed.',
            timer: 1500,
            showConfirmButton: false
          });
          fetchItems();
        }
      } catch (err) {
        Swal.fire('Error!', 'Failed to terminate tier record.', 'error');
      }
    }
  };

  const columns = [
    { label: 'Tier Designation', key: 'nama_kategori', render: (val) => (
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-xs">{val}</span>
        <span className="text-[10px] text-gray-500 font-medium tracking-tight">LOYALTY PROGRAM TIER</span>
      </div>
    )},
    { label: 'Discount Matrix', key: 'potongan_persen', width: '180px', align: 'center', render: (val) => (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300 border border-success-200 dark:border-success-800 rounded-full text-[10px] font-bold uppercase tracking-tight">
        <FiPercent size={10} /> {val}% Adjustment
      </span>
    )},
    { label: '', key: 'aksi', align: 'right', width: '80px', render: (_, item) => (
      <div className="flex gap-1 justify-end">
        <button onClick={() => handleOpenModal(item)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all"><FiTag size={16} /></button>
        <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-all"><FiTrash2 size={16} /></button>
      </div>
    ) }
  ];

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-20">
      <SectionHeader 
        title="Customer Segments" 
        subtitle="Manage loyalty tiers and dynamic discount structures for patient groups."
        icon={<FiUsers size={24} className="text-gray-500" />}
      />

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
        <DataTable 
          data={data}
          columns={columns}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Filter tier keywords..."
          primaryAction={{ label: "Add Tier", onClick: () => handleOpenModal() }}
        />
      </div>

      <ModalDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Modify Loyalty Tier' : 'Tier Registration'}
        subtitle="Establishing discount matrixes for customer groups."
        icon={<FiUsers />}
        maxWidth="max-w-md"
      >
        <div className="p-8 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <FiUsers className="text-primary-600" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Tier Attributes</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tier Designation <span className="text-red-500 font-bold">*</span></label>
                <input 
                  type="text" 
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-semibold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none uppercase" 
                  value={formData.nama_kategori} 
                  onChange={(e) => setFormData({...formData, nama_kategori: e.target.value})} 
                  placeholder="Ex: PREMIUM MEMBER" 
                />
              </div>
              <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Adjustment Percentage (%)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg pl-3 pr-10 py-2 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none" 
                    value={formData.potongan_persen} 
                    onChange={(e) => setFormData({...formData, potongan_persen: e.target.value})} 
                    placeholder="0" 
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-xs">%</div>
                </div>
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
              {isSubmitting ? 'Syncing...' : 'Save Tier Record'}
            </button>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
}
