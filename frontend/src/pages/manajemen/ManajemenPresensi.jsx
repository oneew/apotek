import React, { useState } from 'react';
import SectionHeader, { DateFilter } from '../../components/ui/SectionHeader';
import { FiSearch, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

export default function ManajemenPresensi() {
  const [search, setSearch] = useState('');
  
  // Realistic mock data since no backend endpoint exists yet specifically for this PRO feature
  const [data] = useState([
    { id: 1, nama: 'Budi Santoso', shift: 'Pagi', waktu_masuk: new Date().setHours(7, 45), waktu_keluar: new Date().setHours(15, 10), metode: 'Face Recognition', lokasi: 'Apotek Utama', status: 'Hadir' },
    { id: 2, nama: 'Siti Kholijah', shift: 'Pagi', waktu_masuk: new Date().setHours(7, 50), waktu_keluar: new Date().setHours(15, 0), metode: 'Fingerprint', lokasi: 'Apotek Utama', status: 'Hadir' },
    { id: 3, nama: 'Andi Pratama', shift: 'Malam', waktu_masuk: null, waktu_keluar: null, metode: '-', lokasi: '-', status: 'Absen' }
  ]);

  const formatTime = (ts) => ts ? new Date(ts).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-';

  const filteredData = data.filter(p => 
    p.nama.toLowerCase().includes(search.toLowerCase()) || 
    p.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      <SectionHeader title="Riwayat Presensi Pegawai" subtitle="Fitur eksklusif PRO untuk mengelola kehadiran pegawai." />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-gray-200 dark:border-[#2a2a30] pb-6">
         <div className="relative w-full sm:w-64 pt-5">
           <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama pegawai..." className="pl-4 pr-10 py-2 w-full bg-gray-50 dark:bg-[#1a1a20] border border-gray-200 dark:border-[#2a2a30] rounded-lg text-sm focus:outline-none" />
           <div className="absolute right-3 top-1/2 mt-2.5 -translate-y-1/2 p-1"><FiSearch size={14} className="text-gray-500" /></div>
         </div>
         <div className="flex items-end gap-2 pt-5"><DateFilter /></div>
      </div>
      
      <div className="bg-white dark:bg-[#1a1a20] border border-gray-200 dark:border-[#2a2a30] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-[#1a1a20] border-b border-gray-200 dark:border-[#2a2a30]">
            <tr>
              {['Nama Pegawai', 'Shift', 'Jam Masuk', 'Jam Keluar', 'Metode & Lokasi', 'Status'].map((h, i) => (
                <th key={i} className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filteredData.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-[#202028]">
                <td className="px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-200">{p.nama}</td>
                <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{p.shift}</td>
                <td className="px-4 py-3 text-xs font-bold text-teal-600 dark:text-teal-400"><div className="flex items-center gap-1.5"><FiClock size={12} className="text-gray-400" /> {formatTime(p.waktu_masuk)}</div></td>
                <td className="px-4 py-3 text-xs font-bold text-orange-600 dark:text-orange-400"><div className="flex items-center gap-1.5"><FiClock size={12} className="text-gray-400" /> {formatTime(p.waktu_keluar)}</div></td>
                <td className="px-4 py-3">
                   <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{p.metode}</p>
                   <p className="text-[10px] text-gray-400">{p.lokasi}</p>
                </td>
                <td className="px-4 py-3">
                  {p.status === 'Hadir' ? (
                     <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded w-fit"><FiCheckCircle /> Hadir</span>
                  ) : (
                     <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded w-fit"><FiXCircle /> Absen</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
