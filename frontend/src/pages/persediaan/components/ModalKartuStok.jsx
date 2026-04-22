import React, { useState, useEffect } from 'react';
import ModalDialog from '../../../components/ui/ModalDialog';
import DataTable from '../../../components/ui/DataTable';
import { FiArrowUpRight, FiArrowDownLeft, FiCalendar, FiFileText, FiActivity } from 'react-icons/fi';

export default function ModalKartuStok({ isOpen, onClose, productId }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && productId) {
      fetchData();
    }
  }, [isOpen, productId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/master/stok/card/${productId}`);
      const result = await response.json();
      if (result.status) setData(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { label: 'Time & Log', key: 'tanggal', width: '220px', render: (val) => (
        <div className="flex flex-col">
            <div className="flex items-center gap-2 text-xs font-black text-gray-800 dark:text-gray-200">
                <FiCalendar className="text-primary-500" size={12} />
                {new Date(val).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            <div className="text-[10px] font-bold text-gray-400 mt-0.5 ml-5">
                {new Date(val).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
            </div>
        </div>
    )},
    { label: 'Movement', key: 'jenis_mutasi', width: '130px', align: 'center', render: (val) => (
        <div className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
            val === 'Masuk' 
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' 
                : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20'
        }`}>
            {val === 'Masuk' ? <FiArrowDownLeft size={10} /> : <FiArrowUpRight size={10} />}
            {val}
        </div>
    )},
    { label: 'Qty', key: 'jumlah', width: '100px', render: (val) => <span className="font-black text-gray-800 dark:text-gray-200">{val} unit</span> },
    { label: 'Running Balance', key: 'sisa_stok', width: '150px', render: (val) => (
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
            <span className="font-black text-primary-600 dark:text-primary-400">{val} unit</span>
        </div>
    )},
    { label: 'Reference No.', key: 'referensi', width: '180px', render: (val) => (
        <div className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-tighter">
            <FiFileText size={12} className="opacity-60" />
            {val || 'SYSTEM_GEN'}
        </div>
    )},
    { label: 'Extended Notes', key: 'keterangan', render: (val) => (
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 line-clamp-1 italic">
            {val || 'No additional activity logged'}
        </span>
    )}
  ];

  return (
    <ModalDialog 
        isOpen={isOpen} 
        onClose={onClose} 
        title="Stock History Ledger" 
        subtitle="Detailed audit trail of product inventory movements"
        icon={<FiActivity className="text-primary-600" />}
        maxWidth="max-w-6xl"
    >
      <div className="p-4 bg-white dark:bg-[#1e1e24]">
        <div className="bg-gray-50/50 dark:bg-gray-900/30 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-2 overflow-hidden">
            <DataTable columns={columns} data={data} isLoading={isLoading} />
        </div>
      </div>
    </ModalDialog>
  );
}
