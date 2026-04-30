import React from 'react';
import SectionHeader, { DateFilter } from '../../../components/ui/SectionHeader';
import DataTable from '../../../components/ui/DataTable';
import { FiPlus, FiFilter, FiSearch, FiPrinter, FiMoreVertical, FiLayers, FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:8080/api';

export default function PelayananPenerimaanResep() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [filterTanggal, setFilterTanggal] = React.useState('Hari ini');
  const [filterSumber, setFilterSumber] = React.useState('');

  const fetchResep = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/master/resep?sumber=${filterSumber}`;
      if (filterTanggal !== 'Semua') {
          url += `&filter_tanggal=${filterTanggal}`;
      }
      const resp = await axios.get(url);
      if (resp.data.status) setData(resp.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchResep();
  }, [filterSumber, filterTanggal]);

  const columns = [
    { key: 'no', label: 'No.', width: '60px', render: (_, __, i) => i + 1 },
    { 
      key: 'tanggal', 
      label: 'Tanggal Input',
      render: (val) => new Date(val).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
    { key: 'no_resep', label: 'Kode Resep' },
    { 
      key: 'sumber', 
      label: 'Sumber',
      render: (val) => (
        <span className={`flex items-center gap-1.5 font-bold text-[10px] uppercase ${val === 'Kasir' ? 'text-amber-600' : 'text-blue-600'}`}>
          {val === 'Kasir' ? <FiShoppingCart size={12} /> : <FiUser size={12} />}
          {val}
        </span>
      )
    },
    { 
      key: 'is_racikan', 
      label: 'Jenis',
      render: (val) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${val ? 'bg-purple-50 text-purple-600 border-purple-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
          {val ? 'RACIKAN' : 'NON-RACIKAN'}
        </span>
      )
    },
    { key: 'nama_pelanggan', label: 'Pasien', render: (val) => val || 'Umum' },
    { key: 'nama_dokter', label: 'Dokter', render: (val) => val || '-' },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
          val === 'Selesai' ? 'bg-green-100 text-green-700 border-green-200' : 
          val === 'Diproses' ? 'bg-blue-100 text-blue-700 border-blue-200' :
          'bg-amber-100 text-amber-700 border-amber-200'
        }`}>
          {val}
        </span>
      )
    },
    { 
      key: 'actions', 
      label: 'Aksi', 
      align: 'center',
      render: (_, row) => (
        <div className="flex items-center justify-center gap-2">
          <Link to={`/pelayanan/penerimaan-resep/detail/${row.id}`} className="px-3 py-1 bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-[#2a2a30] hover:border-primary-300 text-primary-600 rounded text-xs font-bold">Detail</Link>
          {row.status !== 'Selesai' && (
            <button className="px-3 py-1 bg-primary-600 text-white rounded text-xs font-bold hover:bg-primary-700">Proses</button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      <SectionHeader 
        title="Penerimaan Resep" 
        rightContent={
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-bold shadow-sm shadow-teal-600/20 transition-all active:scale-95">
                <FiPrinter size={16} /> Template Resep
             </button>
             <Link to="/pelayanan/penerimaan-resep/baru" className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-bold shadow-sm shadow-teal-600/20 transition-all active:scale-95">
               <FiPlus size={18} /> Catat Resep
             </Link>
          </div>
        }
      />

      <div className="bg-white dark:bg-[#1e1e24] border border-gray-100 dark:border-[#2a2a30] rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input 
            type="text" 
            placeholder="Cari data"
            className="pl-4 pr-10 py-2 w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all font-medium"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center p-1 bg-gray-200 dark:bg-gray-800 rounded">
            <FiSearch size={12} className="text-gray-500" />
          </div>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          <select 
            value={filterSumber} 
            onChange={e => setFilterSumber(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg text-sm font-bold text-gray-600 outline-none focus:border-primary-500"
          >
            <option value="">Semua Sumber</option>
            <option value="Pelayanan">Apoteker (Internal)</option>
            <option value="Kasir">Kasir (Eksternal)</option>
          </select>
            <select 
              value={filterTanggal} 
              onChange={e => setFilterTanggal(e.target.value)}
              className="text-xs font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 outline-none hover:border-primary-300 focus:ring-2 focus:ring-primary-100 transition-all cursor-pointer shadow-sm"
            >
              <option value="Semua">Semua Waktu</option>
              <option value="Hari ini">Hari ini</option>
              <option value="Bulan ini">Bulan ini</option>
              <option value="Tahun ini">Tahun ini</option>
            </select>
          <button className="flex flex-row items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-[#2a2a30] rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 transition-colors whitespace-nowrap">
            <FiFilter size={16} /> Filter
            <span className="bg-primary-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{(filterSumber ? 1 : 0) + (filterTanggal !== 'Semua' ? 1 : 0)}</span>
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={data} isLoading={loading} />
      
      {/* Rekap Banner */}
      <div className="bg-white dark:bg-[#1e1e24] border border-gray-100 dark:border-[#2a2a30] rounded-2xl shadow-sm overflow-hidden mt-6">
        <div className="h-1 bg-primary-400 w-full" />
        <div className="p-5">
           <h4 className="text-sm font-bold text-primary-700 dark:text-primary-400 mb-4 tracking-tight">Rekapitulasi Resep Digital</h4>
           <div className="flex flex-col sm:flex-row gap-8">
             <div className="flex-1 space-y-1">
               <p className="flex justify-between text-sm text-gray-600 dark:text-gray-400 font-medium"><span>Resep Diterima</span> <span>: {data.length} Resep</span></p>
               <p className="flex justify-between text-sm text-gray-600 dark:text-gray-400 font-medium"><span>Asal Kasir</span> <span>: {data.filter(d => d.sumber === 'Kasir').length} Resep</span></p>
             </div>
             <div className="flex-1 space-y-1">
               <p className="flex justify-between text-sm text-gray-600 dark:text-gray-400 font-medium"><span>Resep Selesai</span> <span>: {data.filter(d => d.status === 'Selesai').length} Resep</span></p>
               <p className="flex justify-between text-sm text-gray-600 dark:text-gray-400 font-medium"><span>Resep Baru/Proses</span> <span>: {data.filter(d => d.status !== 'Selesai').length} Resep</span></p>
             </div>
             <div className="flex-1"></div>
           </div>
        </div>
      </div>
    </div>
  );
}
