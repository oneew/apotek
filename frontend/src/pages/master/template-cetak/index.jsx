import React, { useState, useEffect } from 'react';
import SectionHeader from '../../../components/ui/SectionHeader';
import DataTable from '../../../components/ui/DataTable';
import { FiFileText, FiPlus, FiEdit2, FiTrash2, FiPrinter, FiCode, FiCheck } from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:8080/api';

export default function MasterTemplateCetak() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState({
    nama_template: '',
    kode_template: 'PO', // Default to PO
    content_html: '',
    is_default: false
  });

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`${API_BASE}/master/template-cetak`);
      if (resp.data.status) setData(resp.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const method = selectedId ? 'put' : 'post';
      const url = selectedId ? `${API_BASE}/master/template-cetak/${selectedId}` : `${API_BASE}/master/template-cetak`;
      const resp = await axios[method](url, formData);
      if (resp.data.status) {
        Swal.fire('Berhasil', resp.data.message, 'success');
        setIsModalOpen(false);
        fetchTemplates();
      }
    } catch (err) {
        Swal.fire('Error', 'Gagal menyimpan template', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Template?',
      text: "Aksi ini tidak dapat dibatalkan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus'
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE}/master/template-cetak/${id}`);
        fetchTemplates();
        Swal.fire('Terhapus', 'Template berhasil dihapus', 'success');
      } catch (err) { console.error(err); }
    }
  };

  const columns = [
    { key: 'no', label: 'No.', width: '60px', render: (_, __, i) => i + 1 },
    { key: 'nama_template', label: 'Nama Template' },
    { key: 'kode_template', label: 'Kategori', render: (val) => <span className="font-bold text-[10px] bg-gray-100 px-2 py-0.5 rounded">{val}</span> },
    { 
      key: 'is_default', 
      label: 'Default',
      render: (val) => val ? <FiCheck className="text-green-500" /> : '-'
    },
    { 
      key: 'actions', 
      label: 'Aksi',
      align: 'right',
      render: (_, row) => (
        <div className="flex justify-end gap-2">
          <button 
             onClick={() => {
               setSelectedId(row.id);
               setFormData(row);
               setIsModalOpen(true);
             }}
             className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
          >
            <FiEdit2 size={14} />
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
            <FiTrash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-12 px-4">
      <SectionHeader 
        title="Master Template Cetak" 
        subtitle="Manajemen layout cetak untuk Faktur, PO, Struk, dll menggunakan HTML."
        icon={<FiPrinter size={24} className="text-primary-500" />}
      >
        <button 
           onClick={() => {
             setSelectedId(null);
             setFormData({ nama_template: '', kode_template: 'PO', content_html: '<html><body>...</body></html>', is_default: false });
             setIsModalOpen(true);
           }}
           className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow-sm"
        >
          <FiPlus /> Buat Template Baru
        </button>
      </SectionHeader>

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <DataTable columns={columns} data={data} loading={loading} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
               <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                 <FiCode /> {selectedId ? 'Edit Template' : 'Template Baru'}
               </h3>
               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">✕</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Template</label>
                    <input 
                      type="text" 
                      required
                      value={formData.nama_template} 
                      onChange={e => setFormData({...formData, nama_template: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary-500" 
                      placeholder="Contoh: Struk PO Standard"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kategori (Kode)</label>
                    <select 
                      value={formData.kode_template}
                      onChange={e => setFormData({...formData, kode_template: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none"
                    >
                        <option value="PO">Purchase Order (PO)</option>
                        <option value="INV">Sales Invoice (INV)</option>
                        <option value="STR">Struk Kecil (POS)</option>
                        <option value="RSP">Etiket Resep</option>
                    </select>
                  </div>
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">HTML Content</label>
                  <textarea 
                    value={formData.content_html}
                    onChange={e => setFormData({...formData, content_html: e.target.value})}
                    className="w-full h-80 bg-gray-900 text-emerald-400 font-mono text-xs p-4 rounded-xl border border-gray-800 outline-none"
                    placeholder="<html>..."
                  />
                  <p className="text-[10px] text-gray-400 italic">Gunakan placeholder seperti {"{{no_po}}"}, {"{{tanggal}}"}, {"{{items}}"}</p>
               </div>
               <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="is_default"
                    checked={formData.is_default}
                    onChange={e => setFormData({...formData, is_default: e.target.checked})}
                  />
                  <label htmlFor="is_default" className="text-xs font-bold text-gray-600">Jadikan template default untuk kategori ini</label>
               </div>

               <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-lg">Batal</button>
                  <button type="submit" className="px-8 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-primary-500/20">Simpan Template</button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
