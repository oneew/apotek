import React, { useState, useEffect } from 'react';
import DataTable from '../../../../components/ui/DataTable';
import { FiEye, FiDownload, FiCheckCircle, FiClock, FiFileText, FiChevronRight } from 'react-icons/fi';
import ModalDetailRencana from './ModalDetailRencana';

export default function RiwayatTab() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchData();
    window.addEventListener('refresh-plans', fetchData);
    return () => window.removeEventListener('refresh-plans', fetchData);
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/master/rencana-pembelian');
      const result = await response.json();
      if (result.status) setData(result.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { label: 'Timeline & Identifiers', key: 'tanggal', width: '220px', render: (val, row) => (
        <div className="flex flex-col py-0.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 dark:text-gray-100">
                <FiClock className="text-gray-400" size={13} />
                {new Date(val).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-tight mt-0.5 ml-5">ID: {row.no_rencana}</span>
        </div>
    )},
    { label: 'Strategic Narrative', key: 'keterangan', render: (val) => (
      <div className="flex flex-col max-w-sm">
        <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400 leading-relaxed italic line-clamp-1">
          {val || 'No additional planning notes provided...'}
        </span>
      </div>
    )},
    { 
      label: 'Security Status', 
      key: 'status', 
      width: '180px',
      align: 'center',
      render: (val) => {
        const isApproved = val === 'Approved';
        const isOrdered = val === 'Ordered';
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight border ${
            isApproved ? 'bg-success-50 text-success-700 border-success-200 dark:bg-success-950/20 dark:border-success-900' : 
            isOrdered ? 'bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-950/20 dark:border-primary-900' : 
            'bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isApproved ? 'bg-success-500' : isOrdered ? 'bg-primary-500' : 'bg-gray-400'}`} />
            {val || 'DRAFT'}
          </span>
        );
      }
    },
    { 
      label: '', 
      key: 'actions', 
      align: 'right',
      width: '180px',
      render: (_, row) => (
        <div className="flex items-center justify-end">
          <button 
            onClick={() => { setSelectedId(row.id); setDetailModalOpen(true); }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 group"
          >
            Review Details <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm overflow-hidden">
      <DataTable columns={columns} data={data} isLoading={isLoading} searchPlaceholder="Filter requisitions by ID or status..." />
      
      <ModalDetailRencana 
        isOpen={detailModalOpen} 
        onClose={() => setDetailModalOpen(false)} 
        id={selectedId} 
      />
    </div>
  );
}
