import React, { useState, useEffect } from 'react';
import ModalDialog from '../../../../components/ui/ModalDialog';
import { FiPlus, FiTrash2, FiSave, FiSearch, FiShoppingCart, FiCalendar, FiEdit3, FiTruck, FiInfo } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function ModalRencana({ isOpen, onClose, onSaveSuccess, initialData }) {
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    keterangan: ''
  });
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      fetchSuppliers();
      
      if (initialData) {
        setItems(initialData);
      } else {
        setItems([]);
        setFormData({
            tanggal: new Date().toISOString().split('T')[0],
            keterangan: ''
        });
      }
    }
  }, [isOpen, initialData]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/produk');
      const result = await response.json();
      setProducts(result.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/master/suppliers');
      const result = await response.json();
      setSuppliers(result.data || []);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  };

  const addItem = (product) => {
    if (items.find(item => item.produk_id === product.id)) {
      Swal.fire({
        icon: 'info',
        title: 'Already in List',
        text: 'This product is already included in the planning list.',
        confirmButtonColor: '#7F56D9'
      });
      return;
    }
    setItems([...items, {
      produk_id: product.id,
      nama_produk: product.nama_produk,
      qty: 1,
      satuan_id: product.satuan_id || null,
      supplier_id: product.supplier_id || null,
      nama_supplier: product.nama_supplier || ''
    }]);
    setSearchQuery('');
    setIsSearching(false);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (items.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Requirement Missing',
        text: 'Please add at least one product to the procurement plan.',
        confirmButtonColor: '#7F56D9'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:8080/api/master/rencana-pembelian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, items })
      });
      const result = await response.json();
      if (result.status) {
        Swal.fire({
          icon: 'success',
          title: 'Plan Authorized',
          text: 'The procurement plan has been successfully archived.',
          timer: 2000,
          showConfirmButton: false
        });
        onSaveSuccess();
        onClose();
      } else {
        Swal.fire('Constraint Error', result.message, 'error');
      }
    } catch (err) {
      Swal.fire('Sync Failure', 'System encountered an error during data persistence.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.nama_produk.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ModalDialog 
        isOpen={isOpen} 
        onClose={onClose} 
        title="Procurement Requisition" 
        subtitle="Establish strategic requirements for inventory replenishment."
        icon={<FiShoppingCart />}
        maxWidth="max-w-5xl"
    >
      <div className="p-8 space-y-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4 space-y-1.5 focus-within:text-primary-600 transition-colors">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Target Date</label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              <input 
                type="date" 
                value={formData.tanggal} 
                onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm font-medium outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white"
              />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-8 space-y-1.5 focus-within:text-primary-600 transition-colors">
            <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Strategic Context / Narrative</label>
            <div className="relative">
              <FiEdit3 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              <input 
                type="text" 
                placeholder="Ex: Monthly replenishment for Central Pharmacy repository..."
                value={formData.keterangan}
                onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm font-medium outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="relative space-y-1.5">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Scan Product Repository</label>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Identify asset by name, SKU or classification..."
              value={searchQuery}
              onFocus={() => setIsSearching(true)}
              onBlur={() => setTimeout(() => setIsSearching(false), 200)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 shadow-xs transition-all outline-none dark:text-white"
            />
          </div>

          {isSearching && searchQuery && (
            <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg max-h-64 overflow-y-auto p-2 custom-scrollbar">
              {filteredProducts.length > 0 ? filteredProducts.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => addItem(p)}
                  className="w-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-left flex justify-between items-center group transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors uppercase text-xs">{p.nama_produk}</span>
                    <span className="text-[10px] text-gray-400 font-medium tracking-tight uppercase">SKU: {p.sku || 'N/A SYSTEM'}</span>
                  </div>
                  <FiPlus className="text-gray-300 group-hover:text-primary-600" size={16} />
                </button>
              )) : (
                <div className="py-8 text-center text-gray-400 text-xs font-medium">No results matching identifier</div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden min-h-[300px]">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Asset Signature</th>
                <th className="px-6 py-3 text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider w-32">Target Qty</th>
                <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Allocated Vendor</th>
                <th className="px-6 py-3 text-right w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {items.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <FiShoppingCart size={32} className="mb-2 text-gray-300" />
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Planning queue is empty</p>
                    </div>
                  </td>
                </tr>
              ) : items.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-xs">{item.nama_produk}</span>
                      <span className="text-[10px] text-primary-600 font-bold uppercase tracking-tight">{item.satuan || 'UNIT'} REQUISITION</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <input 
                      type="number" 
                      value={item.qty} 
                      onChange={(e) => updateItem(idx, 'qty', Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1.5 text-center font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                    />
                  </td>
                  <td className="px-6 py-3">
                    <select 
                      value={item.supplier_id || ''} 
                      onChange={(e) => updateItem(idx, 'supplier_id', e.target.value)}
                      className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-[11px] font-semibold outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all appearance-none cursor-pointer dark:text-gray-300"
                    >
                      <option value="">AUTODETECT SOURCE</option>
                      {suppliers.map(s => <option key={s.id} value={s.id}>{s.nama_supplier.toUpperCase()}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button onClick={() => removeItem(idx)} className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all"><FiTrash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
          <button onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-lg transition-all">Cancel</button>
          <button 
            onClick={handleSave}
            disabled={isSubmitting || items.length === 0}
            className="inline-flex items-center gap-2 px-8 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <FiSave size={18} /> {isSubmitting ? 'Authorizing...' : 'Authorize Requisition'}
          </button>
        </div>
      </div>
    </ModalDialog>
  );
}
