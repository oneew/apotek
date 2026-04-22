import React, { useState } from 'react';
import ModalDialog from '../../../../components/ui/ModalDialog';

export default function ModalPesanan({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    kanal: 'Offline',
    pelanggan: '',
    catatan: '',
    statusOrder: 'Pending',
    statusBayar: 'Belum Bayar'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // API logic to be implemented here
    console.log('Menyimpan Pesanan:', formData);
    onClose();
  };

  return (
    <ModalDialog 
      isOpen={isOpen} 
      onClose={onClose}
      title="Buat Pesanan Baru"
      maxWidth="max-w-[700px]"
    >
      <div className="p-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm space-y-5">
          <h3 className="font-bold text-blue-800 dark:text-blue-400 text-lg border-b border-gray-200 dark:border-gray-800 pb-3">Informasi Pesanan</h3>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Tanggal Transaksi</label>
                <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800 dark:text-gray-200" />
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Kanal Penjualan</label>
                <select name="kanal" value={formData.kanal} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800 dark:text-gray-200">
                   <option>Offline / Walk-in</option>
                   <option>Tokopedia</option>
                   <option>Shopee</option>
                   <option>WhatsApp</option>
                </select>
             </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Pelanggan</label>
            <div className="flex gap-2">
               <select name="pelanggan" value={formData.pelanggan} onChange={handleChange} className="flex-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800 dark:text-gray-200">
                  <option value="">Pilih Pelanggan...</option>
                  <option value="1">Tn. Budi</option>
                  <option value="2">Ny. Siska</option>
               </select>
               <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer shrink-0">
                 + Baru
               </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Status Order</label>
                <select name="statusOrder" value={formData.statusOrder} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800 dark:text-gray-200">
                   <option>Pending</option>
                   <option>Diproses</option>
                   <option>Selesai</option>
                </select>
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Status Bayar</label>
                <select name="statusBayar" value={formData.statusBayar} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800 dark:text-gray-200">
                   <option>Belum Bayar</option>
                   <option>Dibayar Sebagian</option>
                   <option>Lunas</option>
                </select>
             </div>
          </div>

          <div>
             <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Produk Dipesan</label>
             <button className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 bg-gray-50 dark:bg-gray-800/50 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg p-4 text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
               + Tambah Item Produk
             </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1.5">Catatan</label>
            <textarea name="catatan" value={formData.catatan} onChange={handleChange} placeholder="Tulis instruksi tambahan..." className="w-full h-24 resize-none bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-800 dark:text-gray-200"></textarea>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-200 dark:bg-[#1a1a20] flex justify-between items-center border-t border-gray-300 dark:border-gray-800 mt-auto">
          <button onClick={onClose} className="text-gray-600 dark:text-gray-400 font-bold text-sm px-4 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">Batal</button>
          <button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors cursor-pointer">
            Simpan Pesanan
          </button>
      </div>
    </ModalDialog>
  );
}
