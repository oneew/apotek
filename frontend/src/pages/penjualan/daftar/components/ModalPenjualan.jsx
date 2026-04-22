import React, { useState } from 'react';
import ModalDialog from '../../../../components/ui/ModalDialog';
import { FiFileText, FiCalendar, FiTag, FiPlus, FiCheck, FiUser, FiActivity } from 'react-icons/fi';

export default function ModalPenjualan({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    noSp: '',
    pelanggan: '',
    catatan: '',
    status: 'Selesai'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Menyimpan Penjualan Manual:', formData);
    onClose();
  };

  return (
    <ModalDialog 
      isOpen={isOpen} 
      onClose={onClose}
      title="Manual Revenue Provisioning"
      subtitle="Authorized financial record entry for non-POS acquisition streams."
      icon={<FiFileText />}
      maxWidth="max-w-[700px]"
    >
      <div className="p-8 space-y-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="bg-gray-50 dark:bg-gray-950 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-900 pb-4">
             <FiActivity className="text-primary-500" />
             <h3 className="font-black text-gray-900 dark:text-gray-100 text-[10px] uppercase tracking-widest leading-none">Contextual Sales Metadata</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Acquisition Signature Date</label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white" />
                </div>
             </div>
             <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Reference Order ID (No. SP)</label>
                <input type="text" name="noSp" value={formData.noSp} onChange={handleChange} placeholder="System-stabilized if empty" className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2.5 text-xs font-semibold outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white" />
             </div>
          </div>

          <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Participant Engagement (Client)</label>
            <div className="relative">
               <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
               <select name="pelanggan" value={formData.pelanggan} onChange={handleChange} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white appearance-none">
                  <option value="">Select Authorized Participant...</option>
                  <option value="1">Tn. Budi Setiawan</option>
                  <option value="2">Ny. Siska Melani</option>
               </select>
            </div>
          </div>
          
          <div className="space-y-1.5">
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Inventory Allocation (Items)</label>
             <button className="w-full border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-primary-500/50 bg-white dark:bg-gray-900 text-gray-400 hover:text-primary-600 rounded-2xl p-6 text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 group">
                <div className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <FiPlus size={20} />
                </div>
                <span className="uppercase tracking-[0.15em] text-[10px]">Connect Acquisition Items</span>
             </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Lifecycle Stage</label>
                <div className="relative">
                  <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white appearance-none">
                     <option>Selesai</option>
                     <option>Dibatalkan</option>
                  </select>
                </div>
             </div>
          </div>

          <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Contextual Commentary (Notes)</label>
            <textarea name="catatan" value={formData.catatan} onChange={handleChange} placeholder="Detail clinical context or manual acquisition discrepancies..." className="w-full h-24 resize-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-4 py-3 text-xs font-semibold outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white shadow-sm"></textarea>
          </div>
        </div>
      </div>

      <div className="px-8 py-5 bg-gray-50 dark:bg-gray-950 flex justify-between items-center border-t border-gray-200 dark:border-gray-800 mt-auto">
          <button onClick={onClose} className="text-gray-400 font-black text-[10px] uppercase tracking-widest px-4 hover:text-gray-600 transition-colors">Abort entry</button>
          <button onClick={handleSave} className="bg-primary-600 hover:bg-primary-700 text-white font-black py-2.5 px-8 rounded-xl text-[11px] uppercase tracking-tighter shadow-xl shadow-primary-500/20 active:scale-95 transition-all flex items-center gap-2 group">
            <FiCheck className="group-hover:scale-125 transition-transform" />
            Commit Revenue Record
          </button>
      </div>
    </ModalDialog>
  );
}
