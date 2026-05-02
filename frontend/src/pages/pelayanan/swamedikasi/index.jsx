import React, { useState, useEffect } from 'react';
import SectionHeader from '../../../components/ui/SectionHeader';
import DataTable from '../../../components/ui/DataTable';
import { FiPlus, FiFilter, FiRefreshCw, FiFileText } from 'react-icons/fi';
import ModalSwamedikasi from './ModalSwamedikasi';

const API_BASE = 'http://localhost:8080/api';

export default function PelayananSwamedikasi() {
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
      let url = `${API_BASE}/master/swamedikasi?`;
      if (filterWaktu !== 'Semua') url += `filter_tanggal=${filterWaktu}&`;
      const response = await fetch(url);
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
  }, [filterWaktu]);

  const handleOpenDetail = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const columns = [
    { key: 'no', label: 'No.', width: '60px', render: (_, __, i) => i + 1 },
    {
      key: 'tanggal_swamedikasi',
      label: 'Tanggal & Waktu',
      render: (val) => {
        const d = new Date(val);
        return (
          <div className="flex flex-col">
            <span className="font-bold text-gray-900">{d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            <span className="text-[10px] text-gray-400 font-medium">{d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        );
      }
    },
    { key: 'no_swamedikasi', label: 'No. Register', render: (val) => <span className="font-bold text-primary-700 font-mono">{val}</span> },
    {
      key: 'nama_pelanggan',
      label: 'Pasien',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-800">{val || 'Pasien Umum'}</span>
          <span className="text-[10px] text-gray-400">{row.no_telepon || '-'}</span>
        </div>
      )
    },
    { key: 'nama_apoteker', label: 'Apoteker', render: (val) => <span className="text-gray-600 font-medium">{val || '-'}</span> },
    { 
      key: 'keluhan', 
      label: 'Keluhan / Assesment', 
      render: (val) => <span className="text-xs text-gray-500 line-clamp-2 max-w-[250px]" title={val}>{val || '-'}</span>
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
          {val}
        </span>
      )
    },
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
        </div>
      )
    }
  ];

  const filteredData = data.filter(item => 
    item.no_swamedikasi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nama_pelanggan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.keluhan?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-unt-fade">
      <SectionHeader 
        title="Swamedikasi (Self-Medication)" 
        subtitle="Dokumentasi pelayanan dan konsultasi apoteker untuk pasien dengan keluhan ringan (Obat Bebas/OTC)."
      >
        <button 
          onClick={() => { setSelectedId(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95"
        >
          <FiPlus /> Catat Swamedikasi Baru
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
            <option value="Hari ini">Hari ini</option>
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
        searchPlaceholder="Cari no. register, nama pasien, atau keluhan..."
      />

      {/* Rekap Banner */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden mt-6 flex justify-between items-center">
        <div className="p-5 flex items-center gap-4 border-l-4 border-primary-500">
           <div>
             <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 tracking-tight">Rekapitulasi Swamedikasi</h4>
             <p className="text-xs text-gray-500 dark:text-gray-400">Total riwayat pelayanan konsultasi obat bebas.</p>
           </div>
        </div>
        <div className="p-5 flex items-center gap-6 pr-8">
           <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Interaksi</p>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">{data.length}</h3>
           </div>
        </div>
      </div>

      <ModalSwamedikasi
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        id={selectedId}
        onSuccess={fetchData}
      />
    </div>
  );
}

