import React, { useState, useEffect } from 'react';
import SectionHeader, { DateFilter } from '../../../components/ui/SectionHeader';
import DataTable from '../../../components/ui/DataTable';
import ModalRetur from './components/ModalRetur';
import { FiFilter, FiSearch, FiPlus, FiRotateCcw, FiActivity, FiDatabase } from 'react-icons/fi';
import { BiFile } from 'react-icons/bi';

export default function PembelianRetur() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetching real data if API exists, else dummy
  const fetchReturns = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/master/retur-pembelian');
      const result = await response.json();
      if (result.status) setData(result.data);
      else setData([]); // Keep as array
    } catch (err) {
      console.error('Error fetching returns:', err);
      setData([]); // Fallback to empty array
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const columns = [
    { 
      key: 'tanggal_retur', 
      label: 'Return Date', 
      render: (val) => {
        if (!val) return 'N/A';
        const d = new Date(val);
        return <span className="font-semibold text-gray-900 dark:text-gray-100">{d.toLocaleDateString('en-GB')}</span>;
      }
    },
    { 
      key: 'no_retur', 
      label: 'Return ID', 
      render: (val) => <span className="font-bold text-primary-700 dark:text-primary-400 uppercase tracking-tight">{val || 'RET-PENDING'}</span> 
    },
    { key: 'no_faktur', label: 'Ref Invoice', render: (val) => <span className="font-medium text-gray-500 uppercase text-[10px] tracking-tight">{val}</span> },
    { key: 'nama_supplier', label: 'Vendor / Supplier', render: (val) => <span className="text-gray-700 dark:text-gray-300 font-semibold text-xs">{val}</span> },
    { key: 'nama_produk', label: 'Asset Details', render: (val) => <span className="text-gray-600 dark:text-gray-400 font-medium text-[11px] truncate max-w-[200px]">{val}</span> },
    { 
      key: 'total_retur', 
      label: 'Value Compensated',
      align: 'right',
      render: (val) => <span className="font-bold text-gray-900 dark:text-gray-100 tabular-nums italic">Rp {parseFloat(val || 0).toLocaleString('id-ID')}</span>
    },
    { 
      key: 'actions', 
      label: '', 
      align: 'right',
      render: () => (
        <button className="px-4 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:border-primary-500 text-gray-700 dark:text-gray-300 hover:text-primary-600 rounded-lg text-[11px] font-bold transition-all shadow-sm active:scale-95">
          Audit Detail
        </button>
      )
    }
  ];

  const filteredData = (data || []).filter(item => {
    return (
      item.no_retur?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nama_supplier?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nama_produk?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-12 px-4">
      <SectionHeader 
        title="Purchase Returns" 
        subtitle="Manage inventory reversals, damage claims, and vendor reimbursement workflows."
        icon={<FiRotateCcw size={24} className="text-gray-400" />}
      >
          <div className="flex gap-2">
            <button 
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-95">
               <BiFile size={16} /> Draft Ledger
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95 border border-primary-700">
               <FiPlus /> New Return Claim
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
          searchPlaceholder="Filter claims by return ID, supplier, or product..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between group transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-xl flex items-center justify-center">
              <FiDatabase size={20} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Aggregate Returns (Current Period)</p>
              <p className="text-xl font-extrabold text-gray-900 dark:text-gray-100 italic tabular-nums group-hover:tracking-tight transition-all">
                Rp {(Array.isArray(data) ? data : []).reduce((sum, item) => sum + (parseFloat(item.total_retur) || 0), 0).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
          <FiActivity className="text-gray-100 group-hover:text-primary-100 transition-colors" size={40} />
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between group transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-error-50 dark:bg-error-900/20 text-error-600 rounded-xl flex items-center justify-center">
              <FiRotateCcw size={20} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transaction Volume</p>
              <p className="text-xl font-extrabold text-gray-900 dark:text-gray-100 italic tabular-nums group-hover:tracking-tight transition-all">
                {data.length} <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight ml-1">Claims Filed</span>
              </p>
            </div>
          </div>
          <FiActivity className="text-gray-100 group-hover:text-error-100 transition-colors" size={40} />
        </div>
      </div>

      <ModalRetur isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
