import React, { useState, useEffect } from 'react';
import SectionHeader from '../../../components/ui/SectionHeader';
import DataTable from '../../../components/ui/DataTable';
import { FiPlus, FiFilter, FiRefreshCw, FiTrash2, FiFileText } from 'react-icons/fi';
import Swal from 'sweetalert2';
import ModalTemplateRacikan from './ModalTemplateRacikan';

const API_BASE = 'http://localhost:8080/api';

export default function PelayananTemplateRacikan() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterWaktu, setFilterWaktu] = useState('Semua');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/master/template-racikan`);
      const result = await response.json();
      if (result.status) setData(result.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Template?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_BASE}/master/template-racikan/${id}`, { method: 'DELETE' });
        const res = await response.json();
        if (res.status) {
          Swal.fire('Terhapus!', 'Template berhasil dihapus.', 'success');
          fetchData();
        }
      } catch (e) {
        Swal.fire('Error', 'Terjadi kesalahan saat menghapus data', 'error');
      }
    }
  };

  const handleOpenDetail = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const columns = [
    { key: 'no', label: 'No.', width: '60px', render: (_, __, i) => i + 1 },
    { key: 'nama_template', label: 'Nama Template', render: (val) => <span className="font-bold text-gray-900">{val}</span> },
    { key: 'keterangan', label: 'Keterangan / Signa', render: (val) => <span className="text-gray-500 text-xs">{val || '-'}</span> },
    { key: 'jumlah_item', label: 'Jumlah Item Obat', align: 'center', render: (val) => <span className="font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-lg">{val} Item</span> },
    { key: 'pembuat', label: 'Dibuat Oleh', render: (val) => <span className="text-xs font-semibold text-gray-600">{val || 'Sistem'}</span> },
    { 
      key: 'actions', 
      label: 'Aksi', 
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => handleOpenDetail(row.id)}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            title="Lihat Detail"
          >
            <FiFileText size={16} />
          </button>
          <button 
            onClick={() => handleDelete(row.id)}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Hapus"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  const filteredData = data.filter(item => 
    item.nama_template?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.keterangan?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-unt-fade">
      <SectionHeader 
        title="Template Racikan" 
        subtitle="Manajemen resep racikan standar (Kompounding) untuk mempercepat pelayanan."
      >
        <button 
          onClick={() => { setSelectedId(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95"
        >
          <FiPlus /> Tambah Template Baru
        </button>
      </SectionHeader>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
           {/* Opsional filter dropdown */}
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          <select 
            value={filterWaktu} 
            onChange={e => setFilterWaktu(e.target.value)}
            className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-sm"
          >
            <option value="Semua">Semua Waktu</option>
            <option value="Bulan ini">Bulan ini</option>
            <option value="Tahun ini">Tahun ini</option>
          </select>
          <button 
            onClick={fetchData}
            className="flex flex-row items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 transition-colors whitespace-nowrap shadow-sm"
          >
            <FiRefreshCw size={16} className={isLoading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredData} 
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari nama template atau keterangan..."
      />

      {/* Rekap Banner */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden mt-6 flex justify-between items-center">
        <div className="p-5 flex items-center gap-4 border-l-4 border-primary-500">
           <div>
             <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 tracking-tight">Rekapitulasi Template</h4>
             <p className="text-xs text-gray-500 dark:text-gray-400">Total template racikan yang tersedia di sistem.</p>
           </div>
        </div>
        <div className="p-5 flex items-center gap-6 pr-8">
           <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Template Tersimpan</p>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">{data.length}</h3>
           </div>
        </div>
      </div>

      <ModalTemplateRacikan
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        id={selectedId}
        onSuccess={fetchData}
      />
    </div>
  );
}

