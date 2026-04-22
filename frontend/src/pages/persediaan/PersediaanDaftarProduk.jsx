import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import { FiFilter, FiDownload, FiSearch, FiMoreVertical, FiTrendingUp, FiAlertCircle, FiBox, FiArchive } from 'react-icons/fi';
import ModalKartuStok from './components/ModalKartuStok';

export default function PersediaanDaftarProduk() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({ total_produk: 0, stok_menipis: 0, akan_kadaluarsa: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/master/stok');
      const result = await response.json();
      if (result.status) {
        setData(result.data);
        setSummary(result.summary);
      }
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { label: 'Product Details', key: 'nama_produk', render: (val, row) => (
      <div className="flex flex-col py-0.5">
        <span className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-xs">{val}</span>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">SKU: {row.sku || 'N/A'}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="text-[10px] text-primary-600 font-bold uppercase">{row.kategori || 'GENERAL'}</span>
        </div>
      </div>
    )},
    { label: 'Shelving', key: 'nama_rak', width: '120px', render: (val) => (
       <div className="flex items-center gap-2">
         <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-tight">{val || 'W-MAIN'}</span>
       </div>
    )},
    { label: 'Stock Balance', key: 'stok_total', width: '150px', render: (val, row) => {
      const isLow = row.stok_minimal > 0 && val <= row.stok_minimal;
      return (
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
            isLow 
              ? 'bg-error-50 text-error-700 border border-error-100 dark:bg-error-950/20 dark:border-error-900' 
              : 'bg-success-50 text-success-700 border border-success-100 dark:bg-success-950/20 dark:border-success-900'
          }`}>
            {val} <span className="text-[10px] opacity-60 ml-0.5">{row.satuan || 'UNIT'}</span>
          </span>
          {isLow && <FiAlertCircle size={14} className="text-error-500" />}
        </div>
      );
    }},
    { label: 'Acq. Price', key: 'harga_beli_referensi', align: 'right', width: '140px', render: (val) => (
      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
        Rp {parseInt(val || 0).toLocaleString('id-ID')}
      </span>
    )},
    { 
      label: '', 
      key: 'actions', 
      align: 'right',
      width: '140px',
      render: (_, row) => (
        <div className="flex items-center justify-end">
          <button 
            onClick={() => { setSelectedProductId(row.id); setShowCardModal(true); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
          >
            <FiArchive size={14} /> Audit Trail
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-20">
      <SectionHeader 
        title="Inventory Catalog" 
        subtitle="Real-time monitoring of pharmaceutical stock levels and storage allocation."
        icon={<FiBox className="text-gray-500" size={24} />}
      />

      {/* Stats Overview - Untitled UI Style (Compact) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Registered Assets', value: summary.total_produk, sub: 'Total SKUs in repository', color: 'primary' },
          { label: 'Low Stock Alerts', value: summary.stok_menipis, sub: 'Requires replenishment', color: 'error' },
          { label: 'Total Valuation', value: 'Rp 12.5M', sub: 'Current asset valuation', color: 'success' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between h-32">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{stat.label}</span>
            <div className="flex items-baseline gap-2 mt-auto">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{stat.value}</h3>
              <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
        <DataTable 
          columns={columns} 
          data={data} 
          isLoading={isLoading} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Filter inventory by name, SKU or classification..."
          primaryAction={{
            label: "Download Report",
            onClick: () => console.log('Exporting...'),
            icon: <FiDownload size={14} className="mr-1" />
          }}
        />
      </div>

      <ModalKartuStok 
        isOpen={showCardModal} 
        onClose={() => setShowCardModal(false)}
        productId={selectedProductId}
      />
    </div>
  );
}
