import React, { useState } from 'react';
import SectionHeader, { DateFilter } from '../../../components/ui/SectionHeader';
import { FiPlus, FiFilter, FiSearch, FiMic, FiEye, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function PelayananPemeriksaanAwal() {
  const [search, setSearch] = useState('');
  
  // Realist mock data for UI completeness
  const [data] = useState([
    { id: 1, tanggal: new Date().toISOString(), kode: 'PAM-2604-001', pasien: 'Budi Santoso', dokter: 'dr. Siti Rahayu, Sp.PD', keluhan: 'Demam tinggi 3 hari', status: 'Selesai' },
    { id: 2, tanggal: new Date(Date.now() - 3600000).toISOString(), kode: 'PAM-2604-002', pasien: 'Ana Mariana', dokter: 'dr. Andi Pratama', keluhan: 'Batuk kering', status: 'Antri' },
    { id: 3, tanggal: new Date(Date.now() - 86400000).toISOString(), kode: 'PAM-2604-003', pasien: 'Bambang', dokter: 'dr. Siti Rahayu, Sp.PD', keluhan: 'Sakit Kepala Migrain', status: 'Selesai' }
  ]);

  const formatDate = (ts) => ts ? new Date(ts).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

  const filteredData = data.filter(d => 
    d.pasien.toLowerCase().includes(search.toLowerCase()) || 
    d.kode.toLowerCase().includes(search.toLowerCase()) ||
    d.keluhan.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      <SectionHeader 
        title="Pemeriksaan Awal" 
        subtitle="Data triase dan pemeriksaan awal pasien sebelum konsul / pelayanan obat."
        rightContent={
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-teal-800/10 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 hover:bg-teal-800/20 rounded-lg text-sm font-bold transition-all">
                <FiMic size={16} /> Panggil Antrian
             </button>
             <Link to="/pelayanan/pemeriksaan-awal/baru" className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-bold shadow-sm shadow-teal-600/20 transition-all active:scale-95">
               <FiPlus size={18} /> Pemeriksaan Baru
             </Link>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#1e1e24] border border-gray-100 dark:border-[#2a2a30] rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 outline-none">
             <option value="Semua">Semua Status</option>
             <option value="Selesai">Selesai</option>
             <option value="Antri">Antri</option>
          </select>
          <div className="relative w-full sm:w-80">
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama pasien, keluhan, kode..."
              className="pl-4 pr-10 py-2 w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all font-medium"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center p-1 bg-gray-200 dark:bg-gray-800 rounded">
              <FiSearch size={12} className="text-gray-500" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          <DateFilter />
          <button className="flex flex-row items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-[#2a2a30] rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 transition-colors whitespace-nowrap">
            <FiFilter size={16} /> Filter
            <span className="bg-primary-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="bg-white dark:bg-[#1a1a20] border border-gray-200 dark:border-[#2a2a30] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-[#1a1a20] border-b border-gray-200 dark:border-[#2a2a30]">
            <tr>
              {['Tanggal Input', 'Kode Pemeriksaan', 'Pasien', 'Keluhan', 'Dokter Poli', 'Status', 'Aksi'].map((h, i) => (
                <th key={i} className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredData.length === 0 ? (
               <tr><td colSpan="7" className="px-4 py-8 text-center text-sm text-gray-500">Tidak ada data ditemukan.</td></tr>
            ) : filteredData.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-[#202028]">
                <td className="px-4 py-3 text-xs text-gray-500">{formatDate(d.tanggal)}</td>
                <td className="px-4 py-3 text-xs font-mono text-gray-600 dark:text-gray-400">{d.kode}</td>
                <td className="px-4 py-3 text-sm font-bold text-gray-800 dark:text-white">{d.pasien}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{d.keluhan}</td>
                <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1.5"><FiUser size={12} className="text-gray-400"/> {d.dokter}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${d.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                   <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 hover:bg-teal-50 hover:text-teal-600 text-gray-600 rounded-lg text-xs font-bold transition-all shadow-sm">
                      <FiEye size={12}/> Detail
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Rekap Banner */}
      <div className="bg-white dark:bg-[#1e1e24] border border-gray-100 dark:border-[#2a2a30] rounded-2xl shadow-sm overflow-hidden mt-6 flex justify-between items-center">
        <div className="p-5 flex items-center gap-4 border-l-4 border-teal-500">
           <div>
             <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1 tracking-tight">Rekap Pemeriksaan Bulan Ini</h4>
             <p className="text-xs text-gray-500 dark:text-gray-400">Semua Pasien Poli Umum & Spesialis</p>
           </div>
        </div>
        <div className="p-5 flex items-center gap-6 pr-8">
           <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Kunjungan</p>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white">{filteredData.length}</h3>
           </div>
           <div className="w-px h-10 bg-gray-200 dark:bg-gray-800"></div>
           <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Rerata Keluhan</p>
              <h3 className="text-2xl font-black text-teal-600">ISPA</h3>
           </div>
        </div>
      </div>
    </div>
  );
}
