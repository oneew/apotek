import React, { useState } from 'react';
import SectionHeader, { DateFilter } from '../../components/ui/SectionHeader';
import { FiSearch, FiClock, FiDollarSign } from 'react-icons/fi';

export default function ManajemenShift() {
  const [search, setSearch] = useState('');

  // Sesi Kasir History data is currently not available from API via a dedicated endpoint, so we use a robust mockup.
  const [data] = useState([
    { id: 1, nama_kasir: 'Administrator (Admin)', status: 'Aktif', waktu_buka: new Date().toISOString(), waktu_tutup: null, modal_awal: 0, total_pendapatan_cash: 0 },
    { id: 2, nama_kasir: 'Andi Kasir', status: 'Tutup', waktu_buka: new Date(Date.now() - 43200000).toISOString(), waktu_tutup: new Date(Date.now() - 14400000).toISOString(), modal_awal: 500000, total_pendapatan_cash: 2500000 },
    { id: 3, nama_kasir: 'Budi Apoteker', status: 'Tutup', waktu_buka: new Date(Date.now() - 86400000).toISOString(), waktu_tutup: new Date(Date.now() - 50400000).toISOString(), modal_awal: 300000, total_pendapatan_cash: 1800000 }
  ]);

  const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const filteredData = data.filter(s => 
    s.nama_kasir?.toLowerCase().includes(search.toLowerCase()) || 
    s.status?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      <SectionHeader title="Riwayat Shift / Sesi Kasir" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-gray-200 dark:border-[#2a2a30] pb-6">
         <div className="relative w-full sm:w-64 pt-5">
           <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari kasir atau status..." className="pl-4 pr-10 py-2 w-full bg-gray-50 dark:bg-[#1a1a20] border border-gray-200 dark:border-[#2a2a30] rounded-lg text-sm focus:outline-none" />
           <div className="absolute right-3 top-1/2 mt-2.5 -translate-y-1/2 p-1"><FiSearch size={14} className="text-gray-500" /></div>
         </div>
         <div className="flex items-end gap-2 pt-5"><DateFilter /></div>
      </div>
      
      <div className="bg-white dark:bg-[#1a1a20] border border-gray-200 dark:border-[#2a2a30] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-[#1a1a20] border-b border-gray-200 dark:border-[#2a2a30]">
            <tr>
              {['No.', 'Kasir', 'Status', 'Waktu Buka', 'Waktu Tutup', 'Modal Awal', 'Pendapatan Cash'].map((h, i) => (
                <th key={i} className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredData.length === 0 ? (
               <tr><td colSpan="7" className="px-4 py-8 text-center text-sm text-gray-500">Belum ada riwayat shift ditemukan.</td></tr>
            ) : (
               filteredData.map((s, i) => (
                 <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-[#202028]">
                   <td className="px-4 py-3 text-xs text-gray-500">{i + 1}</td>
                   <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200">{s.nama_kasir}</td>
                   <td className="px-4 py-3">
                     <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${s.status === 'Aktif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                       {s.status}
                     </span>
                   </td>
                   <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                     <div className="flex items-center gap-1.5"><FiClock size={12} className="text-gray-400" />{formatDate(s.waktu_buka)}</div>
                   </td>
                   <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                     <div className="flex items-center gap-1.5"><FiClock size={12} className="text-gray-400" />{formatDate(s.waktu_tutup)}</div>
                   </td>
                   <td className="px-4 py-3 text-xs font-bold text-gray-600 dark:text-gray-400 tabular-nums">
                     {formatCurrency(s.modal_awal)}
                   </td>
                   <td className="px-4 py-3 text-xs font-bold text-teal-600 dark:text-teal-400 tabular-nums">
                     {s.status === 'Tutup' ? formatCurrency(s.total_pendapatan_cash) : '-'}
                   </td>
                 </tr>
               ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
