import React, { useState } from 'react';
import SectionHeader, { DateFilter } from '../../../components/ui/SectionHeader';
import DataTable from '../../../components/ui/DataTable';
import { FiPlus, FiFilter, FiRefreshCw, FiMoreVertical, FiX, FiEdit2 } from 'react-icons/fi';

export default function PelayananKunjungan() {
  const [showDetailModal, setShowDetailModal] = useState(false);

  const columns = [
    { key: 'no', label: 'No.', width: '60px' },
    { key: 'tanggal', label: 'Tanggal Input' },
    { key: 'nomorAntrian', label: 'Nomor Antrian' },
    { key: 'jenisPelayanan', label: 'Jenis Pelayanan' },
    { key: 'pasien', label: 'Pasien/Pelanggan' },
    { 
      key: 'status', 
      label: 'Posisi & Status',
      render: (_, row) => (
        <div className="flex flex-col items-start gap-1">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Pendaftaran</span>
          <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Waiting</span>
        </div>
      )
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      align: 'center',
      render: () => (
        <div className="flex items-center justify-center gap-2">
          <button 
             onClick={() => setShowDetailModal(true)}
             className="px-3 py-1 bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-[#2a2a30] hover:border-primary-300 dark:hover:border-primary-700 text-primary-600 rounded text-xs font-bold transition-colors">
               Detail
          </button>
          <button className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"><FiMoreVertical size={16} /></button>
        </div>
      )
    }
  ];

  const dummyData = [
    { id: 1, no: '1', tanggal: '18/04/2026\n13:50', nomorAntrian: '001001\nVST-260418-001', jenisPelayanan: 'Daftar Antrian Konsultasi Apoteker', pasien: '' }
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      <SectionHeader 
        title="Kunjungan Pasien" 
        rightContent={
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-bold shadow-sm shadow-teal-600/20 transition-all active:scale-95">
            <FiPlus size={18} /> Antrian/Kunjungan
          </button>
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
            <FiRefreshCw size={12} className="text-gray-500" />
          </div>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar">
          <DateFilter />
          <button className="flex flex-row items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-[#2a2a30] rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 transition-colors whitespace-nowrap">
            <FiFilter size={16} /> Filter
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={dummyData} />

      {/* Detail Kunjungan Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-gray-200 dark:bg-[#1a1a20] rounded-2xl overflow-hidden w-full max-w-[500px] shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="font-bold text-lg">Detail Kunjungan</h2>
              <button onClick={() => setShowDetailModal(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors"><FiX size={20} /></button>
            </div>
            
            {/* Content body - scrollable */}
            <div className="p-6 overflow-y-auto min-h-[400px]">
              <div className="text-center mb-6">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">VST-260418-001<br/><span className="text-gray-500 font-normal">18 Apr 2026 13.50</span></p>
                <h1 className="text-7xl font-black text-gray-900 dark:text-white my-4">001001</h1>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Jenis Antrian</label>
                  <select className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none text-gray-700 dark:text-gray-300">
                    <option>ANT001</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Jenis Pelayanan</label>
                  <select className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none text-gray-700 dark:text-gray-300">
                    <option>Daftar Antrian Konsultasi Apoteker</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Pelanggan/Pasien</label>
                  <div className="flex gap-2">
                    <select className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none text-gray-400">
                      <option>Pilih pelanggan</option>
                    </select>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-lg"><FiPlus size={16} /></button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5">Dokter</label>
                  <div className="flex gap-2">
                    <select className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none text-gray-700 dark:text-gray-300">
                      <option>Aqeela Nayyira Afwa</option>
                    </select>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-lg"><FiEdit2 size={16} /></button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-lg"><FiPlus size={16} /></button>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-bold text-blue-800 dark:text-blue-400 mb-4">Alur Pelayanan</h3>
                  <div className="bg-gray-100 dark:bg-gray-800/80 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                     <div className="flex justify-between text-xs font-bold text-gray-500 border-b border-gray-300 dark:border-gray-700 pb-2 mb-2">
                       <span>Tahap Pelayanan</span>
                       <span>Status</span>
                       <span>Actions</span>
                     </div>
                     <div className="flex justify-between items-center py-2 text-sm">
                       <span className="font-bold text-gray-700 dark:text-gray-300">Pendaftaran</span>
                       <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-[10px] uppercase font-bold tracking-wider">waiting</span>
                       <span></span>
                     </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 border-t border-gray-300 dark:border-[#2a2a30] pt-4">
                  <span className="font-bold text-blue-800 dark:text-blue-400 text-sm">Riwayat Pelayanan</span>
                  <button className="px-4 py-1.5 border border-blue-300 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-bold hover:bg-blue-50 dark:hover:bg-blue-900/40">Tampilkan</button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-300 dark:bg-gray-800 flex justify-end gap-4 mt-auto">
              <button onClick={() => setShowDetailModal(false)} className="text-gray-600 dark:text-gray-400 font-bold text-sm px-4">Batal</button>
              <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors cursor-pointer">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
