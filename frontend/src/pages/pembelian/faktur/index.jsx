import React, { useState, useEffect } from 'react';
import SectionHeader, { DateFilter } from '../../../components/ui/SectionHeader';
import DataTable from '../../../components/ui/DataTable';
import ModalFaktur from './components/ModalFaktur';
import ModalDetailFaktur from './components/ModalDetailFaktur';
import { FiFilter, FiSearch, FiPlus, FiFileText, FiActivity, FiDatabase } from 'react-icons/fi';

export default function PembelianFaktur() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); 
  const [selectedId, setSelectedId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchPembelian = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/master/pembelian');
      const result = await response.json();
      if (result.status) setData(result.data);
    } catch (err) {
      console.error('Error fetching pembelian:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPembelian();
  }, []);

  const columns = [
    { 
      key: 'tanggal_pembelian', 
      label: 'Acquisition Date', 
      render: (val) => {
        if (!val) return 'N/A';
        try {
          const d = new Date(val);
          return (
            <div className="flex flex-col">
              <span className="text-gray-900 dark:text-gray-100 font-semibold">{d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              <span className="text-[10px] text-gray-400 font-medium">{d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          );
        } catch (e) {
          return val;
        }
      }
    },
    { 
      key: 'no_faktur', 
      label: 'Invoice Identifier', 
      render: (val) => <span className="font-bold text-primary-700 dark:text-primary-400 uppercase tracking-tight">{val || 'DRAFT'}</span> 
    },
    { 
      key: 'nama_supplier', 
      label: 'Vendor / Provider', 
      render: (val) => <span className="text-gray-700 dark:text-gray-300 font-semibold text-xs tracking-tight">{val}</span> 
    },
    { 
      key: 'grand_total', 
      label: 'Total Liability',
      align: 'right',
      render: (val) => <span className="font-bold text-gray-900 dark:text-gray-100 italic tabular-nums">Rp {parseFloat(val || 0).toLocaleString('id-ID')}</span>
    },
    { 
      key: 'status', 
      label: 'Lifecycle Stage',
      align: 'center',
      render: (val) => {
        const isDraft = val === 'Draft';
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${
            isDraft 
            ? 'bg-warning-50 text-warning-700 border border-warning-200' 
            : 'bg-success-50 text-success-700 border border-success-200'
          }`}>
            {val || 'Posted'}
          </span>
        );
      }
    },
    { 
      key: 'status_pembayaran', 
      label: 'Settlement',
      align: 'center',
      render: (val) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${
          val === 'Lunas' 
          ? 'bg-primary-50 text-primary-700 border border-primary-200' 
          : 'bg-error-50 text-error-700 border border-error-200'
        }`}>
          {val || 'Outstanding'}
        </span>
      )
    },
    { 
      key: 'actions', 
      label: '', 
      align: 'right',
      render: (_, row) => (
        <button 
          onClick={() => { setSelectedId(row.id); setIsDetailOpen(true); }}
          className="px-4 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:border-primary-500 text-gray-700 dark:text-gray-300 hover:text-primary-600 rounded-lg text-[11px] font-bold transition-all shadow-sm active:scale-95">
          View Detail
        </button>
      )
    }
  ];

  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.no_faktur?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nama_supplier?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeFilter === 'All' || item.status === activeFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-12 px-4">
      <SectionHeader 
        title="Purchase Invoices" 
        subtitle="Manage acquisition receipts, vendor settlement, and inventory synchronization."
        icon={<FiFileText size={24} className="text-gray-400" />}
      >
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveFilter(activeFilter === 'Draft' ? 'All' : 'Draft')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all border shadow-sm active:scale-95 ${
                activeFilter === 'Draft' 
                ? 'bg-gray-900 border-gray-900 text-white shadow-gray-900/10' 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50'
              }`}>
               <FiActivity className={activeFilter === 'Draft' ? 'animate-pulse' : ''} /> Filter Drafts
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95">
               <FiPlus /> Register Invoice
            </button>
          </div>
      </SectionHeader>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm overflow-hidden">
        <DataTable 
          columns={columns} 
          data={filteredData} 
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Filter logic by invoice / vendor keyword..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-success-50 dark:bg-success-900/20 text-success-600 rounded-xl flex items-center justify-center">
            <FiDatabase size={20} />
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Asset Acquisition</p>
            <p className="text-xl font-extrabold text-gray-900 dark:text-gray-100 italic tabular-nums">
              Rp {(Array.isArray(data) ? data : []).reduce((sum, item) => sum + (parseFloat(item.grand_total) || 0), 0).toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-xl flex items-center justify-center">
            <FiFileText size={20} />
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registered Invoices</p>
            <p className="text-xl font-extrabold text-gray-900 dark:text-gray-100 italic tabular-nums">
              {data.length} <span className="text-xs font-medium text-gray-400 uppercase ml-1 tracking-tight">System Records</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4 group">
          <div className="w-12 h-12 bg-warning-50 dark:bg-warning-900/20 text-warning-600 rounded-xl flex items-center justify-center group-hover:bg-warning-100 transition-colors">
            <FiActivity size={20} />
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Outstanding (Draft)</p>
            <p className="text-xl font-extrabold text-warning-600 italic tabular-nums">
              {data.filter(d => d.status === 'Draft').length} <span className="text-xs font-medium text-gray-400 uppercase ml-1 tracking-tight">Pending Sync</span>
            </p>
          </div>
        </div>
      </div>

      <ModalFaktur isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSaveSuccess={fetchPembelian} />
      
      <ModalDetailFaktur 
        isOpen={isDetailOpen} 
        onClose={() => { setIsDetailOpen(false); setSelectedId(null); }} 
        id={selectedId} 
      />
    </div>
  );
}
