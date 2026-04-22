import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import ModalDialog from '../../components/ui/ModalDialog';
import { FiPlus, FiEdit2, FiTrash2, FiBox, FiTag } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function MasterSatuan() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({ id: null, kode_satuan: '', nama_satuan: '', keterangan: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/master/satuan');
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
      setFormData({ id: null, kode_satuan: '', nama_satuan: '', keterangan: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.nama_satuan) {
      Swal.fire({ title: 'Operational Halt', text: 'Unit Name is a required field.', icon: 'warning', confirmButtonColor: '#7F56D9' });
      return;
    }

    setIsSubmitting(true);
    const url = isEditing 
      ? `http://localhost:8080/api/master/satuan/${formData.id}` 
      : 'http://localhost:8080/api/master/satuan';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (result.status) {
        Swal.fire({ title: 'Success', text: 'Unit specification has been synchronized.', icon: 'success', timer: 1500, showConfirmButton: false });
        setIsModalOpen(false);
        fetchItems();
      } else {
        Swal.fire({ title: 'Constraint Violation', text: result.message, icon: 'error' });
      }
    } catch (err) {
      Swal.fire({ title: 'Sync Error', text: 'Infrastructure is currently unresponsive.', icon: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Authorize Deletion?',
      text: "This asset unit will be permanently removed from the ledger.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#D92D20',
      cancelButtonColor: '#98A2B3',
      confirmButtonText: 'Confirm Deletion',
      cancelButtonText: 'Abort'
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:8080/api/master/satuan/${id}`, { method: 'DELETE' });
        const result = await response.json();
        if (result.status) {
          Swal.fire({ title: 'Removed', text: 'Unit entry has been purged.', icon: 'success', timer: 1200, showConfirmButton: false });
          fetchItems();
        }
      } catch (err) {
        Swal.fire({ title: 'Purge Failed', text: 'Security constraints prevented deletion.', icon: 'error' });
      }
    }
  };

  const columns = [
    { label: 'Identifier', key: 'kode_satuan', width: '150px', render: (val) => <span className="font-semibold text-primary-700">{val || 'N/A'}</span> },
    { label: 'Unit Specification', key: 'nama_satuan', render: (val) => (
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-xs">{val}</span>
        <span className="text-[10px] text-gray-500 font-medium tracking-tight">MEASUREMENT UNIT</span>
      </div>
    )},
    { label: 'Context / Description', key: 'keterangan', render: (val) => <span className="text-gray-500 font-medium text-[11px] leading-relaxed italic">{val || '-'}</span> },
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
        title="Inventory Units" 
        subtitle="Manage measurement standards for product packaging and dispensing volume."
        icon={<FiBox size={24} className="text-gray-500" />}
      />

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
        <DataTable 
          data={data}
          columns={columns}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Filter logic by unit keyword..."
          primaryAction={{ label: "Add Unit", onClick: () => handleOpenModal() }}
        />
      </div>

      <ModalDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Modify Specification' : 'Unit Registration'}
        subtitle="Establishing measurement baselines for the inventory repository."
        icon={<FiTag />}
        maxWidth="max-w-xl"
      >
        <div className="p-8 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <FiTag className="text-primary-600" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Unit Attributes</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">System Identifier (Code)</label>
                <input 
                  type="text" 
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-semibold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none uppercase font-mono" 
                  value={formData.kode_satuan} 
                  onChange={(e) => setFormData({...formData, kode_satuan: e.target.value})} 
                  placeholder="Ex: UNT-01" 
                />
              </div>
              <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Unit Signature Name <span className="text-red-500 font-bold">*</span></label>
                <input 
                  type="text" 
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-semibold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none" 
                  value={formData.nama_satuan} 
                  onChange={(e) => setFormData({...formData, nama_satuan: e.target.value})} 
                  placeholder="Ex: Bottle, Tablet, Box" 
                />
              </div>
              <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Operational Context</label>
                <textarea 
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none resize-none" 
                  value={formData.keterangan} 
                  onChange={(e) => setFormData({...formData, keterangan: e.target.value})} 
                  placeholder="Additional narrative for this unit..." 
                  rows="3" 
                />
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
              {isSubmitting ? 'Syncing...' : 'Save Unit Record'}
            </button>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
}
