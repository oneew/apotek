import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import { FiAlertTriangle, FiAlertCircle, FiCheckCircle, FiClock, FiBox, FiBell } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function FefoDashboard() {
  const [data, setData] = useState({ counts: {}, details: { expired: [], critical: [], warning: [], safe: [] } });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('critical');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/master/fefo/dashboard').then(r => r.json());
      if (res.status) setData(res.data);
    } catch(e) {}
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const sendWaAlert = () => {
     Swal.fire('Alert Sent!', 'Laporan Kadaluarsa telah dikirimkan ke Whatsapp Manager.', 'success');
  };

  const getTableData = () => {
    return data.details[activeTab] || [];
  };

  const columns = [
    { key: 'sku', label: 'SKU / Batch', render: (val, item) => (
       <div className="flex flex-col">
           <span className="font-bold text-gray-800">{val}</span>
           <span className="text-xs text-gray-500 whitespace-nowrap">Batch: {item.batch_number || 'N/A'}</span>
       </div>
    )},
    { key: 'nama_produk', label: 'Nama Produk', render: val => <span className="font-semibold text-gray-900">{val}</span> },
    { key: 'stok_total', label: 'Stok Sisa' },
    { key: 'tanggal_kadaluarsa', label: 'Tgl Kadaluarsa', render: val => <span className="text-sm">{new Date(val).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}</span> },
    { key: 'days_left', label: 'Sisa Hari', render: (val, item) => {
        if (val < 0) return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg uppercase">EXPIRED ({Math.abs(val)} HARI LALU)</span>;
        if (val <= 30) return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-lg">{val} HARI (CRITICAL)</span>;
        if (val <= 90) return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-lg">{val} HARI (WARNING)</span>;
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg">{val} HARI (SAFE)</span>;
    }}
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      <SectionHeader 
        title="FEFO &amp; Expiry Management" 
        subtitle="Analisis pergerakan obat berdasarkan First-Expired-First-Out dan peringatan kadaluarsa."
        icon={<FiClock size={24} className="text-gray-500" />}
        rightContent={
          <button onClick={sendWaAlert} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-sm font-bold text-sm transition-all">
             <FiBell size={16} /> Broadcast WA Alert
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-4">
          <div onClick={() => setActiveTab('expired')} className={`p-4 border rounded-xl cursor-pointer transition-all ${activeTab === 'expired' ? 'bg-red-50 border-red-300 ring-2 ring-red-200' : 'bg-white hover:bg-gray-50'}`}>
              <div className="flex items-center gap-3"><div className="p-2 bg-red-100 text-red-600 rounded-lg"><FiAlertTriangle size={20} /></div><div className="flex-1"><h4 className="text-xs font-bold text-gray-500 uppercase">Expired</h4><p className="text-2xl font-black text-gray-900">{data.counts.expired || 0}</p></div></div>
          </div>
          <div onClick={() => setActiveTab('critical')} className={`p-4 border rounded-xl cursor-pointer transition-all ${activeTab === 'critical' ? 'bg-orange-50 border-orange-300 ring-2 ring-orange-200' : 'bg-white hover:bg-gray-50'}`}>
              <div className="flex items-center gap-3"><div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><FiAlertCircle size={20} /></div><div className="flex-1"><h4 className="text-xs font-bold text-gray-500 uppercase">Critical (&lt;30 Hari)</h4><p className="text-2xl font-black text-gray-900">{data.counts.critical || 0}</p></div></div>
          </div>
          <div onClick={() => setActiveTab('warning')} className={`p-4 border rounded-xl cursor-pointer transition-all ${activeTab === 'warning' ? 'bg-yellow-50 border-yellow-300 ring-2 ring-yellow-200' : 'bg-white hover:bg-gray-50'}`}>
              <div className="flex items-center gap-3"><div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><FiBox size={20} /></div><div className="flex-1"><h4 className="text-xs font-bold text-gray-500 uppercase">Warning (&lt;90 Hari)</h4><p className="text-2xl font-black text-gray-900">{data.counts.warning || 0}</p></div></div>
          </div>
          <div onClick={() => setActiveTab('safe')} className={`p-4 border rounded-xl cursor-pointer transition-all ${activeTab === 'safe' ? 'bg-green-50 border-green-300 ring-2 ring-green-200' : 'bg-white hover:bg-gray-50'}`}>
              <div className="flex items-center gap-3"><div className="p-2 bg-green-100 text-green-600 rounded-lg"><FiCheckCircle size={20} /></div><div className="flex-1"><h4 className="text-xs font-bold text-gray-500 uppercase">Safe (&gt;90 Hari)</h4><p className="text-2xl font-black text-gray-900">{data.counts.safe || 0}</p></div></div>
          </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-4">
          <DataTable 
             data={getTableData()} 
             columns={columns} 
             isLoading={loading} 
             searchQuery={searchQuery} 
             onSearchChange={setSearchQuery} 
             searchPlaceholder={`Cari obat dalam kategori ${activeTab.toUpperCase()}...`} 
          />
      </div>
    </div>
  );
}
