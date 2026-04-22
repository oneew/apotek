import React, { useState } from 'react';
import SectionHeader from '../../../components/ui/SectionHeader';
import DataTable from '../../../components/ui/DataTable';
import { FiPlus, FiFilter, FiDownload, FiRefreshCw, FiMoreVertical, FiSearch, FiMic, FiX } from 'react-icons/fi';

export default function PelayananRekamMedis() {
  const [showAntrianModal, setShowAntrianModal] = useState(false);

  const columns = [
    { key: 'no', label: 'No.', width: '60px' },
    { key: 'nama', label: 'Nama Pasien' },
    { key: 'rm', label: 'No. Rekam Medis' },
    { key: 'hp', label: 'No. Handphone' },
    { key: 'tgllahir', label: 'Tgl. Lahir' },
    { key: 'alamat', label: 'Alamat' },
    { 
      key: 'actions', 
      label: 'Actions', 
      align: 'center',
      render: () => (
        <div className="flex items-center justify-center gap-2">
          <button className="px-3 py-1 bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-[#2a2a30] hover:border-primary-300 dark:hover:border-primary-700 text-primary-600 rounded text-xs font-bold transition-colors">Riwayat</button>
          <button className="p-1.5 text-gray-400 hover:text-primary-600 transition-colors"><FiMoreVertical size={16} /></button>
        </div>
      )
    }
  ];

  const dummyData = [
    { id: 1, no: '1', nama: 'andi', rm: 'EMR000001', hp: '6282279727571', tgllahir: '1 Apr 2026', alamat: 'pbm' }
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      <SectionHeader 
        title="Daftar Rekam Medis" 
        rightContent={
          <div className="flex items-center gap-3">
             <button 
                onClick={() => setShowAntrianModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-bold shadow-sm shadow-teal-600/20 transition-all active:scale-95">
                <FiMic size={16} /> Antrian
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-bold shadow-sm shadow-teal-600/20 transition-all active:scale-95">
               <FiPlus size={18} /> Pasien Baru
             </button>
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
          <button className="flex flex-row items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-[#2a2a30] rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 transition-colors whitespace-nowrap">
            <FiFilter size={16} /> Filter
            <span className="bg-primary-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={dummyData} />

      {/* Antrian Pendaftaran Full Modal */}
      {showAntrianModal && (
        <div className="fixed inset-0 z-[100] bg-gray-500/50 flex flex-col backdrop-blur-sm">
          {/* Blue Header */}
          <div className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
            <h1 className="text-lg font-bold">Antrian : Pendaftaran</h1>
            <button onClick={() => setShowAntrianModal(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <FiX size={20} />
            </button>
          </div>
          
          <div className="flex-1 flex bg-gray-200 dark:bg-[#1a1a20]">
             {/* Left Panel */}
             <div className="w-[350px] bg-gray-200/50 dark:bg-gray-900/50 p-8 flex flex-col">
                <div className="text-center mb-8">
                  <p className="text-xs font-bold text-gray-500">No Antrian Saat Ini</p>
                  <h2 className="text-6xl font-black text-gray-900 dark:text-white my-2">001001</h2>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Daftar Antrian Konsultasi Apoteker</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Belum Pilih Pasien</p>
                  
                  <div className="flex justify-center gap-2 mt-4">
                    <button className="px-5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm shadow-sm">Batal</button>
                    <button className="px-5 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg text-sm shadow-sm">Lewati</button>
                    <button className="px-5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-sm shadow-sm">Proses</button>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-bold text-blue-800 dark:text-blue-400 mb-4">Berkas Pasien</h3>
                  <div className="bg-gray-300 dark:bg-gray-800 rounded-lg p-3 text-xs font-bold text-gray-600 dark:text-gray-400 flex justify-between">
                    <span>Tahap</span>
                    <span>Waktu Update</span>
                    <span>Berkas</span>
                  </div>
                  <p className="text-center text-sm text-gray-400 mt-4">Belum Ada Data</p>
                </div>
             </div>

             {/* Right Panel */}
             <div className="flex-1 p-6">
                <div className="bg-white/50 dark:bg-[#232329]/80 border border-gray-300 dark:border-[#2a2a30] rounded-xl p-6 h-full shadow-sm backdrop-blur">
                  <div className="flex justify-between items-center mb-6">
                     <h2 className="text-blue-800 dark:text-blue-400 font-bold text-lg">Daftar Antrian</h2>
                     <button className="px-4 py-1.5 text-blue-600 border border-blue-200 bg-white dark:bg-transparent rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">
                       Sembunyikan
                     </button>
                  </div>
                  
                  {/* Table area */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-300 dark:border-[#2a2a30]">
                          <th className="py-3 px-4 text-xs font-bold text-gray-900 w-16">No.</th>
                          <th className="py-3 px-4 text-xs font-bold text-gray-900 w-32">Tanggal</th>
                          <th className="py-3 px-4 text-xs font-bold text-gray-900">Pasien</th>
                          <th className="py-3 px-4 text-xs font-bold text-gray-900">Dokter</th>
                          <th className="py-3 px-4 text-xs font-bold text-gray-900 w-24">Status</th>
                          <th className="py-3 px-4 text-xs font-bold text-gray-900 w-24">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200 dark:border-[#2a2a30]">
                          <td className="py-4 px-4 text-sm font-bold">001001</td>
                          <td className="py-4 px-4 text-xs text-gray-600 dark:text-gray-400">18/04/2026<br/>13.50</td>
                          <td className="py-4 px-4"></td>
                          <td className="py-4 px-4 text-xs text-gray-600 dark:text-gray-400">Aqeela Nayyira<br/>Afwa - Anak</td>
                          <td className="py-4 px-4"><span className="px-2.5 py-1 bg-emerald-600 text-white rounded text-xs font-bold">Menunggu</span></td>
                          <td className="py-4 px-4"><button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold transition-colors">Pilih</button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
             </div>
          </div>
          
          <div className="bg-gray-300 dark:bg-gray-800 text-right px-6 py-4">
            <button onClick={() => setShowAntrianModal(false)} className="text-gray-500 font-bold text-sm hover:text-gray-700">Kembali</button>
          </div>
        </div>
      )}
    </div>
  );
}
