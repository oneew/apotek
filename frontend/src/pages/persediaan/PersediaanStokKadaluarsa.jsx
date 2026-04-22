import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import { FiFilter, FiSearch, FiAlertTriangle, FiClock, FiCalendar, FiActivity, FiShield } from 'react-icons/fi';

export default function PersediaanStokKadaluarsa() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/master/stok/expired');
      const result = await response.json();
      if (result.status) setData(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { label: 'Asset Identity', key: 'nama_produk', render: (val, row) => (
      <div className="flex flex-col py-0.5">
        <span className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-xs">{val}</span>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-primary-600 font-bold uppercase tracking-tight">Batch: {row.no_batch || 'N/A'}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="text-[10px] text-gray-400 font-medium">SKU: {row.sku || 'N/A'}</span>
        </div>
      </div>
    )},
    { label: 'Expiration Timeline', key: 'tanggal_expired', width: '220px', render: (val) => {
        if (!val || val === '0000-00-00') return (
            <div className="flex items-center gap-1.5 text-gray-400">
                <FiAlertTriangle size={14} />
                <span className="text-[11px] font-semibold uppercase tracking-tight">Invalid Lifecycle</span>
            </div>
        );
        const date = new Date(val);
        const now = new Date();
        const diff = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
        const isExpired = diff <= 0;
        
        return (
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200">
                    <FiCalendar size={13} className={isExpired ? 'text-error-500' : 'text-amber-500'} />
                    {new Date(val).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-tight ${isExpired ? 'text-error-600 font-black' : 'text-amber-600'}`}>
                    {isExpired ? 'Decommissioned / Expired' : `${diff} days remaining`}
                </span>
            </div>
        );
    }},
    { label: 'Current Inventory', key: 'stok_tersedia', width: '150px', align: 'center', render: (val) => (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
        {val} <span className="text-[9px] opacity-60 ml-1 uppercase">Units</span>
      </span>
    )},
    { label: 'Security Level', key: 'status', align: 'right', width: '160px', render: (_, row) => {
        const date = new Date(row.tanggal_expired);
        const now = new Date();
        const diff = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
        const isCritical = diff <= 30;
        
        return (
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight border ${
                isCritical 
                    ? 'bg-error-50 text-error-700 border-error-200 dark:bg-error-950/20 dark:border-error-900' 
                    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900'
            }`}>
                {isCritical ? <FiShield size={12} className="animate-pulse" /> : <FiClock size={12} />}
                {isCritical ? 'Critical Monitor' : 'Active Watch'}
            </div>
        );
    }}
  ];

  const filteredData = data.filter(item => 
    item.nama_produk.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.no_batch?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Critical (30d)', count: data.filter(d => {
        const diff = Math.ceil((new Date(d.tanggal_expired) - new Date()) / (1000 * 60 * 60 * 24));
        return diff <= 30;
    }).length, color: 'error' },
    { label: 'Safe Watch', count: data.filter(d => {
        const diff = Math.ceil((new Date(d.tanggal_expired) - new Date()) / (1000 * 60 * 60 * 24));
        return diff > 30;
    }).length, color: 'amber' }
  ];

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <SectionHeader 
            title="Integrity Watch" 
            subtitle="Authoritative monitoring of pharmaceutical expiration cycles and safety status." 
            icon={<FiShield className="text-gray-500" size={24} />}
        />
        
        <div className="flex gap-4">
           {stats.map((s, i) => (
             <div key={i} className="px-5 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm flex items-center gap-4">
                <div className={`w-1.5 h-1.5 rounded-full ${s.color === 'error' ? 'bg-error-500 shadow-[0_0_8px_rgba(217,45,32,0.4)] animate-pulse' : 'bg-amber-500 shadow-[0_0_8px_rgba(247,144,9,0.4)]'}`} />
                <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{s.label}</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{s.count}</span>
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
        <DataTable 
          columns={columns} 
          data={filteredData} 
          isLoading={isLoading} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Identify batch lifecycle or product signature..."
        />
      </div>
    </div>
  );
}
