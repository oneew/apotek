import React from 'react';
import SectionHeader, { DateFilter } from '../../../components/ui/SectionHeader';
import DataTable from '../../../components/ui/DataTable';
import { FiPlus, FiFilter, FiSearch, FiPrinter, FiMoreVertical } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function PelayananPenerimaanResep() {
  const columns = [
    { key: 'no', label: 'No.', width: '60px' },
    { key: 'tanggal', label: 'Tanggal Input' },
    { key: 'kode', label: 'Kode Resep' },
    { key: 'jenis', label: 'Jenis Resep' },
    { key: 'pasien', label: 'Pasien/Pelanggan' },
    { key: 'dokter', label: 'Dokter' },
    { key: 'isi', label: 'Isi' },
    { 
      key: 'status', 
      label: 'Status',
      render: (_, row) => (
        <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border border-green-200 dark:border-green-800">
          Belum Ditebus
        </span>
      )
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      align: 'center',
      render: () => (
        <div className="flex items-center justify-center gap-2">
          <button className="px-3 py-1 bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-[#2a2a30] hover:border-primary-300 dark:hover:border-primary-700 text-primary-600 rounded text-xs font-bold transition-colors">Detail</button>
          <button className="px-3 py-1 bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-[#2a2a30] hover:border-blue-300 dark:hover:border-blue-700 text-blue-600 rounded text-xs font-bold transition-colors">Tebus</button>
          <button className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"><FiMoreVertical size={16} /></button>
        </div>
      )
    }
  ];

  const dummyData = [
    { id: 1, no: '1', tanggal: '18/04/2026\n14:02', kode: 'RXB260418-1-1-1', jenis: 'Resep Masuk', pasien: 'andi', dokter: 'Aqeela Nayyira Afwa', isi: '- pcx' }
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
          <DateFilter />
          <button className="flex flex-row items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-[#2a2a30] rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 transition-colors whitespace-nowrap">
            <FiFilter size={16} /> Filter
            <span className="bg-primary-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={dummyData} />
      
      {/* Rekap Banner */}
      <div className="bg-white dark:bg-[#1e1e24] border border-gray-100 dark:border-[#2a2a30] rounded-2xl shadow-sm overflow-hidden mt-6">
        <div className="h-1 bg-primary-400 w-full" />
        <div className="p-5">
           <h4 className="text-sm font-bold text-primary-700 dark:text-primary-400 mb-4 tracking-tight">Rekap dari 15 Apr 2026 s.d. 18 Apr 2026</h4>
           <div className="flex flex-col sm:flex-row gap-8">
             <div className="flex-1 space-y-1">
               <p className="flex justify-between text-sm text-gray-600 dark:text-gray-400 font-medium"><span>Resep Diterima</span> <span>: 1 Resep</span></p>
               <p className="flex justify-between text-sm text-gray-600 dark:text-gray-400 font-medium"><span>Resep Belum Ditebus</span> <span>: 1 Resep</span></p>
             </div>
             <div className="flex-1 space-y-1">
               <p className="flex justify-between text-sm text-gray-600 dark:text-gray-400 font-medium"><span>Resep Sudah Ditebus</span> <span>: 0 Resep</span></p>
               <p className="flex justify-between text-sm text-gray-600 dark:text-gray-400 font-medium"><span>Resep Ditebus Sebagian</span> <span>: 0 Resep</span></p>
             </div>
             <div className="flex-1"></div>
           </div>
        </div>
      </div>
    </div>
  );
}
