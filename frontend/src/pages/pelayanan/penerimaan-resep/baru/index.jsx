import React, { useState } from 'react';
import { FiArrowLeft, FiEdit2, FiPlus, FiTrash2, FiChevronUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function FormPenerimaanResep() {
  const navigate = useNavigate();
  const [items, setItems] = useState([{ id: 1, type: 'racikan' }]);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), type: 'racikan' }]);
  };

  const handleRemoveItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1e1e24] pb-12 -m-6 relative">
      {/* Top Blue Header */}
      <div className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Berkas Resep</h1>
        </div>
        <button className="bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors cursor-pointer">
          Simpan
        </button>
      </div>

      <div className="max-w-[1000px] mx-auto pt-6 px-6">
        {/* Top Control Bar */}
        <div className="bg-white dark:bg-[#232329] border border-gray-200 dark:border-[#2a2a30] rounded-xl p-4 flex flex-wrap gap-4 shadow-sm mb-6 items-end">
          <div className="flex-1 min-w-[200px]">
             <label className="block text-xs font-bold text-gray-500 mb-1.5">Tipe Data *</label>
             <select className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium outline-none">
                <option>Teks Digital</option>
             </select>
          </div>
          <div className="flex-1 min-w-[200px]">
             <label className="block text-xs font-bold text-gray-500 mb-1.5">Kode Resep*</label>
             <input type="text" value="RXB260418-1-1-1" readOnly className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium outline-none" />
          </div>
          <div className="flex-1 min-w-[200px]">
             <label className="block text-xs font-bold text-gray-500 mb-1.5">Tanggal Resep</label>
             <input type="date" defaultValue="2026-04-18" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium outline-none" />
          </div>
          
          <div className="flex-1 min-w-[250px]">
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Pelanggan/Pasien *</label>
            <div className="flex items-center gap-2">
              <select className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium outline-none">
                <option>andi | 6282279727571</option>
              </select>
              <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"><FiEdit2 size={16} /></button>
              <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"><FiPlus size={16} /></button>
            </div>
          </div>
          <div className="flex-1 min-w-[250px]">
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Dokter *</label>
            <div className="flex items-center gap-2">
              <select className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium outline-none">
                <option>Aqeela Nayyira Afwa</option>
              </select>
              <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"><FiEdit2 size={16} /></button>
              <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"><FiPlus size={16} /></button>
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
             <label className="block text-xs font-bold text-gray-500 mb-1.5">Jenis Resep</label>
             <select className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium outline-none">
                <option>Resep Masuk</option>
             </select>
          </div>
        </div>

        {/* Center Card */}
        <div className="bg-white dark:bg-[#1e1e24] border border-blue-100 dark:border-blue-900/30 rounded-2xl shadow-sm mb-24 overflow-hidden">
           {/* Doctor Info Header */}
           <div className="text-center py-6 border-b border-gray-100 dark:border-[#2a2a30]">
              <h2 className="text-xl font-extrabold text-blue-800 dark:text-blue-400">Aqeela Nayyira Afwa</h2>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">Anak</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">No. SIP: 123456789</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Pabnuli</p>
           </div>
           
           <div className="p-8 pb-12 max-w-2xl mx-auto space-y-6 relative">
              <div className="flex items-center gap-4 mb-6">
                 <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Iter Resep</span>
                 <input type="text" defaultValue="1" className="flex-1 bg-gray-50 dark:bg-[#232329] border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium outline-none" />
              </div>

              {items.map((item, index) => (
                <div key={item.id} className="flex items-start gap-4 mb-8 pb-8 border-b border-gray-100 dark:border-[#2a2a30] relative animate-in fade-in slide-in-from-top-4 duration-300">
                   <span className="text-xl font-extrabold text-blue-800 dark:text-blue-400 pt-2 w-8">R/</span>
                   <div className="flex-1">
                      <div className="flex gap-4">
                        <textarea defaultValue="- pcx" className="flex-1 h-24 resize-none bg-gray-50 dark:bg-[#232329] border border-gray-200 dark:border-[#2a2a30] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className={`pt-2 transition-colors ${items.length === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-500'}`}
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>

                      {/* Drug Selector */}
                      <div className="flex items-center gap-3 mt-4">
                         <input type="text" defaultValue="Amoxicillin 500 mg" className="flex-1 bg-gray-50 dark:bg-[#232329] border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm outline-none" />
                         <input type="number" defaultValue="1" className="w-20 bg-gray-50 dark:bg-[#232329] border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm outline-none text-center" />
                         <select className="w-24 bg-gray-50 dark:bg-[#232329] border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm outline-none">
                           <option>Strip</option>
                         </select>
                      </div>

                      <div className="flex items-center gap-4 mt-4">
                         <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Iter Item</span>
                         <input type="text" placeholder="Masukkan iter item" className="flex-1 bg-gray-100 dark:bg-[#232329] border-transparent rounded-lg px-3 py-1.5 text-sm text-gray-400 text-center" readOnly />
                      </div>

                      {/* Catatan/Etiket */}
                      <div className="mt-6 border border-gray-100 dark:border-[#2a2a30] rounded-xl overflow-hidden">
                         <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-[#2a2a30]">
                           <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Catatan/Etiket</span>
                           <FiChevronUp className="text-gray-400" />
                         </div>
                         <div className="p-4 flex gap-4">
                           <textarea defaultValue="ddd" className="flex-1 h-20 resize-none bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-[#2a2a30] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                           <button className="text-red-500 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 px-3 rounded-lg transition-colors">Reset</button>
                         </div>
                      </div>
                   </div>
                </div>
              ))}
           </div>

           {/* Add button spanning bottom */}
           <div className="absolute left-1/2 -translate-x-1/2 bottom-20 z-10 w-full flex justify-center pb-6">
             <button 
               onClick={handleAddItem}
               className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 active:scale-95">
               <FiPlus size={20} /> Tambah Item
             </button>
           </div>
        </div>
      </div>

      {/* Fixed Bottom Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-50 dark:bg-[#1e1e24] border-t border-gray-200 dark:border-[#2a2a30] p-4 z-40 flex gap-6 px-12">
         <div className="w-1/3">
           <label className="block text-xs font-bold text-gray-500 mb-1.5">Status Penebusan</label>
           <select className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium outline-none">
              <option>Belum Ditebus</option>
           </select>
         </div>
         <div className="flex-1">
           <label className="block text-xs font-bold text-gray-500 mb-1.5">Catatan</label>
           <input type="text" placeholder="Masukkan Catatan jika ada" className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium outline-none" />
         </div>
      </div>
    </div>
  );
}
