import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import { FiActivity, FiRefreshCw, FiAlertTriangle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import Swal from 'sweetalert2';

export default function PersediaanForecasting() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/inventory/forecasting');
      const result = await response.json();
      if (result.status) setData(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSync = async () => {
    const confirm = await Swal.fire({
      title: 'Sync AI Recommendations?',
      text: "This will update the Min/Max/ROP values in your product master based on latest sales history.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#7F56D9',
      confirmButtonText: 'Yes, Sync Now'
    });

    if (confirm.isConfirmed) {
      setIsSyncing(true);
      try {
        const response = await fetch('http://localhost:8080/api/inventory/forecasting/sync', { method: 'POST' });
        const result = await response.json();
        if (result.status) {
          Swal.fire('Synced!', result.message, 'success');
          fetchData();
        }
      } catch (err) {
        Swal.fire('Error', 'Sync failed', 'error');
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const columns = [
    { label: 'Product Signature', key: 'nama_produk', render: (val, row) => (
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900 uppercase text-xs">{val}</span>
        <span className="text-[10px] text-gray-400 font-medium tracking-tight uppercase">{row.sku}</span>
      </div>
    )},
    { label: '30D Velocity', key: '30d_sales', align: 'center', width: '120px', render: (val) => <span className="font-bold text-gray-900">{val || 0} PCS</span> },
    { label: 'Current Inventory', key: 'stok_skrg', align: 'center', width: '150px', render: (val, row) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${row.below_min ? 'bg-red-50 text-red-700 border border-red-100' : row.needs_reorder ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
        {val || 0} UNIT
      </span>
    )},
    { label: 'Algorithm Recommendations', key: 'adv', render: (_, row) => (
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Min (Safety)</span>
          <span className="text-xs font-bold text-gray-700">{row.rec_stok_min}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-bold uppercase">ROP (Signal)</span>
          <span className="text-xs font-bold text-primary-600">{row.rec_rop}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-bold uppercase">Max (Target)</span>
          <span className="text-xs font-bold text-gray-700">{row.rec_stok_max}</span>
        </div>
      </div>
    )},
    { label: 'Sync Status', key: 'stok_min', align: 'right', width: '180px', render: (val, row) => {
      const isSynced = val === row.rec_stok_min && row.reorder_point === row.rec_rop;
      return (
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${isSynced ? 'text-green-600' : 'text-amber-600'}`}>
          {isSynced ? <FiCheckCircle size={14} /> : <FiAlertTriangle size={14} />}
          {isSynced ? 'In Sync' : 'Drift Detected'}
        </span>
      );
    }}
  ];

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-20">
      <SectionHeader 
        title="Inventory Intelligence" 
        subtitle="AI-driven purchase forecasting and predictive stock replenishment alerts."
        icon={<FiActivity size={24} className="text-gray-500" />}
        rightContent={
          <button 
            disabled={isSyncing}
            onClick={handleSync}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50 group font-bold uppercase tracking-wide"
          >
             <BsStars size={18} className={isSyncing ? "animate-spin" : "group-hover:rotate-45 transition-all"} /> 
             {isSyncing ? "Syncing Metrics..." : "Sync AI Intelligence"}
          </button>
        }
      />

      <div className="bg-primary-50 border border-primary-100 p-4 rounded-xl flex gap-4 items-start">
        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-primary-600 shadow-sm border border-primary-200 shrink-0">
          <FiInfo size={20} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-primary-900">Intelligence Engine Active</h4>
          <p className="text-[11px] text-primary-700 font-medium leading-relaxed">
            The system is currently analyzing historical volume from <span className="font-bold underline">last 30 days</span>. 
            "Drift Detected" indicates your master stock parameters (Min/ROP/Max) have deviated from the latest consumption patterns. 
            Click <span className="font-bold cursor-help" title="Sync will update m_produk table directly">Sync AI Intelligence</span> to recalibrate your entire inventory procurement plan.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <DataTable 
          columns={columns}
          data={data}
          isLoading={isLoading}
          searchPlaceholder="Audit product intelligence metrics..."
        />
      </div>
    </div>
  );
}
