import React, { useState, useEffect } from 'react';
import ModalDialog from '../../../../components/ui/ModalDialog';
import { FiX, FiPrinter, FiPackage, FiCalendar, FiUser, FiTruck, FiDollarSign, FiInfo } from 'react-icons/fi';

export default function ModalDetailPesanan({ isOpen, onClose, id }) {
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
      const response = await fetch(`http://localhost:8080/api/master/pesanan-pembelian/${id}`);
      const result = await response.json();
      if (result.status) setData(result.data);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <ModalDialog 
        isOpen={isOpen} 
        onClose={onClose} 
        title="Purchase Order Specification" 
        subtitle="Reviewing formal acquisition request and vendor fulfillment status."
        icon={<FiTruck />}
        maxWidth="max-w-4xl"
    >
      <div className="p-8 space-y-8">
        {isLoading ? (
          <div className="py-24 text-center">
              <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Synchronizing order record...</span>
          </div>
        ) : data ? (
          <>
            {/* Order Identity Summary */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4">
                        <div className="inline-flex items-center px-2.5 py-0.5 bg-primary-50 text-primary-700 border border-primary-100 rounded-full text-[10px] font-bold uppercase tracking-tight">
                            {data.status || 'OPEN'} STATUS
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">{data.no_po}</h2>
                            <div className="flex items-center gap-4 mt-1 text-xs font-medium text-gray-500">
                                <span className="flex items-center gap-1.5"><FiCalendar size={14} className="text-gray-400" /> {new Date(data.tanggal_po).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300" />
                                <span className="flex items-center gap-1.5"><FiUser size={14} className="text-gray-400" /> AUTH_SYSTEM</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:items-end justify-center md:border-l md:border-gray-100 dark:md:border-gray-800 md:pl-8">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Financial Exposure</span>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tighter">
                            Rp {parseFloat(data.total_estimate).toLocaleString('id-ID')}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Strategic Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="w-10 h-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-center text-primary-600 shadow-sm">
                        <FiTruck size={18} />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block leading-none mb-1">Vendor Partner</span>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white uppercase truncate">{data.nama_supplier}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="w-10 h-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-center text-primary-600 shadow-sm">
                        <FiPackage size={18} />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block leading-none mb-1">Fulfillment status</span>
                        <p className="text-sm font-bold text-gray-500 uppercase">PENDING_DELIVERY</p>
                    </div>
                </div>
            </div>

            {/* Item Ledger */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                            <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Asset Signature</th>
                            <th className="px-6 py-3 text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider w-24">Qty</th>
                            <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider w-32">Acq. Cost</th>
                            <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider w-40">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {data.items?.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <span className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-xs">{item.nama_produk}</span>
                                </td>
                                <td className="px-6 py-4 text-center font-bold text-gray-600 tabular-nums">
                                    {item.jumlah}
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-gray-600 tabular-nums">
                                    Rp {parseFloat(item.harga_estimate).toLocaleString('id-ID')}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-primary-700 dark:text-primary-400 tabular-nums">
                                    Rp {(item.jumlah * item.harga_estimate).toLocaleString('id-ID')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Decision Actions */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 max-w-md">
                   <FiInfo size={16} className="text-gray-400 shrink-0" />
                   <span className="text-[10px] font-medium text-gray-500 leading-relaxed uppercase tracking-tight">
                     * Official document. Authorization confirmed.
                   </span>
                </div>
                <div className="flex gap-3">
                    <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95">
                        <FiPrinter size={16} /> Print Manifesto
                    </button>
                    <button onClick={onClose} className="px-10 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95">
                        Close
                    </button>
                </div>
            </div>
          </>
        ) : (
          <div className="py-20 text-center opacity-40">
            <FiPackage size={64} className="mx-auto mb-4 text-gray-300" />
            <p className="text-error-600 font-bold uppercase tracking-wider text-xs">Failed to retrieve PO specification.</p>
          </div>
        )}
      </div>
    </ModalDialog>
  );
}
