import React from 'react';
import SectionHeader, { DateFilter } from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import { FiSearch, FiPlus } from 'react-icons/fi';

export default function ManajemenJadwal() {
  const columns = [
    { key: 'no', label: 'No.', width: '60px' },
    { key: 'nama', label: 'Nama Pegawai' },
    { key: 'tanggal', label: 'Tanggal' },
    { key: 'shift', label: 'Shift' },
    { key: 'status', label: 'Status Kehadiran' }
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      <SectionHeader 
        title="Jadwal Kerja (PRO)" 
        rightContent={<button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-bold shadow-sm shadow-teal-600/20 transition-all active:scale-95"><FiPlus size={18} /> Buat Jadwal</button>}
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-gray-200 dark:border-[#2a2a30] pb-6">
         <div className="relative w-full sm:w-64 pt-5">
           <input type="text" placeholder="Cari data" className="pl-4 pr-10 py-2 w-full bg-gray-50 dark:bg-[#1a1a20] border border-gray-200 dark:border-[#2a2a30] rounded-lg text-sm focus:outline-none" />
           <div className="absolute right-3 top-1/2 mt-2.5 -translate-y-1/2 p-1"><FiSearch size={14} className="text-gray-500" /></div>
         </div>
         <div className="flex items-end gap-2 pt-5"><DateFilter /></div>
      </div>
      <DataTable columns={columns} data={[]} />
    </div>
  );
}
