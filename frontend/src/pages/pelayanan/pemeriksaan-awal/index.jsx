import React from 'react';
import SectionHeader, { DateFilter } from '../../../components/ui/SectionHeader';
import DataTable from '../../../components/ui/DataTable';
import { FiPlus, FiFilter, FiSearch, FiMic } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function PelayananPemeriksaanAwal() {
  const columns = [
    { key: 'no', label: 'No.', width: '60px' },
    { key: 'tanggal', label: 'Tanggal Input' },
    { key: 'kode', label: 'Kode Pemeriksaan' },
    { key: 'pasien', label: 'Pasien' },
    { key: 'dokter', label: 'Dokter' },
    { key: 'keluhan', label: 'Keluhan' },
    { 
      key: 'actions', 
      label: 'Actions', 
      align: 'center',
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      <SectionHeader 
        title="Pemeriksaan Awal" 
        rightContent={
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-bold shadow-sm shadow-teal-600/20 transition-all active:scale-95">
                <FiMic size={16} /> Antrian
             </button>
             <Link to="/pelayanan/pemeriksaan-awal/baru" className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-bold shadow-sm shadow-teal-600/20 transition-all active:scale-95">
               <FiPlus size={18} /> Pemeriksaan Baru
             </Link>
          </div>
        }
      />

      <div className="bg-white dark:bg-[#1e1e24] border border-gray-100 dark:border-[#2a2a30] rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 outline-none">
             <option>Pemeriksaan</option>
          </select>
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
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          <DateFilter />
          <button className="flex flex-row items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-[#2a2a30] rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 transition-colors whitespace-nowrap">
            <FiFilter size={16} /> Filter
            <span className="bg-primary-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={[]} />
      
      {/* Rekap Banner */}
      <div className="bg-white dark:bg-[#1e1e24] border border-gray-100 dark:border-[#2a2a30] rounded-2xl shadow-sm overflow-hidden mt-6">
        <div className="h-1 bg-primary-400 w-full" />
        <div className="p-5">
           <h4 className="text-sm font-bold text-primary-700 dark:text-primary-400 mb-4 tracking-tight">Rekap dari 15 Apr 2026 s.d. 18 Apr 2026</h4>
           <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Jumlah Pemeriksaan <span className="ml-24 font-bold text-gray-900 dark:text-white">: 0</span></p>
        </div>
      </div>
    </div>
  );
}
