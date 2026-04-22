import React, { useState } from 'react';
import ModalDialog from '../../../../components/ui/ModalDialog';

export default function ModalRetur({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    noRetur: '',
    fakturAsal: '',
    pelanggan: '',
    catatan: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Menyimpan Retur Penjualan:', formData);
    onClose();
  };

  return (
    <ModalDialog 
      isOpen={isOpen} 
      onClose={onClose}
      title="Catat Retur Penjualan"
      maxWidth="max-w-[700px]"
    >
      <div className="p-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-5">
          <h3 className="font-bold text-red-800 dark:text-red-400 text-lg border-b border-gray-200 dark:border-gray-800 pb-3">Informasi Retur</h3>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Tanggal Retur</label>
                <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-500 text-gray-800 dark:text-gray-200" />
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">No. Retur</label>
                <input type="text" name="noRetur" value={formData.noRetur} onChange={handleChange} placeholder="Otomatis jika kosong" className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-500 text-gray-800 dark:text-gray-200" />
             </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">No. Faktur Asal (Opsional)</label>
            <div className="flex gap-2">
               <input type="text" name="fakturAsal" value={formData.fakturAsal} onChange={handleChange} placeholder="Masukkan nomor kasir / invoice asal..." className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-500 text-gray-800 dark:text-gray-200" />
               <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer shrink-0">
                 Cari Faktur
               </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Pelanggan</label>
            <select name="pelanggan" value={formData.pelanggan} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-500 text-gray-800 dark:text-gray-200">
               <option value="">Pilih Pelanggan / Walk-in...</option>
               <option value="1">Tn. Budi</option>
               <option value="2">Ny. Siska</option>
            </select>
          </div>
          
          <div>
             <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Produk yang Diretur</label>
             <button className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-red-500 dark:hover:border-red-400 bg-gray-50 dark:bg-gray-800/50 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-lg p-4 text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
               + Tambah Item Produk
             </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Alasan Retur</label>
            <textarea name="catatan" value={formData.catatan} onChange={handleChange} placeholder="Alasan retur (exp: rusak, kadaluarsa, salah barang)..." className="w-full h-24 resize-none bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-500 text-gray-800 dark:text-gray-200"></textarea>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-200 dark:bg-[#1a1a20] flex justify-between items-center border-t border-gray-300 dark:border-gray-800 mt-auto">
          <button onClick={onClose} className="text-gray-600 dark:text-gray-400 font-bold text-sm px-4 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">Batal</button>
          <button onClick={handleSave} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors cursor-pointer">
            Proses Retur
          </button>
      </div>
    </ModalDialog>
  );
}
