import React from 'react';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function FormTemplateRacikan() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1e1e24] pb-12 -m-6">
      {/* Top Blue Header */}
      <div className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Buat Template Racikan</h1>
        </div>
        <button className="bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors cursor-pointer">
          Simpan
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto pt-6 px-6">
        <div className="bg-white dark:bg-[#1e1e24] shadow-sm rounded-xl overflow-hidden border border-gray-100 dark:border-[#2a2a30]">
           {/* Top Inputs */}
           <div className="flex flex-wrap gap-4 p-6 border-b border-gray-100 dark:border-[#2a2a30] bg-gray-50 dark:bg-[#232329]">
              <div className="flex-1 min-w-[200px]">
                 <label className="block text-xs font-bold text-gray-500 mb-1.5">Nama Racikan*</label>
                 <input type="text" value="Racikan B260418-1-1-2" readOnly className="w-full bg-gray-100 dark:bg-gray-800 border-transparent rounded-lg px-3 py-2 text-sm font-medium outline-none text-gray-500" />
              </div>
              <div className="flex-[1.5] min-w-[250px]">
                 <label className="block text-xs font-bold text-gray-500 mb-1.5">Satuan/Bentuk Sediaan*</label>
                 <div className="flex items-center gap-2">
                   <select className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium outline-none text-gray-400">
                     <option>Pilih satuan kemasan</option>
                   </select>
                   <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"><FiPlus size={16} /></button>
                 </div>
              </div>
              <div className="flex-[2] min-w-[300px]">
                 <label className="block text-xs font-bold text-gray-500 mb-1.5">Catatan</label>
                 <input type="text" className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium outline-none text-gray-400" />
              </div>
           </div>

           <div className="p-6">
             <h2 className="text-base font-extrabold text-blue-800 dark:text-blue-400 mb-6">Komposisi & Dosis / satuan</h2>
             
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="border-b border-gray-100 dark:border-[#2a2a30]">
                      <th className="py-3 text-xs font-bold text-gray-500 w-16 text-center">No.</th>
                      <th className="py-3 text-xs font-bold text-gray-500">Produk</th>
                      <th className="py-3 text-xs font-bold text-gray-500 w-48 text-center">Kuantitas</th>
                      <th className="py-3 text-xs font-bold text-gray-500 w-48 text-center">Satuan</th>
                   </tr>
                </thead>
                <tbody>
                   <tr className="border-b border-gray-100 dark:border-[#2a2a30]/50 hover:bg-gray-50 dark:hover:bg-gray-800/20">
                      <td className="py-4 text-center"><FiPlus className="mx-auto text-gray-400" /></td>
                      <td className="py-4">
                         <input type="text" placeholder="Tambahkan Produk" className="w-full max-w-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm outline-none" />
                      </td>
                      <td className="py-4 text-center"></td>
                      <td className="py-4 text-center"></td>
                   </tr>
                </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
}
