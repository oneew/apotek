import React, { useState, useEffect } from 'react';
import DataTable from '../../../../components/ui/DataTable';
import { FiAlertCircle, FiPlus, FiMessageCircle, FiZap, FiTarget, FiBox } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function DefectaTab({ onAdd }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/master/rencana-pembelian/defecta');
      const result = await response.json();
      if (result.status) setData(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAll = () => {
    if (data.length === 0) return;
    const items = data.map(item => ({
        produk_id: item.id,
        nama_produk: item.nama_produk,
        qty: item.stok_minimal - item.stok_sekarang,
        harga_estimate: item.harga_beli_referensi || 0,
        subtotal: (item.stok_minimal - item.stok_sekarang) * (item.harga_beli_referensi || 0)
    }));
    onAdd(items);
  };

  const columns = [
    { label: 'Deficit Signature', key: 'nama_produk', render: (val, row) => (
        <div className="flex flex-col py-0.5">
            <span className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-xs">{val}</span>
            <span className="text-[10px] text-gray-500 font-medium tracking-tight mt-0.5 uppercase">ID: {row.sku || 'N/A'}</span>
        </div>
    )},
    { label: 'Min Level', key: 'stok_minimal', width: '120px', align: 'center', render: (val) => (
      <span className="text-xs font-semibold text-gray-500">{val} <span className="text-[10px] opacity-60">U</span></span>
    )},
    { label: 'Live Count', key: 'stok_sekarang', width: '140px', align: 'center', render: (val) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-error-50 text-error-700 border border-error-100 dark:bg-error-950/20 dark:border-error-900`}>
        {val} <span className="text-[10px] opacity-60 ml-0.5">U</span>
      </span>
    )},
    { label: 'Shortage', key: 'kekurangan', width: '120px', align: 'center', render: (_, row) => {
      const delta = row.stok_minimal - row.stok_sekarang;
      return (
        <span className="text-sm font-bold text-primary-700 dark:text-primary-400">+{delta}</span>
      );
    }},
    { 
      label: '', 
      key: 'actions', 
      align: 'right',
      width: '180px',
      render: (_, row) => (
        <div className="flex justify-end">
          <button 
            onClick={() => onAdd([{
                produk_id: row.id,
                nama_produk: row.nama_produk,
                qty: row.stok_minimal - row.stok_sekarang,
                harga_estimate: row.harga_beli_referensi || 0,
                subtotal: (row.stok_minimal - row.stok_sekarang) * (row.harga_beli_referensi || 0)
            }])}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
          >
            <FiPlus size={14} /> Add to Plan
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-error-50 dark:bg-error-950/20 text-error-600 rounded-lg flex items-center justify-center border border-error-100 dark:border-error-900">
                <FiAlertCircle size={24} />
            </div>
            <div className="flex flex-col">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-tight">Defecta Alert Matrix</h4>
                <p className="text-xs text-gray-500 font-medium">{data.length} assets identified below critical safety thresholds.</p>
            </div>
        </div>
        
        {data.length > 0 && (
            <button 
                onClick={handleAddAll}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-error-600 hover:bg-error-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95"
            >
                <FiZap size={16} /> Load All Critical Assets
            </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm overflow-hidden">
        <DataTable columns={columns} data={data} isLoading={isLoading} searchPlaceholder="Filter critical signals..." />
      </div>
    </div>
  );
}
