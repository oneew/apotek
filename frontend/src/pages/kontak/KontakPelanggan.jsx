import React, { useState } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import ModalDialog from '../../components/ui/ModalDialog';
import { FiFilter, FiSearch, FiPlus, FiTrash2 } from 'react-icons/fi';
import { BiImport } from 'react-icons/bi';

export default function KontakPelanggan() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    rm: '',
    telepon: '',
    tgllahir: '',
    alamat: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Logic for saving to API would go here
    console.log('Saved data:', formData);
    setShowModal(false);
  };
  const columns = [
    { key: 'no', label: 'No.', width: '60px' },
    { key: 'tgl', label: 'Tanggal Dibuat' },
    { key: 'nama', label: 'Nama Pelanggan' },
    { key: 'rm', label: 'No. Rekam Medis' },
    { key: 'kode', label: 'Kode Pelanggan' },
    { key: 'status', label: 'Status Member', render: (val) => (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 rounded text-[10px] font-bold">{val}</span>
    )},
    { key: 'notelp', label: 'No. Telepon/HP' },
    { key: 'tgllahir', label: 'Tgl. Lahir' },
    { key: 'alamat', label: 'Alamat' }
  ];

  const dummyData = [
    { 
       id: 1, no: '1', tgl: '18 Apr 2026\n13:55', nama: 'andi', rm: 'EMR000001', 
       kode: 'CUS000001', status: 'Bukan Member', notelp: '6282279727571', 
       tgllahir: '1 Apr 2026', alamat: 'pbm' 
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      <SectionHeader 
        title="Daftar Pelanggan" 
        rightContent={
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-teal-800/10 dark:bg-teal-900/40 text-teal-700 dark:text-teal-400 hover:bg-teal-800/20 rounded-lg text-sm font-bold transition-all">
               <BiImport size={16} /> Import
            </button>
            <button 
               onClick={() => setShowModal(true)}
               className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-bold shadow-sm shadow-teal-600/20 transition-all active:scale-95">
               <FiPlus size={18} /> Pelanggan Baru
            </button>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-gray-200 dark:border-[#2a2a30] pb-6">
        <div className="relative w-full sm:w-80 pt-5">
          <input 
            type="text" 
            placeholder="Cari data"
            className="pl-4 pr-10 py-2 w-full bg-gray-50 dark:bg-[#1a1a20] border border-gray-200 dark:border-[#2a2a30] rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none"
          />
          <div className="absolute right-3 top-1/2 mt-2.5 -translate-y-1/2 p-1">
            <FiSearch size={14} className="text-gray-500" />
          </div>
        </div>
        
        <div className="flex items-end gap-2 pt-5">
          <div className="flex flex-col gap-1 items-end">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tanggal Dibuat</span>
            <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-[#2a2a30] rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors">
              📅 ~ - ~
            </button>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-[#2a2a30] rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 transition-colors">
            <FiFilter size={16} /> Filter <span className="bg-emerald-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={dummyData} />

      {/* Modal Dialog Pelanggan Baru */}
      <ModalDialog 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title="Tambah Pelanggan Baru"
      >
        <div className="p-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="font-bold text-blue-800 dark:text-blue-400 text-lg border-b border-gray-200 dark:border-gray-800 pb-3">Informasi Pelanggan</h3>
            
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Nama Lengkap *</label>
              <input type="text" name="nama" value={formData.nama} onChange={handleInputChange} placeholder="Masukkan nama pelanggan" className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800 dark:text-gray-200" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Nomor Rekam Medis (Optional)</label>
                  <input type="text" name="rm" value={formData.rm} onChange={handleInputChange} placeholder="Otomatis jika kosong" className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800 dark:text-gray-200" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Tanggal Lahir</label>
                  <input type="date" name="tgllahir" value={formData.tgllahir} onChange={handleInputChange} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800 dark:text-gray-200" />
               </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Nomor Telepon/HP *</label>
              <input type="tel" name="telepon" value={formData.telepon} onChange={handleInputChange} placeholder="08xxxxxxxx" className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800 dark:text-gray-200" required />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Alamat</label>
              <textarea name="alamat" value={formData.alamat} onChange={handleInputChange} placeholder="Alamat lengkap" className="w-full h-24 resize-none bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800 dark:text-gray-200"></textarea>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-gray-300 dark:bg-[#1a1a20] flex justify-between items-center border-t border-gray-400 dark:border-gray-800 mt-auto">
            <button onClick={() => setShowModal(false)} className="text-gray-500 dark:text-gray-400 font-bold text-sm px-4 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">Batal</button>
            <button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors cursor-pointer">
              Simpan Pelanggan
            </button>
        </div>
      </ModalDialog>
    </div>
  );
}
