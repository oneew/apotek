import React from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import { FiFilter, FiSearch, FiPlus } from 'react-icons/fi';
import { BiImport } from 'react-icons/bi';

export default function KontakDokter() {
  const columns = [
    { key: 'no', label: 'No.', width: '60px' },
    { key: 'nama', label: 'Nama Dokter' },
    { key: 'spesialis', label: 'Spesialis' },
    { key: 'telepon', label: 'Telepon' },
    { key: 'status', label: 'Status' }
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      <SectionHeader 
        title="Daftar Dokter" 
        rightContent={
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-teal-800/10 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 hover:bg-teal-800/20 rounded-lg text-sm font-bold transition-all">
               <BiImport size={16} /> Import
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-bold shadow-sm shadow-teal-600/20 transition-all active:scale-95">
               <FiPlus size={18} /> Dokter Baru
            </button>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-gray-200 dark:border-[#2a2a30] pb-6">
        <div className="relative w-full sm:w-80">
          <input 
            type="text" 
            placeholder="Cari data"
            className="pl-4 pr-10 py-2 w-full bg-gray-50 dark:bg-[#1a1a20] border border-gray-200 dark:border-[#2a2a30] rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
            <FiSearch size={14} className="text-gray-500" />
          </div>
        </div>
      </div>

      <DataTable columns={columns} data={[]} />
    </div>
  );
}
