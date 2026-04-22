import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import ModalDialog from '../../components/ui/ModalDialog';
import { FiPlus, FiEdit2, FiTrash2, FiTag, FiHash, FiInfo } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function MasterKategori() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({ id: null, kode_kategori: '', nama_kategori: '', keterangan: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/master/kategori');
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
      setFormData({ id: null, kode_kategori: '', nama_kategori: '', keterangan: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nama_kategori) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Failed',
        text: 'Category name is required for registration.',
        confirmButtonColor: '#7F56D9'
      });
      return;
    }

    setIsSubmitting(true);
    const url = isEditing 
      ? `http://localhost:8080/api/master/kategori/${formData.id}` 
      : 'http://localhost:8080/api/master/kategori';
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
          title: 'Success',
          text: result.message,
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'rounded-xl' }
        });
        setIsModalOpen(false);
        fetchItems();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: result.message,
          confirmButtonColor: '#D92D20'
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'System could not reach API gateway.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Delete Category?',
      text: "This action cannot be undone and may affect product classification.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#D92D20',
      cancelButtonColor: '#667085',
      confirmButtonText: 'Yes, Delete Content',
      cancelButtonText: 'Cancel'
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:8080/api/master/kategori/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.status) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted',
            text: result.message,
            timer: 1500,
            showConfirmButton: false
          });
          fetchItems();
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Action Failed',
          text: 'Security override: Data protected or network failure.'
        });
      }
    }
  };

  const columns = [
    { label: 'Category ID', key: 'kode_kategori', width: '150px', render: (val) => <span className="font-semibold text-primary-700">{val || 'N/A'}</span> },
    { label: 'Display Name', key: 'nama_kategori', render: (val) => (
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-xs">{val}</span>
        <span className="text-[10px] text-gray-500 font-medium tracking-tight">CLASSIFICATION RECORD</span>
      </div>
    )},
    { label: 'Description', key: 'keterangan', render: (val) => <span className="text-gray-500 font-medium text-[11px] leading-relaxed">{val || 'No additional metadata...'}</span> },
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
        title="Category Architecture" 
        subtitle="Regulate and structure product taxonomies for accurate inventory management."
        icon={<FiTag size={24} className="text-gray-500" />}
      />

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
        <DataTable 
          data={data}
          columns={columns}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Filter category repository..."
          primaryAction={{ label: "Add Category", onClick: () => handleOpenModal() }}
        />
      </div>

      <ModalDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Modify Category Signature' : 'Register New Classification'}
        subtitle="Maintain consistency in product classification."
        icon={<FiHash />}
        maxWidth="max-w-xl"
      >
        <div className="p-8 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <FiTag className="text-primary-600" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Category Attributes</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Identifier Code</label>
                <input type="text" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-semibold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none uppercase font-mono" value={formData.kode_kategori} onChange={(e) => setFormData({...formData, kode_kategori: e.target.value})} placeholder="e.g. CAT-999" />
              </div>
              <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Classification Label</label>
                <input type="text" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-semibold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none" value={formData.nama_kategori} onChange={(e) => setFormData({...formData, nama_kategori: e.target.value})} placeholder="e.g. Critical Care" />
              </div>
              <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Internal Narrative</label>
                <textarea className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none resize-none" value={formData.keterangan} onChange={(e) => setFormData({...formData, keterangan: e.target.value})} placeholder="Optional metadata..." rows="3" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-all">Cancel</button>
            <button 
              onClick={handleSave} 
              disabled={isSubmitting}
              className="px-10 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Save Category'}
            </button>
          </div>
        </div>
      </ModalDialog>
    </div>

  );
}
