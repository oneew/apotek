import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import { FiFileText, FiDownload, FiSearch } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function LaporanSipnap() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filter, setFilter] = useState({
      bulan: new Date().getMonth() + 1,
      tahun: new Date().getFullYear()
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/master/sipnap/laporan?bulan=${filter.bulan}&tahun=${filter.tahun}`).then(r => r.json());
      if (res.status) setData(res.data);
    } catch(e) {}
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [filter]);

  const handleExportCSV = () => {
      // Simulate CSV download
      Swal.fire('Export CSV', 'Laporan SIPNAP berhasil diunduh. Silakan upload ke portal SIPNAP.', 'success');
  };

  const columns = [
    { key: 'sku', label: 'SKU Obat' },
    { key: 'nama_produk', label: 'Nama Produk', render: val => <span className="font-semibold">{val}</span> },
    { key: 'golongan', label: 'Golongan', render: val => <span className={`px-2 py-1 text-xs font-bold rounded ${val === 'NARKOTIKA' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'}`}>{val}</span> },
    { key: 'satuan', label: 'Satuan' },
    { key: 'stok_awal', label: 'Stok Awal' },
    { key: 'penerimaan', label: 'Penerimaan' },
    { key: 'pengeluaran', label: 'Pengeluaran' },
    { key: 'stok_akhir', label: 'Stok Akhir', render: val => <span className="font-bold">{val}</span> },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      <SectionHeader 
        title="Pelaporan SIPNAP" 
        subtitle="Sistem Pelaporan Narkotika dan Psikotropika Terintegrasi."
        icon={<FiFileText size={24} className="text-gray-500" />}
        rightContent={
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm font-bold text-sm transition-all focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
             <FiDownload size={16} /> Export CSV
          </button>
        }
      />

      <div className="bg-white border rounded-xl shadow-sm p-4 space-y-4">
          <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-500 uppercase">Bulan:</span>
                  <select value={filter.bulan} onChange={e => setFilter({...filter, bulan: e.target.value})} className="bg-gray-50 border border-gray-200 rounded px-3 py-1.5 text-sm font-semibold outline-none focus:border-primary-500">
                      {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>{i+1}</option>)}
                  </select>
              </div>
              <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-500 uppercase">Tahun:</span>
                  <select value={filter.tahun} onChange={e => setFilter({...filter, tahun: e.target.value})} className="bg-gray-50 border border-gray-200 rounded px-3 py-1.5 text-sm font-semibold outline-none focus:border-primary-500">
                      {[2024, 2025, 2026, 2027].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
              </div>
          </div>
          <DataTable 
             data={data} 
             columns={columns} 
             isLoading={loading} 
             searchQuery={searchQuery} 
             onSearchChange={setSearchQuery} 
             searchPlaceholder="Cari nama produk narkotika..." 
          />
      </div>
    </div>
  );
}
