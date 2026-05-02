import React, { useState, useEffect } from 'react';
import SectionHeader from '../../../components/ui/SectionHeader';
import DataTable from '../../../components/ui/DataTable';
import Button from '../../../components/ui/Button';
import { FiFilter, FiRefreshCw, FiCheckCircle, FiClock, FiSearch } from 'react-icons/fi';
import DetailResepModal from '../penerimaan-resep/DetailResepModal';

const API_BASE = 'http://localhost:8080/api';

export default function PelayananPenebusanResep() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTanggal, setFilterTanggal] = useState('Hari ini');
  const [filterStatus, setFilterStatus] = useState('Semua');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResepId, setSelectedResepId] = useState(null);

  const fetchResep = async () => {
    setIsLoading(true);
    try {
      let url = `${API_BASE}/master/resep?`;
      if (filterTanggal !== 'Semua') url += `filter_tanggal=${filterTanggal}&`;
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
    fetchResep();
  }, [filterTanggal]);

  const handleDetail = (id) => {
    setSelectedResepId(id);
    setIsModalOpen(true);
  };

  const columns = [
    { key: 'no', label: 'No.', width: '60px', render: (_, __, i) => i + 1 },
    {
      key: 'tanggal_resep',
      label: 'Tanggal Resep',
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
    { key: 'no_resep', label: 'No. Resep', render: (val) => <span className="font-bold text-primary-700 font-mono">{val}</span> },
    {
      key: 'nama_pelanggan',
      label: 'Pasien',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-800">{val || 'Umum'}</span>
          <span className="text-[10px] text-gray-400">{row.no_telepon || '-'}</span>
        </div>
      )
    },
    { key: 'nama_dokter', label: 'Dokter', render: (val) => <span className="text-gray-600 font-medium">{val || '-'}</span> },
    { 
      key: 'is_racikan', 
      label: 'Jenis',
      render: (val) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${val == 1 ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
          {val == 1 ? 'RACIKAN' : 'NON-RACIKAN'}
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => {
        let colorClass = 'bg-gray-100 text-gray-700 border-gray-200';
        if (val === 'Selesai') colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        if (val === 'Siap Diambil') colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        if (val === 'Diproses') colorClass = 'bg-blue-50 text-blue-700 border-blue-200';
        if (val === 'Baru') colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
        if (val === 'Dibatalkan') colorClass = 'bg-red-50 text-red-700 border-red-200';
        
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${colorClass}`}>
            {val}
          </span>
        )
      }
    },
    { 
      key: 'actions', 
      label: 'Aksi', 
      align: 'right',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => handleDetail(row.id)}
            className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-semibold shadow-sm transition-all"
          >
            Lihat Detail
          </button>
        </div>
      )
    }
  ];

  const filteredData = data.filter(item => {
    const matchSearch = 
      item.no_resep?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nama_pelanggan?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nama_dokter?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchStatus = filterStatus === 'Semua' ? true : item.status === filterStatus;
    
    return matchSearch && matchStatus;
  });

  return (
    <div className="animate-unt-fade">
      <SectionHeader 
        title="Penebusan Resep" 
        subtitle="Sistem POS (Kasir) khusus untuk memproses dan melunasi tagihan resep pasien."
      />

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter Status:</label>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          >
            <option value="Semua">Semua Status</option>
            <option value="Baru">Resep Baru (Menunggu)</option>
            <option value="Selesai">Telah Ditebus</option>
            <option value="Dibatalkan">Dibatalkan</option>
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
          <button 
            onClick={fetchResep}
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
        searchPlaceholder="Cari no. resep atau nama pasien..."
      />

      {/* Rekap Banner */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden mt-6 flex justify-between items-center">
        <div className="p-5 flex items-center gap-4 border-l-4 border-primary-500">
           <div>
             <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 tracking-tight">Rekapitulasi Penebusan</h4>
             <p className="text-xs text-gray-500 dark:text-gray-400">Total resep yang masuk dan status pembayarannya hari ini.</p>
           </div>
        </div>
        <div className="p-5 flex items-center gap-6 pr-8">
           <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Resep</p>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">{data.length}</h3>
           </div>
           <div className="w-px h-10 bg-gray-200 dark:bg-gray-800"></div>
           <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1 justify-center"><FiClock /> Menunggu</p>
              <h3 className="text-xl font-black text-blue-600">
                {data.filter(d => d.status === 'Baru').length}
              </h3>
           </div>
           <div className="w-px h-10 bg-gray-200 dark:bg-gray-800"></div>
           <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1 justify-center"><FiCheckCircle /> Selesai / Siap</p>
              <h3 className="text-xl font-black text-emerald-600">
                {data.filter(d => d.status === 'Selesai' || d.status === 'Siap Diambil').length}
              </h3>
           </div>
        </div>
      </div>

      <DetailResepModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        resepId={selectedResepId}
        onStatusUpdated={fetchResep}
      />
    </div>
  );
}

