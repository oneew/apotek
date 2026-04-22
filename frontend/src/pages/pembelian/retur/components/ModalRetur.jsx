import React, { useState } from 'react';
import ModalDialog from '../../../../components/ui/ModalDialog';
import { FiRotateCcw, FiCalendar, FiTag, FiSearch, FiTruck, FiAlertCircle, FiPlus } from 'react-icons/fi';

export default function ModalRetur({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    noRetur: '',
    fakturAsal: '',
    supplier: '',
    catatan: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Menyimpan Retur Pembelian:', formData);
    onClose();
  };

  return (
    <ModalDialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Asset Return Claim" 
      subtitle="Establishing a formal return request for damaged or incorrect inventory shipments."
      icon={<FiRotateCcw />}
      maxWidth="max-w-[700px]"
    >
      <div className="p-8 space-y-6">
        <div className="bg-gray-50 dark:bg-gray-800/10 p-5 rounded-xl border border-gray-200 dark:border-gray-800 space-y-5">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
            <FiAlertCircle className="text-error-500" />
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm uppercase tracking-tight">Return Authorization Details</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-5">
             <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Effective Return Date</label>
                <input type="date" name="tanggal" value={formData.tanggal} onChange={handleChange} className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-xs font-semibold outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white" />
             </div>
             <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Case Identifier (Return No)</label>
                <input type="text" name="noRetur" value={formData.noRetur} onChange={handleChange} placeholder="System-generated if empty" className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-xs font-semibold outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white" />
             </div>
          </div>

          <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Historical Invoice Reference (Optional)</label>
            <div className="flex gap-2">
               <div className="relative flex-1">
                 <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                 <input type="text" name="fakturAsal" value={formData.fakturAsal} onChange={handleChange} placeholder="Search historical acquisition ledger..." className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg pl-9 pr-4 py-2 text-xs font-semibold outline-none focus:border-primary-500 transition-all dark:text-white" />
               </div>
               <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-lg text-[11px] uppercase transition-all shadow-sm">
                 Verify Invoice
               </button>
            </div>
          </div>

          <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Destined Vendor *</label>
            <div className="relative">
              <FiTruck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select name="supplier" value={formData.supplier} onChange={handleChange} className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg pl-9 pr-4 py-2 text-xs font-semibold outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white appearance-none">
                 <option value="">Select Recipient Vendor...</option>
                 <option value="1">PT. Kimia Farma Trading</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-1.5">
             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Asset Reversal Specification</label>
             <button className="w-full border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-error-500 bg-white dark:bg-gray-950 text-gray-400 hover:text-error-600 rounded-xl p-6 text-xs font-bold transition-all flex flex-col items-center justify-center gap-2 group">
                <div className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FiPlus size={20} />
                </div>
                <span className="uppercase tracking-widest">Connect Return Assets</span>
             </button>
          </div>

          <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Reason for Reversal (Clinical Context)</label>
            <textarea name="catatan" value={formData.catatan} onChange={handleChange} placeholder="Detail discrepancies such as seal breakage, transit damage, or protocol mismatch..." className="w-full h-24 resize-none bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-xs font-medium outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white shadow-sm"></textarea>
          </div>
        </div>
      </div>

      <div className="px-8 py-5 bg-gray-50 dark:bg-gray-950 flex justify-between items-center border-t border-gray-200 dark:border-gray-800 mt-auto">
          <button onClick={onClose} className="text-gray-500 font-bold text-[11px] uppercase tracking-tighter px-4 hover:text-gray-700 transition-all">Abort Claim</button>
          <button onClick={handleSave} className="bg-error-600 hover:bg-error-700 text-white font-bold py-2.5 px-8 rounded-lg text-xs uppercase shadow-md shadow-error-500/20 active:scale-95 transition-all">
            Authorize & Process Return
          </button>
      </div>
    </ModalDialog>
  );
}
