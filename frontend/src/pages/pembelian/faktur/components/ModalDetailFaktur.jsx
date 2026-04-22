import React, { useState, useEffect } from 'react';
import ModalDialog from '../../../../components/ui/ModalDialog';
import { FiX, FiPrinter, FiPackage, FiCalendar, FiUser, FiFileText, FiActivity, FiArrowRight, FiTruck } from 'react-icons/fi';

export default function ModalDetailFaktur({ isOpen, onClose, id }) {
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
      const response = await fetch(`http://localhost:8080/api/master/pembelian/${id}`);
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
      title="Acquisition Specification" 
      subtitle="Detailed technical audit of the synchronized purchase invoice record."
      icon={<FiFileText />}
      maxWidth="max-w-[900px]"
    >
      {isLoading ? (
        <div className="py-24 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-3 border-gray-100 border-t-primary-600 rounded-full animate-spin"></div>
            <div className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] animate-pulse">Synchronizing Secure Ledger...</div>
        </div>
      ) : data ? (
        <div className="space-y-6 p-8 bg-white dark:bg-gray-950">
          {/* Header Dashboard Section */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                        data.status === 'Draft' 
                        ? 'bg-warning-50 text-warning-700 border border-warning-200' 
                        : 'bg-success-50 text-success-700 border border-success-200'
                    }`}>
                        {data.status || 'Posted'}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight bg-primary-50 text-primary-700 border border-primary-200">
                         {data.status_pembayaran}
                    </span>
                    {data.po_id && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight bg-gray-100 text-gray-600 border border-gray-200">
                         Ref: PO-CONN
                      </span>
                    )}
                </div>
                <div>
                   <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white uppercase leading-none">
                      {data.no_faktur}
                   </h2>
                   <div className="flex items-center gap-2 mt-2 text-gray-500 font-semibold text-xs transition-colors">
                      <FiTruck className="text-primary-500" /> {data.nama_supplier}
                   </div>
                </div>
            </div>

            <div className="text-left md:text-right">
                <div className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Aggregate Liability</div>
                <div className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 italic tabular-nums">
                    Rp {parseFloat(data.grand_total || 0).toLocaleString('id-ID')}
                </div>
            </div>
          </div>

          {/* Stats Infobox Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
                { label: 'Date Received', value: new Date(data.tanggal_pembelian).toLocaleDateString('en-GB'), icon: FiCalendar, variant: 'neutral' },
                { label: 'Maturity Forecast', value: data.tanggal_jatuh_tempo ? new Date(data.tanggal_jatuh_tempo).toLocaleDateString('en-GB') : 'N/A', icon: FiActivity, variant: 'neutral' },
                { label: 'Inventory State', value: data.status === 'Draft' ? 'Pending Store' : 'Active Stock', icon: FiPackage, variant: 'neutral' }
            ].map((stat, i) => (
                <div key={i} className="flex items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm transition-all">
                    <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 text-gray-400 rounded-lg flex items-center justify-center border border-gray-100 dark:border-gray-700">
                        <stat.icon size={18} />
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">{stat.value}</p>
                    </div>
                </div>
            ))}
          </div>

          {/* High Density Line Item Table */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/30">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <FiActivity size={14} className="text-primary-500" /> Synchronization Matrix
                </span>
                <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                    {data.items?.length || 0} LINE ENTRIES
                </span>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                            <th className="px-6 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-tight">System Specification</th>
                            <th className="px-6 py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-tight">Acq Logic</th>
                            <th className="px-6 py-3 text-center text-[10px] font-bold text-gray-400 uppercase tracking-tight">Volume</th>
                            <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-tight">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {data.items?.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-900 dark:text-gray-100 uppercase text-xs tracking-tight">
                                        {item.nama_produk}
                                    </div>
                                    <div className="text-[9px] text-gray-400 font-medium uppercase mt-0.5 tracking-tight">Asset Index: {item.produk_id}</div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex flex-col items-center">
                                      <div className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-[9px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-tighter">
                                          LOT: {item.no_batch}
                                      </div>
                                      <div className="text-[9px] font-bold text-primary-500 mt-1 uppercase">EXP: {item.tanggal_expired}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      <span className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">
                                          {item.jumlah_beli}
                                      </span>
                                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Units</span>
                                    </div>
                                    <div className="text-[9px] text-gray-400 font-medium mt-0.5 italic tracking-tight uppercase">@ Rp {parseFloat(item.harga_beli_per_satuan || 0).toLocaleString()}</div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100 tabular-nums tracking-tight italic">
                                        Rp {parseFloat(item.subtotal || 0).toLocaleString('id-ID')}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center text-gray-400 border border-gray-100 dark:border-gray-800">
                    <FiActivity size={18} />
                </div>
                <div className="text-[9px] font-bold text-gray-400 leading-normal max-w-[280px] uppercase tracking-tight">
                    This document is a system-generated acquisition proof secured in the Nova Farma Ledger. Authorized verification valid.
                </div>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-gray-400 text-gray-700 dark:text-gray-300 rounded-lg text-[11px] font-bold uppercase transition-all shadow-sm active:scale-95 group">
                    <FiPrinter className="group-hover:rotate-6 transition-transform" /> Print Verification (LPB)
                </button>
                <button onClick={onClose} className="flex-1 sm:flex-none px-8 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-[11px] font-bold uppercase transition-all shadow-md active:scale-95">
                  Close Specifications
                </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-error-50 dark:bg-error-900/10 text-error-500 rounded-full flex items-center justify-center shadow-inner">
                <FiX size={32} />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">Repository Sync Failure</div>
              <div className="text-xs text-gray-500 font-medium max-w-[280px] mx-auto leading-relaxed">Could not establish secure link to acquisition ledger. Retrying sync recommendation.</div>
            </div>
        </div>
      )}
    </ModalDialog>
  );
}
