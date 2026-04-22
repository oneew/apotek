import React from 'react';
import { FiArrowLeft, FiPlus, FiTrash2, FiFileText } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function FormPenebusanResep() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1e1e24] pb-24 -m-6 relative">
      {/* Top Blue Header */}
      <div className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Penebusan Resep</h1>
        </div>
        <button className="bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors cursor-pointer">
          Simpan
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto pt-6 px-6">
        {/* Top Inputs */}
        <div className="bg-white dark:bg-[#232329] border border-gray-200 dark:border-[#2a2a30] rounded-xl p-4 flex flex-wrap gap-4 shadow-sm mb-6 items-end">
          <div className="flex-1 min-w-[200px]">
             <label className="block text-xs font-bold text-gray-500 mb-1.5">Nama Resep*</label>
             <input type="text" defaultValue="Resep" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium outline-none" />
          </div>
          <div className="flex-1 min-w-[200px]">
             <label className="block text-xs font-bold text-gray-500 mb-1.5">Kode Resep*</label>
             <input type="text" value="RXB260418-1-1-3" readOnly className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium outline-none" />
          </div>
          <div className="flex-1 min-w-[150px]">
             <label className="block text-xs font-bold text-gray-500 mb-1.5">Tanggal Resep</label>
             <input type="date" defaultValue="2026-04-18" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium outline-none" />
          </div>
          <div className="flex-[2] min-w-[300px]">
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Pelanggan/Pasien *</label>
            <div className="flex items-center gap-2">
              <select className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium outline-none">
                <option>andi | 6282279727571 | EMR000001 | CUS000001</option>
              </select>
              <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"><FiPlus size={16} /></button>
            </div>
          </div>
          <div className="flex-[2] min-w-[250px]">
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Dokter *</label>
            <div className="flex items-center gap-2">
              <select className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium outline-none">
                <option>Aqeela Nayyira Afwa</option>
              </select>
              <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"><FiPlus size={16} /></button>
            </div>
          </div>
        </div>

        {/* Dynamic Table Input Area */}
        <div className="bg-white dark:bg-[#1e1e24] shadow-sm rounded-xl overflow-hidden border border-gray-100 dark:border-[#2a2a30] min-h-[400px]">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="border-b border-gray-100 dark:border-[#2a2a30]">
                    <th className="py-4 px-4 text-xs font-bold text-gray-500 w-16 text-center">No.</th>
                    <th className="py-4 px-4 text-xs font-bold text-gray-500">Nama Produk</th>
                    <th className="py-4 px-4 text-xs font-bold text-gray-500 w-32 text-center">Kuantitas</th>
                    <th className="py-4 px-4 text-xs font-bold text-gray-500 w-40">Satuan</th>
                    <th className="py-4 px-4 text-xs font-bold text-gray-500 w-48">Opsi Harga</th>
                    <th className="py-4 px-4 text-xs font-bold text-gray-500 w-40">Harga Jual</th>
                    <th className="py-4 px-4 text-xs font-bold text-gray-500 w-40">Sub Total</th>
                 </tr>
              </thead>
              <tbody>
                 <tr className="border-b border-gray-100 dark:border-[#2a2a30]/50 hover:bg-gray-50 dark:hover:bg-gray-800/20">
                    <td className="py-4 px-4 text-center text-sm font-bold text-gray-600 dark:text-gray-400">1</td>
                    <td className="py-4 px-4">
                       <div className="flex items-center gap-3">
                         <span className="text-sm font-bold text-gray-700 dark:text-gray-300 flex-1">Amoxicillin 500 mg</span>
                         <button className="text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 p-1.5 rounded"><FiFileText size={16} /></button>
                         <button className="text-red-500 hover:text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 p-1.5 rounded"><FiTrash2 size={16} /></button>
                       </div>
                    </td>
                    <td className="py-4 px-4">
                       <input type="number" defaultValue="1" className="w-full text-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg py-1.5 text-sm font-medium outline-none" />
                    </td>
                    <td className="py-4 px-4">
                       <select className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 text-sm font-medium outline-none">
                         <option>Strip</option>
                       </select>
                    </td>
                    <td className="py-4 px-4">
                       <select className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 text-sm font-medium outline-none">
                         <option>#1 Harga Utama</option>
                       </select>
                    </td>
                    <td className="py-4 px-4">
                       <input type="text" readOnly value="18.000" className="w-full text-right bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm font-medium outline-none text-gray-400" />
                    </td>
                    <td className="py-4 px-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                       Rp. 18.000
                    </td>
                 </tr>
                 
                 {/* Empty rows to mimic structure */}
                 <tr>
                    <td className="py-4 px-4 text-center"><FiPlus className="mx-auto text-gray-400" /></td>
                    <td className="py-4 px-4">
                       <input type="text" placeholder="Tambahkan Produk" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm outline-none" />
                    </td>
                    <td colSpan="5"></td>
                 </tr>
                 <tr>
                    <td className="py-2 px-4 text-center text-xs"></td>
                    <td className="py-2 px-4 flex gap-2">
                       <select className="w-64 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-1.5 text-sm font-medium outline-none text-gray-500">
                         <option>Tambahkan Racikan</option>
                       </select>
                       <button className="bg-blue-600 hover:bg-blue-700 text-white rounded p-1.5"><FiPlus /></button>
                    </td>
                    <td colSpan="5"></td>
                 </tr>
              </tbody>
           </table>
        </div>
      </div>

      {/* Fixed Bottom Footer for Totals */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-50 dark:bg-[#1e1e24] border-t border-gray-200 dark:border-[#2a2a30] p-4 z-40 px-12 pb-6">
         <div className="max-w-[1400px] mx-auto flex gap-6 items-end">
            <div className="w-48">
              <label className="block text-xs font-bold text-blue-800 dark:text-blue-400 mb-1">Total Harga Barang</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Rp.</span>
                <input type="text" value="18.000" readOnly className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 px-1 py-1 text-sm font-bold text-right outline-none" />
              </div>
            </div>
            <div className="w-48">
              <label className="block text-xs font-bold text-blue-800 dark:text-blue-400 mb-1">Embalase</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Rp.</span>
                <input type="number" defaultValue="0" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm font-bold text-right outline-none" />
              </div>
            </div>
            <div className="w-48">
              <label className="block text-xs font-bold text-blue-800 dark:text-blue-400 mb-1">Service</label>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Rp.</span>
                <input type="number" defaultValue="0" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm font-bold text-right outline-none" />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-blue-800 dark:text-blue-400 mb-1">Catatan</label>
              <input type="text" placeholder="Masukkan Catatan jika ada" className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded px-3 py-1 text-sm outline-none" />
            </div>
            
            <div className="flex items-center justify-between w-[300px] ml-auto">
               <span className="text-2xl font-black text-blue-800 dark:text-blue-400 uppercase tracking-widest">Total</span>
               <span className="text-3xl font-black text-blue-800 dark:text-blue-400">Rp. 18.000,00</span>
            </div>
         </div>
      </div>
    </div>
  );
}
