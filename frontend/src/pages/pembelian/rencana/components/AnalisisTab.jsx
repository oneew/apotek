import React, { useState, useEffect } from 'react';
import DataTable from '../../../../components/ui/DataTable';
import { FiTrendingUp, FiPlus, FiShoppingBag, FiCpu, FiBarChart2, FiActivity, FiInfo } from 'react-icons/fi';

export default function AnalisisTab({ onAdd }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/master/rencana-pembelian/analisis');
      const result = await response.json();
      if (result.status) setData(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { label: 'Intelligence Signature', key: 'nama_produk', render: (val, row) => (
        <div className="flex flex-col py-0.5">
            <span className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-xs">{val}</span>
            <span className="text-[10px] text-gray-500 font-medium tracking-tight mt-0.5 uppercase">SKU: {row.sku || 'N/A'}</span>
        </div>
    )},
    { label: 'Velocity (7d)', key: 'sales_7d', width: '120px', align: 'center', render: (val) => (
      <div className="flex flex-col items-center">
        <span className="text-sm font-semibold text-success-700">{val} <span className="text-[10px] opacity-60">U</span></span>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">WEEKLY</span>
      </div>
    )},
    { label: 'Velocity (30d)', key: 'sales_30d', width: '120px', align: 'center', render: (val) => (
      <div className="flex flex-col items-center">
        <span className="text-sm font-semibold text-primary-700">{val} <span className="text-[10px] opacity-60">U</span></span>
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">MONTHLY</span>
      </div>
    )},
    { label: 'Stok On-Hand', key: 'stok_sekarang', width: '120px', align: 'center', render: (val) => (
      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 italic">{val}</span>
    )},
    { label: 'System Forecast', key: 'saran_order', width: '180px', align: 'right', render: (val) => {
        const hasSuggestion = val > 0;
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight border ${
            hasSuggestion 
                ? 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950/20 dark:border-primary-900' 
                : 'bg-gray-50 text-gray-400 border-gray-200 dark:bg-gray-800 dark:border-gray-700 opacity-60'
          }`}>
            {hasSuggestion ? <FiActivity size={12} className="animate-pulse" /> : <FiBarChart2 size={12} />}
            {hasSuggestion ? `Refill ${val} Units` : 'Stock Optimal'}
          </span>
        );
    }},
    { 
      label: '', 
      key: 'actions', 
      align: 'right',
      width: '160px',
      render: (_, row) => (
        <div className="flex justify-end">
          <button 
            disabled={row.saran_order <= 0}
            onClick={() => onAdd([{
                produk_id: row.id,
                nama_produk: row.nama_produk,
                qty: row.saran_order,
                harga_estimate: row.harga_beli_referensi || 0,
                subtotal: row.saran_order * (row.harga_beli_referensi || 0)
            }])}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-semibold transition-all border shadow-xs ${
              row.saran_order > 0 
                  ? 'bg-primary-600 hover:bg-primary-700 text-white border-primary-500 active:scale-95' 
                  : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
            }`}
          >
            <FiPlus size={14} /> {row.saran_order > 0 ? 'Inject Plan' : 'Optimized'}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-6">
        <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 text-primary-600 rounded-lg flex items-center justify-center border border-gray-100 dark:border-gray-700 shadow-sm">
            <FiCpu size={24} />
        </div>
        <div className="flex flex-col flex-1">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-tight">AI Procurement Forecasting</h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-3xl">
                Analyzing historical sales velocity and trend volatility over a <span className="text-primary-600 font-bold">30-day window</span> to calculate optimized replenishment targets.
            </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm overflow-hidden">
        <DataTable columns={columns} data={data} isLoading={isLoading} searchPlaceholder="Filter intelligence reports..." />
      </div>
    </div>
  );
}
