import React, { useState, useEffect } from 'react';
import SectionHeader from '../../../components/ui/SectionHeader';
import DataTable from '../../../components/ui/DataTable';
import { FiPlus, FiFilter, FiFileText } from 'react-icons/fi';
import ModalPio from './components/ModalPio';

const API_BASE = 'http://localhost:8080/api';

export default function PioList() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('Hari ini');

  const fetchPio = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/master/pio`);
      const result = await response.json();
      if (result.status) setData(result.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPio();
  }, []);

  const columns = [
    {
      key: 'tanggal_pio',
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
    {
      key: 'nama_pelanggan',
      label: 'Pasien',
      render: (val) => <span className="font-bold text-primary-700">{val || 'Umum'}</span>
    },
    {
      key: 'nama_obat',
      label: 'Informasi Obat',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-800">{val}</span>
          <span className="text-[10px] text-gray-400 font-medium">{row.aturan_pakai}</span>
        </div>
      )
    },
    {
      key: 'nama_apoteker',
      label: 'Pemberi Info',
      render: (val) => <span className="font-semibold text-gray-600">{val || 'N/A'}</span>
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (_, row) => (
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => { setSelectedId(row.id); setIsModalOpen(true); }}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            title="Edit / Lihat Detail"
          >
            <FiFileText size={16} />
          </button>
        </div>
      )
    }
  ];

  const filteredData = data.filter(item => 
    item.nama_pelanggan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nama_obat?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.nama_apoteker?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-unt-fade">
      <SectionHeader 
        title="Pemberian Informasi Obat (PIO)" 
        subtitle="Dokumentasi edukasi obat kepada pasien untuk meningkatkan kepatuhan terapi."
      >
        <button 
          onClick={() => { setSelectedId(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95"
        >
          <FiPlus /> Catat PIO Baru
        </button>
      </SectionHeader>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter Data:</label>
          <select 
            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          >
            <option value="">Semua Edukasi</option>
            <option value="Selesai">Telah Selesai</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          <select 
            value={filterTanggal} 
            onChange={e => setFilterTanggal(e.target.value)}
            className="text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 shadow-sm"
          >
            <option value="Semua">Semua Waktu</option>
            <option value="Hari ini">Hari ini</option>
            <option value="Bulan ini">Bulan ini</option>
            <option value="Tahun ini">Tahun ini</option>
          </select>
          <button className="flex flex-row items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 transition-colors whitespace-nowrap shadow-sm">
            <FiFilter size={16} /> Filter Lanjutan
            <span className="bg-primary-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{filterTanggal !== 'Semua' ? 1 : 0}</span>
          </button>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredData} 
        isLoading={isLoading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Cari berdasarkan pasien, obat, atau apoteker..."
      />

      {/* Rekap Banner */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden mt-6 flex justify-between items-center">
        <div className="p-5 flex items-center gap-4 border-l-4 border-primary-500">
           <div>
             <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 tracking-tight">Rekapitulasi PIO</h4>
             <p className="text-xs text-gray-500 dark:text-gray-400">Total interaksi edukasi obat kepada pasien.</p>
           </div>
        </div>
        <div className="p-5 flex items-center gap-6 pr-8">
           <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Edukasi</p>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">{data.length}</h3>
           </div>
           <div className="w-px h-10 bg-gray-200 dark:bg-gray-800"></div>
           <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pasien Dilayani</p>
              <h3 className="text-xl font-black text-primary-600">
                {[...new Set(data.map(d => d.pelanggan_id))].length}
              </h3>
           </div>
        </div>
      </div>

      <ModalPio 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        id={selectedId}
        onSaveSuccess={fetchPio}
      />
    </div>
  );
}

