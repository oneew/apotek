import React, { useState, useEffect } from 'react';
import ModalDialog from '../../../../components/ui/ModalDialog';
import { FiX, FiPrinter, FiPackage, FiCalendar, FiUser, FiInfo, FiActivity, FiLayers } from 'react-icons/fi';

export default function ModalDetailRencana({ isOpen, onClose, id }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && id) {
      fetchDetail();
    }
  }, [isOpen, id]);

  const fetchDetail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/master/rencana-pembelian/${id}`);
      const result = await response.json();
      if (result.status) setData(result.data);
    } catch (err) {
      console.error('Error fetching detail:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalDialog 
        isOpen={isOpen} 
        onClose={onClose} 
        title="Requisition Specification" 
        subtitle="Reviewing detailed procurement plan and authorization status."
        icon={<FiLayers />}
        maxWidth="max-w-4xl"
    >
      <div className="p-8 space-y-8">
        {isLoading ? (
          <div className="py-24 text-center">
              <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Synchronizing record...</span>
          </div>
        ) : data ? (
          <>
            {/* Master Summary Section */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4">
                        <div className="inline-flex items-center px-2.5 py-0.5 bg-primary-50 text-primary-700 border border-primary-100 rounded-full text-[10px] font-bold uppercase tracking-tight">
                            {data.status || 'DRAFT'} STATUS
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">{data.no_rencana}</h2>
                            <div className="flex items-center gap-4 mt-1 text-xs font-medium text-gray-500">
                                <span className="flex items-center gap-1.5"><FiCalendar size={14} className="text-gray-400" /> {new Date(data.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                <span className="flex items-center gap-1.5"><FiUser size={14} className="text-gray-400" /> SYSTEM_ADMIN</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:items-end justify-center md:border-l md:border-gray-100 dark:md:border-gray-800 md:pl-8">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Assets</span>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tighter">
                            {data.items?.length || 0} <span className="text-sm font-semibold text-gray-400 uppercase ml-1">SKUs</span>
                        </h3>
                    </div>
                </div>
            </div>

            {/* Context Banner */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex gap-3 items-start">
                <FiActivity size={18} className="text-primary-600 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Strategic Brief</span>
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium italic">
                        "{data.keterangan || 'No additional strategic context provided for this requisition.'}"
                    </p>
                </div>
            </div>

            {/* List Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                            <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider text-left">Asset Details</th>
                            <th className="px-6 py-3 text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider w-32">Qty</th>
                            <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Primary Source</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {data.items?.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-xs">{item.nama_produk}</span>
                                        <span className="text-[10px] text-gray-400 font-medium tracking-tight uppercase">ID: {item.produk_id}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="text-sm font-bold text-primary-700 dark:text-primary-400">
                                        {item.jumlah}
                                        <span className="text-[10px] font-semibold opacity-60 ml-1 uppercase">Units</span>
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight">
                                        <div className="w-1.5 h-1.5 rounded-full bg-success-500" />
                                        {item.nama_supplier || 'GENERAL SOURCE'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Decision Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                    <FiInfo className="text-gray-400" size={14} />
                    <span className="text-[10px] font-medium text-gray-500 uppercase tracking-tight">Status will transition to ORDERED upon PO generation.</span>
                </div>
                <div className="flex gap-3">
                    <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95">
                        <FiPrinter size={16} /> Print Manifesto
                    </button>
                    <button onClick={onClose} className="px-8 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95">
                        Close View
                    </button>
                </div>
            </div>
          </>
        ) : (
          <div className="py-20 text-center opacity-40">
            <FiPackage size={64} className="mx-auto mb-4 text-gray-300" />
            <p className="text-error-600 font-bold uppercase tracking-wider text-xs">Record context not accessible.</p>
          </div>
        )}
      </div>
    </ModalDialog>
  );
}
