import React, { useState, useEffect } from 'react';
import ModalDialog from '../../../../components/ui/ModalDialog';
import { FiPlus, FiTrash2, FiSave, FiSearch, FiFileText, FiChevronDown, FiCalendar, FiTruck, FiLayers, FiInfo } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function ModalPesanan({ isOpen, onClose, onSaveSuccess }) {
  const [formData, setFormData] = useState({
    tanggal_po: new Date().toISOString().split('T')[0],
    supplier_id: '',
    rencana_id: '',
    keterangan: '',
    total_estimate: 0
  });
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showPlans, setShowPlans] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
      fetchSuppliers();
      fetchPlans();
    }
  }, [isOpen]);

  useEffect(() => {
    const total = items.reduce((sum, item) => sum + (item.qty * item.harga_estimate), 0);
    setFormData(prev => ({ ...prev, total_estimate: total }));
  }, [items]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/produk');
      const result = await response.json();
      setProducts(result.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/master/suppliers');
      const result = await response.json();
      setSuppliers(result.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchPlans = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/master/rencana-pembelian');
      const result = await response.json();
      setPlans((result.data || []).filter(p => p.status !== 'Ordered'));
    } catch (err) { console.error(err); }
  };

  const loadFromPlan = async (planId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/master/rencana-pembelian/${planId}`);
      const result = await response.json();
      if (result.status) {
        const planData = result.data;
        const newItems = planData.items.map(item => ({
          produk_id: item.produk_id,
          nama_produk: item.nama_produk,
          qty: item.jumlah,
          satuan_id: item.satuan_id,
          harga_estimate: 0,
          subtotal: 0
        }));
        setItems(newItems);
        setFormData(prev => ({ ...prev, rencana_id: planId }));
        setShowPlans(false);
        Swal.fire({
          icon: 'success',
          title: 'Plan Data Synchronized',
          text: `Loaded details from ${planData.no_rencana}`,
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (err) { console.error(err); }
  };

  const addItem = (product) => {
    if (items.find(item => item.produk_id === product.id)) return;
    setItems([...items, {
      produk_id: product.id,
      nama_produk: product.nama_produk,
      qty: 1,
      satuan_id: product.satuan_id || null,
      harga_estimate: product.harga_beli || 0,
      subtotal: product.harga_beli || 0
    }]);
    setSearchQuery('');
    setIsSearching(false);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'qty' || field === 'harga_estimate') {
      newItems[index].subtotal = newItems[index].qty * newItems[index].harga_estimate;
    }
    setItems(newItems);
  };

  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleSave = async () => {
    if (!formData.supplier_id) { Swal.fire('Operational Stop', 'Please authorize a target supplier.', 'warning'); return; }
    if (items.length === 0) { Swal.fire('Constraint Error', 'Requisition requires at least one asset.', 'warning'); return; }

    try {
      const response = await fetch('http://localhost:8080/api/master/pesanan-pembelian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, items })
      });
      const result = await response.json();
      if (result.status) {
        Swal.fire({
          icon: 'success',
          title: 'Order Generated',
          text: 'Official Purchase Order has been issued.',
          timer: 2000,
          showConfirmButton: false
        });
        onSaveSuccess();
        onClose();
      }
    } catch (err) { Swal.fire('Sync Failure', 'Critical error during PO persistence.', 'error'); }
  };

  return (
    <ModalDialog 
        isOpen={isOpen} 
        onClose={onClose} 
        title="Purchase Order Authorization" 
        subtitle="Issuing formal requests to vendors for inventory delivery."
        icon={<FiTruck />}
        maxWidth="max-w-5xl"
    >
      <div className="p-8 space-y-8">
        {/* Authorisation Header */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Target Supplier</label>
              <div className="relative">
                <FiTruck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                <select 
                  value={formData.supplier_id}
                  onChange={(e) => setFormData({...formData, supplier_id: e.target.value})}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm font-medium outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white"
                >
                  <option value="">SELECT PARTNER</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.nama_supplier.toUpperCase()}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Authorization Date</label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                <input 
                  type="date" 
                  value={formData.tanggal_po}
                  onChange={(e) => setFormData({...formData, tanggal_po: e.target.value})}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm font-medium outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white"
                />
              </div>
            </div>
            <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Internal Reference</label>
              <div className="relative">
                <FiLayers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                <button 
                  onClick={() => setShowPlans(!showPlans)}
                  className="w-full text-left bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg pl-10 pr-10 py-2 text-sm font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white whitespace-nowrap overflow-hidden"
                >
                  {formData.rencana_id ? plans.find(p => p.id === formData.rencana_id)?.no_rencana : 'SELECT DRAFT (OPTIONAL)'}
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </button>
                {showPlans && (
                  <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg max-h-48 overflow-y-auto p-1 custom-scrollbar">
                     {plans.length > 0 ? plans.map(p => (
                       <button key={p.id} onClick={() => loadFromPlan(p.id)} className="w-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md text-left text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors flex justify-between items-center group">
                          <span>{p.no_rencana}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{p.tanggal}</span>
                       </button>
                     )) : (
                       <div className="py-4 text-center text-xs text-gray-400">No active plans found</div>
                     )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="relative space-y-1.5">
          <label className="text-xs font-medium text-gray-700 dark:text-gray-300">On-the-fly Asset Addition</label>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Locate supplementary records in repository..."
              value={searchQuery}
              onFocus={() => setIsSearching(true)}
              onBlur={() => setTimeout(() => setIsSearching(false), 200)}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 shadow-xs transition-all outline-none dark:text-white"
            />
          </div>
          {isSearching && searchQuery && (
            <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg max-h-64 overflow-y-auto p-2 custom-scrollbar">
              {products.filter(p => p.nama_produk.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
                <button key={p.id} onClick={() => addItem(p)} className="w-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-left flex justify-between items-center group transition-colors">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors uppercase text-xs">{p.nama_produk}</span>
                    <span className="text-[10px] text-gray-400 font-medium tracking-tight uppercase">STK: {p.stok || 0}</span>
                  </div>
                  <FiPlus className="text-gray-300 group-hover:text-primary-600" size={16} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden min-h-[300px]">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Line Items</th>
                <th className="px-6 py-3 text-center text-[10px] font-bold text-gray-500 uppercase tracking-wider w-24">Qty</th>
                <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider w-32">Acq. Cost</th>
                <th className="px-6 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider w-40">Subtotal</th>
                <th className="px-6 py-3 text-right w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-xs">{item.nama_produk}</span>
                      <span className="text-[10px] text-primary-600 font-bold uppercase tracking-tight">Strategy Unit</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="number" 
                      value={item.qty} 
                      onChange={(e) => updateItem(idx, 'qty', parseInt(e.target.value) || 1)}
                      className="w-16 mx-auto bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1.5 text-center font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="number" 
                      value={item.harga_estimate} 
                      onChange={(e) => updateItem(idx, 'harga_estimate', parseFloat(e.target.value) || 0)}
                      className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 text-right font-bold text-success-700 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                    />
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white tabular-nums">
                    Rp {item.subtotal.toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => removeItem(idx)} className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-all">
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length > 0 && (
                <tr className="bg-gray-50 dark:bg-gray-800/50 font-bold">
                  <td colSpan="3" className="px-6 py-5 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Gross Procurement Estimate</td>
                  <td className="px-6 py-5 text-right text-lg text-primary-700 dark:text-primary-400 tabular-nums">
                    Rp {formData.total_estimate.toLocaleString('id-ID')}
                  </td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 max-w-md">
             <FiInfo size={18} className="text-primary-600 shrink-0" />
             <span className="text-[10px] font-medium text-gray-500 leading-relaxed">
               Authorise cost estimations carefully to maintain target margins. Official PO will be dispatched to the selected partner.
             </span>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-lg transition-all">Cancel</button>
            <button 
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-8 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all active:scale-95"
            >
              <FiSave size={18} /> Authorize & Dispatch PO
            </button>
          </div>
        </div>
      </div>
    </ModalDialog>
  );
}
