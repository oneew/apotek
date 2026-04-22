import React, { useState, useEffect } from 'react';
import SectionHeader from '../../../components/ui/SectionHeader';
import DataTable from '../../../components/ui/DataTable';
import { FiPlus, FiEye, FiTruck, FiHash, FiShield, FiTrendingUp } from 'react-icons/fi';
import ModalPesanan from './components/ModalPesanan';
import ModalDetailPesanan from './components/ModalDetailPesanan';

export default function PembelianPesanan() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/master/pesanan-pembelian');
      const result = await response.json();
      if (result.status) setData(result.data);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  const columns = [
    { label: 'PO Signature', key: 'tanggal_po', width: '220px', render: (val, row) => (
        <div className="flex flex-col py-0.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 dark:text-gray-100">
                <FiHash className="text-gray-400" size={13} />
                {row.no_po}
            </div>
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-tight mt-0.5 ml-5">
                Auth: {new Date(val).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
        </div>
    )},
    { label: 'Strategic Partner', key: 'nama_supplier', render: (val) => (
      <div className="flex flex-col py-0.5">
        <span className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-xs">{val || 'GLOBAL VENDOR'}</span>
        <span className="text-[10px] text-primary-600 font-bold uppercase tracking-tight">Verified Supplier</span>
      </div>
    )},
    { 
      label: 'Financial Exposure', 
      key: 'total_estimate', 
      width: '180px',
      render: (val) => (
        <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Estimate Val.</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">Rp {parseFloat(val || 0).toLocaleString('id-ID')}</span> 
        </div>
      )
    },
    { 
      label: 'Status Integrity', 
      key: 'status', 
      width: '160px',
      align: 'center',
      render: (val) => {
        const isReceived = val === 'Received';
        const isSemi = val === 'Semi-Received';
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight border ${
            isReceived ? 'bg-success-50 text-success-700 border-success-200 dark:bg-success-950/20 dark:border-success-900' : 
            isSemi ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900' : 
            'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950/20 dark:border-primary-900'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isReceived ? 'bg-success-500' : isSemi ? 'bg-amber-500' : 'bg-primary-500'} animate-pulse`} />
            {val || 'OPEN_PO'}
          </span>
        );
      }
    },
    { 
      label: '', 
      key: 'actions', 
      align: 'right',
      width: '160px',
      render: (_, row) => (
        <div className="flex justify-end">
          <button 
            onClick={() => { setSelectedId(row.id); setDetailModalOpen(true); }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 group"
          >
            Review PO <FiEye className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-20">
      <SectionHeader 
        title="Purchase Orders" 
        subtitle="Operational management of authorized procurement requisitions and vendor supply chains." 
        icon={<FiTruck className="text-gray-500" size={24} />}
        rightContent={
          <button 
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95 group"
          >
            <FiPlus className="group-hover:rotate-90 transition-all font-bold" /> Generate Official PO
          </button>
        }
      />

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm overflow-hidden">
        <DataTable columns={columns} data={data} isLoading={isLoading} searchPlaceholder="Locate PO by identifier, vendor or valuation..." />
      </div>

      <ModalPesanan 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSaveSuccess={fetchData} 
      />
      
      <ModalDetailPesanan 
        isOpen={detailModalOpen} 
        onClose={() => setDetailModalOpen(false)} 
        id={selectedId} 
      />
    </div>
  );
}
