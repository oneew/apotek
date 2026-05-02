import React, { useState, useEffect } from 'react';
import SectionHeader, { DateFilter } from '../../../components/ui/SectionHeader';
import DataTable from '../../../components/ui/DataTable';
import { FiPlus, FiFilter, FiMic, FiEye, FiUser, FiActivity, FiCheckCircle, FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:8080/api';

export default function PelayananPemeriksaanAwal() {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Semua');
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/master/kunjungan`);
      const res = await response.json();
      if (res.status) {
        setData(res.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter(d => {
    return statusFilter === 'Semua' || d.status === statusFilter;
  });

  const columns = [
    { 
      key: 'nomor_antrian', 
      label: 'Antrian',
      render: (val) => <span className="font-bold text-primary-600 font-mono tracking-tight">{val}</span>
    },
    { 
      key: 'tanggal_kunjungan', 
      label: 'Waktu',
      render: (val) => (
        <div className="flex flex-col">
          <span className="text-gray-900 font-semibold">{new Date(val).toLocaleDateString('id-ID')}</span>
          <span className="text-gray-400 text-xs">{new Date(val).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      )
    },
    { 
      key: 'nama_pelanggan', 
      label: 'Pasien',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className={val ? "text-gray-900 font-semibold" : "text-gray-400 italic font-medium"}>
            {val || "Umum"}
          </span>
          {row.keluhan && <span className="text-[10px] text-primary-500 font-medium truncate max-w-[150px]">{row.keluhan}</span>}
        </div>
      )
    },
    {
      key: 'nama_dokter',
      label: 'Dokter',
      render: (val) => (
        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
          <FiUser size={12} className="text-gray-400"/> {val || '-'}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const colors = {
          'Waiting': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
          'In Progress': 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400',
          'Finished': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
        };
        const icons = {
          'Waiting': FiClock,
          'In Progress': FiActivity,
          'Finished': FiCheckCircle,
        };
        const Icon = icons[val] || FiClock;
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${colors[val] || colors['Waiting']}`}>
            <Icon size={12} />
            {val}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Aksi',
      align: 'right',
      render: (_, row) => (
        <button 
          onClick={() => navigate(`/pelayanan/pemeriksaan-awal/baru?id=${row.id}`)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/20 text-gray-600 rounded-lg text-xs font-bold transition-all shadow-sm ml-auto"
        >
          <FiEye size={12}/> Periksa
        </button>
      )
    }
  ];

  return (
    <div className="animate-unt-fade">
      <SectionHeader 
        title="Pemeriksaan Awal (Triase)" 
        subtitle="Data triase dan pemeriksaan awal pasien sebelum pelayanan obat atau dokter."
      >
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-400 hover:bg-primary-100 rounded-lg text-sm font-bold transition-all">
              <FiMic size={16} /> Panggil Antrian
           </button>
        </div>
      </SectionHeader>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter Status:</label>
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          >
             <option value="Semua">Semua Kunjungan</option>
             <option value="Waiting">Waiting (Antri)</option>
             <option value="In Progress">In Progress (Diperiksa)</option>
             <option value="Finished">Finished (Selesai)</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          <DateFilter />
          <button className="flex flex-row items-center gap-2 px-3 py-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 transition-colors whitespace-nowrap">
            <FiFilter size={16} /> Filter Lanjutan
            <span className="bg-primary-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </button>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredData} 
        isLoading={loading}
        searchQuery={search}
        onSearchChange={setSearch}
        searchPlaceholder="Cari nomor antrian atau nama pasien..."
      />
      
      {/* Rekap Banner */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden mt-6 flex justify-between items-center">
        <div className="p-5 flex items-center gap-4 border-l-4 border-primary-500">
           <div>
             <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 tracking-tight">Rekap Pemeriksaan Hari Ini</h4>
             <p className="text-xs text-gray-500 dark:text-gray-400">Semua Pasien Poli Umum & Spesialis</p>
           </div>
        </div>
        <div className="p-5 flex items-center gap-6 pr-8">
           <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Antrian</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{data.length}</h3>
           </div>
           <div className="w-px h-10 bg-gray-200 dark:bg-gray-800"></div>
           <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Telah Diperiksa</p>
              <h3 className="text-2xl font-black text-primary-600">{data.filter(d => d.status === 'Finished' || d.status === 'In Progress').length}</h3>
           </div>
        </div>
      </div>
    </div>
  );
}

