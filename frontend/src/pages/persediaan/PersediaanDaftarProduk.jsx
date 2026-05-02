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
    { label: 'Intelligence Insight', key: 'nama_produk', render: (val, row) => (
      <div className="flex flex-col py-0.5">
        <span className="font-bold text-gray-900 dark:text-gray-100 uppercase text-xs tracking-tight">{val}</span>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[9px] font-black bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded border border-primary-100 uppercase">SKU: {row.sku || 'N/A'}</span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Loc: {row.nama_rak || 'W-MAIN'}</span>
        </div>
      </div>
    )},
    { label: 'Velocity', key: 'stok_total', width: '140px', render: (val, row) => {
      const isLow = row.stok_minimal > 0 && val <= row.stok_minimal;
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-black tabular-nums ${isLow ? 'text-error-600' : 'text-gray-900'}`}>{val}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase">{row.nama_satuan_terkecil || 'unit'}</span>
          </div>
          <div className="w-16 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
            <div className={`h-full rounded-full ${isLow ? 'bg-error-500' : 'bg-success-500'}`} style={{ width: isLow ? '20%' : '80%' }}></div>
          </div>
        </div>
      );
    }},
    { label: 'Aquisition/Margin', key: 'harga_beli_referensi', align: 'right', width: '160px', render: (val, row) => (
      <div className="flex flex-col items-end">
        <span className="text-sm font-bold text-gray-900 tabular-nums">Rp {parseInt(val || 0).toLocaleString('id-ID')}</span>
        <span className="text-[9px] font-bold text-success-600 uppercase tracking-widest mt-0.5">Est. Margin: +30%</span>
      </div>
    )},
    { 
      label: 'Analytics', 
      key: 'actions', 
      align: 'right',
      width: '180px',
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => { setSelectedProductId(row.id); setShowCardModal(true); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase bg-white dark:bg-gray-800 text-gray-600 hover:text-primary-600 border border-gray-200 dark:border-gray-700 hover:border-primary-300 rounded-lg shadow-sm transition-all"
          >
            <FiArchive size={12} /> Kartu Stok
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-20 animate-unt-fade">
      <SectionHeader 
        title="Product Intelligence 360" 
        subtitle="Analisis terpadu persediaan, mutasi kartu stok, dan efisiensi modal dalam satu jendela."
        icon={<FiBox className="text-primary-600" size={24} />}
      />

      {/* Strategic Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Stock Health</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{( ( (data.length - summary.stok_menipis) / (data.length || 1) ) * 100).toFixed(1)}%</h3>
            <span className="text-[11px] font-bold text-success-600 uppercase">Optimal</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Critically Low</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-error-600">{summary.stok_menipis}</h3>
            <span className="text-[11px] font-bold text-gray-400 uppercase">SKU</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Expiry Risk (90d)</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-warning-600">{summary.akan_kadaluarsa || 0}</h3>
            <span className="text-[11px] font-bold text-gray-400 uppercase">SKU</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-5 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Asset Valuation</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-success-600">Rp 12.5M</h3>
            <span className="text-[11px] font-bold text-gray-400 uppercase">Total</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
        <DataTable 
          columns={columns} 
          data={data} 
          isLoading={isLoading} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Cari berdasarkan nama produk, SKU, atau kategori..."
          primaryAction={{
            label: "Export Analytics",
            onClick: () => console.log('Exporting...'),
            icon: <FiDownload size={14} />
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
