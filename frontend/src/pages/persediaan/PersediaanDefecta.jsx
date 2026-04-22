import React, { useState } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import ModalDialog from '../../components/ui/ModalDialog';
import { FiFilter, FiSearch, FiX, FiZap, FiPackage, FiShoppingCart, FiActivity, FiShield, FiInfo, FiAlertCircle } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';

export default function PersediaanDefecta() {
  const [showOtomatisModal, setShowOtomatisModal] = useState(false);
  const [useLargestUnit, setUseLargestUnit] = useState(true);

  const columns = [
    { label: 'Asset Details', key: 'nama', render: (val, row) => (
      <div className="flex flex-col py-0.5">
        <span className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-xs">{val || 'Aspirin 500mg'}</span>
        <span className="text-[10px] text-gray-400 font-medium tracking-tight uppercase mt-0.5">{row.kategori || 'GENERAL CARE'}</span>
      </div>
    )},
    { label: 'Balance', key: 'stok', align: 'center', width: '120px', render: (val) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-error-50 text-error-700 border border-error-100 dark:bg-error-950/20 dark:border-error-900`}>
        {val || 0} UNIT
      </span>
    )},
    { label: 'Threshold (Min/Max)', key: 'threshold', align: 'center', width: '150px', render: (_, row) => (
      <div className="flex items-center gap-1.5 justify-center">
        <span className="text-xs font-semibold text-gray-500">{row.stokMin || 10}</span>
        <span className="text-gray-300">/</span>
        <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">{row.stokMax || 100}</span>
      </div>
    )},
    { label: 'Preferred Vendor', key: 'supplier', render: (val) => <span className="text-[11px] font-semibold text-primary-700 uppercase tracking-tight">{val || 'PBF Kimia Farma'}</span> },
    { label: 'Pipeline (In)', key: 'dipesan', align: 'center', width: '140px', render: (val) => (
       <div className="flex items-center gap-2 justify-center">
         <div className="w-1.5 h-1.5 rounded-full bg-success-500" />
         <span className="text-[11px] font-bold text-success-700">{val || 0} PCS</span>
       </div>
    )},
    { label: 'Cart Status', key: 'keranjang', align: 'right', width: '100px', render: (val) => <span className="text-xs font-semibold text-gray-400">{val || 0} ITEMS</span> }
  ];

  const dummyData = [
     { nama: 'Amoxicillin 500mg', stok: 2, stokMin: 20, stokMax: 100, supplier: 'PBF Anugerah', kategori: 'ANTIBIOTICS', dipesan: 50, keranjang: 0 },
     { nama: 'Paracetamol 500mg', stok: 5, stokMin: 50, stokMax: 200, supplier: 'PBF Kimia Farma', kategori: 'ANALGESICS', dipesan: 0, keranjang: 0 },
  ];

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-20">
      <SectionHeader 
        title="Predictive Defecta" 
        subtitle="Analytic monitoring of stock deficits and replenishment requirements."
        icon={<FiZap className="text-gray-500" size={24} />}
        rightContent={
          <button 
            onClick={() => setShowOtomatisModal(true)} 
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95 group"
          >
             <BsStars size={18} className="group-hover:rotate-45 transition-all" /> Smart Replenish
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Critical Balance', count: '12 Items', sub: 'Below threshold', color: 'error', icon: <FiAlertCircle size={20} /> },
          { label: 'Stock-Out', count: '5 Assets', sub: 'Zero inventory', color: 'amber', icon: <FiPackage size={20} /> },
          { label: 'Order Drafts', count: '2 Requisitions', sub: 'Pending approval', color: 'success', icon: <FiShoppingCart size={20} /> },
        ].map((card, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-5">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${card.color === 'error' ? 'bg-error-50 text-error-600 border-error-100' : card.color === 'amber' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-success-50 text-success-600 border-success-100'}`}>
              {card.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider leading-none mb-1">{card.label}</span>
              <div className="flex items-baseline gap-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{card.count}</h3>
                <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase">{card.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
        <DataTable 
          columns={columns} 
          data={dummyData} 
          searchPlaceholder="Audit deficit by product signature or vendor..."
        />
      </div>

      <ModalDialog
        isOpen={showOtomatisModal}
        onClose={() => setShowOtomatisModal(false)}
        title="Intelligent Replenishment"
        subtitle="Automatic generation of procurement plans based on stock dynamics."
        maxWidth="max-w-xl"
        icon={<FiZap />}
      >
        <div className="p-8 space-y-8">
          <div className="flex gap-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
             <FiInfo size={18} className="text-primary-600 shrink-0 mt-0.5" />
             <p className="text-xs font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
               The algorithm will identify assets <span className="text-error-600 font-bold">below threshold</span> and calculate restock quantities to reach target capacity, accounting for pending shipments.
             </p>
          </div>

          <div className="space-y-6">
             <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">Bulk Packaging Priority</span>
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">Utilize largest available units</span>
                </div>
                <button 
                  onClick={() => setUseLargestUnit(!useLargestUnit)}
                  className={`w-11 h-6 rounded-full flex items-center px-1 transition-all duration-300 ${useLargestUnit ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-800'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${useLargestUnit ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Target Category</label>
                  <select className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-medium outline-none">
                    <option>ALL CLASSIFICATIONS</option>
                  </select>
                </div>

                <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                  <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Preferred Source</label>
                  <select className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-medium outline-none">
                    <option>SELECT SUPPLIER...</option>
                  </select>
                </div>
             </div>

             <div className="flex bg-gray-50 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                <button className="flex-1 py-2 text-[10px] font-bold uppercase tracking-wider bg-white dark:bg-gray-700 text-primary-600 rounded-md shadow-sm">Historical Logic</button>
                <button className="flex-1 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-gray-600 transition-colors">Latest Market</button>
                <button className="flex-1 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-gray-600 transition-colors">Volume Bias</button>
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button onClick={() => setShowOtomatisModal(false)} className="px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-all">Cancel</button>
            <button 
              onClick={() => console.log('Replenishing...')} 
              className="px-10 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              Generate Purchase Plan
            </button>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
}
