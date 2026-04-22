import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import { FiX, FiCheckCircle, FiPlus, FiSave, FiSearch, FiTrash2, FiClipboard, FiAlertCircle, FiDatabase, FiPackage } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function PersediaanStokOpname() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isOpnameMode, setIsOpnameMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchProduct = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/master/stok?search=${query}`);
      const result = await response.json();
      if (result.status) {
        setSearchResults(result.data.filter(p => p.nama_produk.toLowerCase().includes(query.toLowerCase())));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addProductToOpname = async (product) => {
    try {
      const resp = await fetch(`http://localhost:8080/api/master/stok/detail/${product.id}`);
      const res = await resp.json();
      if (res.status && res.data.length > 0) {
        const newItems = res.data.map(b => ({
          ...b,
          nama_produk: product.nama_produk,
          sku: product.sku,
          stok_sistem: b.stok_tersedia,
          stok_fisik: b.stok_tersedia,
          batch_id: b.id
        }));
        
        const filtered = newItems.filter(ni => !items.some(i => i.batch_id === ni.batch_id));
        if (filtered.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'Batch Already Exists',
            text: 'All selected product batches are already present in the audit list.',
            confirmButtonColor: '#7F56D9'
          });
          return;
        }
        setItems([...items, ...filtered]);
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Stock Not Found',
          text: 'This product has no active batches or stock in the system.',
          confirmButtonColor: '#7F56D9'
        });
      }
    } catch (err) {
      console.error(err);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const updateStokFisik = (batchId, val) => {
    setItems(items.map(item => item.batch_id === batchId ? { ...item, stok_fisik: parseFloat(val) || 0 } : item));
  };

  const removeItem = (batchId) => {
    setItems(items.filter(i => i.batch_id !== batchId));
  };

  const handleSubmit = async () => {
    if (items.length === 0) return;

    const result = await Swal.fire({
      title: 'Finalise Stock Audit?',
      text: 'System records will be automatically reconciled based on your physical count inputs.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#079455',
      cancelButtonColor: '#667085',
      confirmButtonText: 'Authorize & Post',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      setIsSubmitting(true);
      try {
        const response = await fetch('http://localhost:8080/api/master/stok/opname', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, no_opname: 'SO-' + Date.now() })
        });
        const res = await response.json();
        if (res.status) {
          Swal.fire({
            icon: 'success',
            title: 'Reconciliation Successful',
            text: 'Stock ledger has been successfully synchronised with physical data.',
            timer: 2000,
            showConfirmButton: false,
            customClass: { popup: 'rounded-xl' }
          });
          setItems([]);
          setIsOpnameMode(false);
        }
      } catch (err) {
        Swal.fire('Action Failed', 'System error during ledger reconciliation.', 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const columns = [
    { label: 'Batch Signature', key: 'nama_produk', render: (val, row) => (
      <div className="flex flex-col py-0.5">
        <span className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-xs">{val}</span>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-primary-600 font-bold uppercase">Batch: {row.no_batch}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span className="text-[10px] text-gray-400 font-medium">EXP: {row.tanggal_expired}</span>
        </div>
      </div>
    )},
    { label: 'System', key: 'stok_sistem', width: '100px', align: 'center', render: (val) => (
      <div className="flex flex-col items-center">
        <span className="font-semibold text-gray-500 text-sm">{val}</span>
        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider mt-0.5">UNITS</span>
      </div>
    )},
    { label: 'Physical Count', key: 'stok_fisik', width: '140px', align: 'center', render: (val, row) => (
      <div className="flex flex-col items-center">
        <input 
          type="number" 
          value={val} 
          onChange={(e) => updateStokFisik(row.batch_id, e.target.value)}
          className="w-20 text-center px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-semibold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
        />
      </div>
    )},
    { label: 'Variance', key: 'selisih', width: '100px', align: 'center', render: (_, row) => {
      const selisih = row.stok_fisik - row.stok_sistem;
      return (
        <div className="flex flex-col items-center">
          <span className={`text-sm font-bold ${selisih === 0 ? 'text-gray-400' : selisih > 0 ? 'text-success-600' : 'text-error-600'}`}>
            {selisih > 0 ? '+' : ''}{selisih}
          </span>
          <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider">DELTA</span>
        </div>
      );
    }},
    { label: '', key: 'action', align: 'right', width: '60px', render: (_, row) => (
      <button onClick={() => removeItem(row.batch_id)} className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all">
        <FiTrash2 size={16} />
      </button>
    )}
  ];

  if (!isOpnameMode && items.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto space-y-6 pb-20">
        <SectionHeader 
          title="Stock Reconciliation" 
          subtitle="Systematic validation of physical assets against digital ledger records."
          icon={<FiClipboard className="text-gray-500" size={24} />}
        />
        
        <div className="mt-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-16 flex flex-col items-center text-center shadow-sm">
           <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 text-primary-600 rounded-2xl flex items-center justify-center mb-6 border border-gray-100 dark:border-gray-700 shadow-sm">
              <FiDatabase size={32} />
           </div>
           <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Initiate Inventory Audit</h2>
           <p className="text-sm text-gray-500 font-medium max-w-sm mb-8 leading-relaxed">Systematically verify and adjust stock levels to maintain data integrity across your pharmaceutical repository.</p>
           
           <button 
              onClick={() => setIsOpnameMode(true)}
              className="px-8 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold text-sm shadow-sm transition-all active:scale-95 flex items-center gap-2"
           >
              <FiPlus size={18} /> Begin New Session
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <SectionHeader 
            title="Physical Audit Session" 
            subtitle="Authorizing real-time adjustment of inventory levels." 
            icon={<FiClipboard className="text-gray-500" size={24} />}
        />
        <button 
            onClick={() => setIsOpnameMode(false)} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
        >
            <FiX size={20} />
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
           <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm overflow-hidden">
              <DataTable columns={columns} data={items} isLoading={false} />
              
              {items.length === 0 && (
                <div className="py-20 flex flex-col items-center text-gray-400">
                    <FiSearch size={40} className="mb-3 opacity-30" />
                    <p className="font-semibold text-xs uppercase tracking-wider">Search products to initiate audit list</p>
                </div>
              )}
           </div>
           
           {items.length > 0 && (
             <div className="flex justify-end pt-4">
                <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-10 py-2.5 bg-success-600 hover:bg-success-700 text-white rounded-lg font-semibold text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <FiSave size={18} /> {isSubmitting ? 'Syncing Ledger...' : 'Finalize & Update Stock'}
                </button>
             </div>
           )}
        </div>

        <div className="col-span-12 lg:col-span-4">
           <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                 <FiSearch className="text-primary-600" size={16} />
                 <h3 className="font-semibold text-gray-900 dark:text-white text-xs uppercase tracking-wider">Asset Search</h3>
              </div>
              
              <div className="relative mb-5">
                 <input 
                    type="text" 
                    placeholder="Identify by name or SKU..."
                    value={searchQuery}
                    onChange={(e) => searchProduct(e.target.value)}
                    className="w-full pl-3 pr-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                 />
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                 {searchResults.map(p => (
                   <button 
                      key={p.id} 
                      onClick={() => addProductToOpname(p)}
                      className="w-full p-4 bg-white dark:bg-gray-800/40 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-left transition-all border border-gray-100 dark:border-gray-700 hover:border-primary-200 group flex flex-col gap-1"
                   >
                      <span className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors uppercase text-xs">{p.nama_produk}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400 font-medium tracking-tight">SKU: {p.sku || 'N/A'}</span>
                        <span className="text-[10px] font-bold text-success-600">{p.stok_total} IN STOCK</span>
                      </div>
                   </button>
                 ))}
                 
                 {searchQuery.length >= 2 && searchResults.length === 0 && (
                   <div className="flex flex-col items-center py-10 text-gray-400">
                      <FiAlertCircle size={24} className="mb-2 opacity-30" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">No matching assets</span>
                   </div>
                 )}

                 {searchQuery.length < 2 && (
                    <div className="flex flex-col items-center py-10 text-gray-400">
                        <span className="text-[11px] font-medium text-center px-4">Identify assets to begin reconciliation.</span>
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
