import React, { useState, useEffect } from 'react';
import ModalDialog from '../../../../components/ui/ModalDialog';
import { FiTrash2, FiPlus, FiSearch, FiSave, FiCheckCircle, FiChevronDown, FiFileText, FiTag, FiCalendar, FiTruck, FiActivity } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function ModalFaktur({ isOpen, onClose, onSaveSuccess }) {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductSearch, setShowProductSearch] = useState(false);
  const [showPOList, setShowPOList] = useState(false);
  
  const [formData, setFormData] = useState({
    tanggalTerima: new Date().toISOString().split('T')[0],
    noFaktur: '',
    tanggalJatuhTempo: '',
    supplier_id: '',
    catatan: '',
    statusPembayaran: 'Belum Lunas',
    po_id: ''
  });

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchSuppliers();
      fetchProducts();
      fetchPurchaseOrders();
    }
  }, [isOpen]);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/master/suppliers');
      const result = await response.json();
      if (result.status) setSuppliers(result.data);
    } catch (err) { console.error(err); }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/produk');
      const result = await response.json();
      if (result.status) setProducts(result.data);
    } catch (err) { console.error(err); }
  };

  const fetchPurchaseOrders = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/master/pesanan-pembelian');
      const result = await response.json();
      if (result.status) {
        setPurchaseOrders(result.data.filter(po => po.status !== 'Received'));
      }
    } catch (err) { console.error(err); }
  };

  const loadFromPO = async (poId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/master/pesanan-pembelian/${poId}`);
      const result = await response.json();
      if (result.status) {
        const poData = result.data;
        const newItems = poData.items.map(item => ({
          produk_id: item.produk_id,
          nama_produk: item.nama_produk,
          qty: item.jumlah,
          satuan_id: item.satuan_id || null,
          no_batch: '',
          tanggal_expired: '',
          harga_beli: parseFloat(item.harga_estimate) || 0,
          subtotal: item.jumlah * (parseFloat(item.harga_estimate) || 0)
        }));
        setItems(newItems);
        setFormData(prev => ({ 
          ...prev, 
          po_id: poId, 
          supplier_id: poData.supplier_id,
          catatan: `Referensi PO: ${poData.no_po}`
        }));
        setShowPOList(false);
        Swal.fire({ title: 'Success', text: `Inventory data from ${poData.no_po} synchronized.`, icon: 'success', customClass: { popup: 'rounded-xl' } });
      }
    } catch (err) { console.error(err); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = (product) => {
    const newItem = {
      produk_id: product.id,
      nama_produk: product.nama_produk,
      satuan_id: product.satuan_utama_id,
      qty: 1,
      no_batch: '',
      tanggal_expired: '',
      harga_beli: parseFloat(product.harga_beli_referensi) || 0,
      subtotal: parseFloat(product.harga_beli_referensi) || 0
    };
    setItems([...items, newItem]);
    setShowProductSearch(false);
    setSearchQuery('');
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'qty' || field === 'harga_beli') {
        newItems[index].subtotal = newItems[index].qty * newItems[index].harga_beli;
    }
    setItems(newItems);
  };

  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const subTotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const grandTotal = subTotal;

  const handleSave = async (isPosting = false) => {
    if (!formData.noFaktur || !formData.supplier_id || items.length === 0) {
        Swal.fire({ title: 'Validation Halt', text: 'Invoice No, Supplier, and at least one line item are required.', icon: 'warning', confirmButtonColor: '#7F56D9' });
        return;
    }

    const payload = {
        ...formData,
        items: items,
        totalTagihan: subTotal,
        grandTotal: grandTotal,
        status: isPosting ? 'Posted' : 'Draft'
    };

    try {
        const response = await fetch('http://localhost:8080/api/master/pembelian', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (result.status) {
            Swal.fire({ 
              title: 'Success', 
              text: isPosting ? 'Stock acquisition finalized and posted.' : 'Draft invoice record preserved.', 
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
            onClose();
            if (onSaveSuccess) onSaveSuccess();
        } else {
            Swal.fire({ title: 'Infrastructure Error', text: result.message, icon: 'error' });
        }
    } catch (err) {
        Swal.fire({ title: 'Persistence Failure', text: 'The repository is currently unresponsive.', icon: 'error' });
    }
  };

  const filteredProducts = (products || []).filter(p => {
    const name = (p.nama_produk || '').toLowerCase();
    const query = (searchQuery || '').toLowerCase();
    return name.includes(query);
  });

  return (
    <ModalDialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Acquisition Entry (Invoice)" 
      subtitle="Registering vendor proof of purchase to synchronize repository stock levels."
      icon={<FiFileText />}
      maxWidth="max-w-[1000px]"
    >
      <div className="p-8 overflow-y-auto max-h-[85vh] space-y-8">
        {/* PO Reference Section */}
        <div className="bg-gray-50 dark:bg-gray-800/10 p-5 rounded-xl border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm transition-all">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center text-primary-600 shadow-sm">
                <FiTruck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight">Purchase Order Reference</h4>
                <p className="text-[10px] text-gray-500 font-medium italic">Auto-populate items from an authorized PO for zero-error sync.</p>
              </div>
           </div>
           
           <div className="relative min-w-[280px]">
              <button 
                onClick={() => setShowPOList(!showPOList)}
                className="w-full h-11 flex justify-between items-center bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 text-xs font-semibold text-gray-700 dark:text-gray-300 outline-none hover:border-primary-500 transition-all shadow-sm"
              >
                <span>{formData.po_id ? purchaseOrders.find(po => po.id === formData.po_id)?.no_po : 'Connect to active PO (Optional)'}</span>
                <FiChevronDown className={`transition-transform duration-300 ${showPOList ? 'rotate-180' : ''}`} />
              </button>
              {showPOList && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl max-h-56 overflow-y-auto">
                    {purchaseOrders.length > 0 ? purchaseOrders.map(po => (
                        <div key={po.id} onClick={() => loadFromPO(po.id)} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-0 transition-all">
                            <div className="font-bold text-xs text-primary-700 dark:text-primary-400 uppercase leading-none mb-1">{po.no_po}</div>
                            <div className="text-[10px] font-medium text-gray-500 uppercase tracking-tight">{po.nama_supplier} • {new Date(po.tanggal_po).toLocaleDateString()}</div>
                        </div>
                    )) : <div className="p-4 text-center text-[10px] font-bold text-gray-400">No active POs in ledger.</div>}
                </div>
              )}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
             <div className="space-y-4">
                <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Invoice Signature *</label>
                    <input type="text" name="noFaktur" value={formData.noFaktur} onChange={handleChange} placeholder="Ex: INV-9921" className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-xs font-semibold outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white" />
                </div>
                <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Vendor Provider *</label>
                    <select name="supplier_id" value={formData.supplier_id} onChange={handleChange} className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-xs font-semibold outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white appearance-none">
                        <option value="">Select Vendor</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.nama_supplier}</option>)}
                    </select>
                </div>
                <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Acquisition Date</label>
                    <input type="date" name="tanggalTerima" value={formData.tanggalTerima} onChange={handleChange} className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-xs font-semibold outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white" />
                </div>
                <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Maturity Deadline</label>
                    <input type="date" name="tanggalJatuhTempo" value={formData.tanggalJatuhTempo} onChange={handleChange} className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-xs font-semibold outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white" />
                </div>
             </div>

             <div className="bg-primary-50 dark:bg-primary-900/10 p-5 rounded-xl border border-primary-200 dark:border-primary-800 shadow-sm transition-all group">
                <div className="text-[10px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-widest mb-1 group-hover:tracking-[0.15em] transition-all">Aggregate Liability</div>
                <div className="text-2xl font-extrabold text-primary-900 dark:text-primary-100 tabular-nums italic tracking-tight">Rp {subTotal.toLocaleString('id-ID')}</div>
             </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
             <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/20 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-[10px] text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <FiActivity className="text-primary-500" /> Line Item Entry Repository
                </h3>
                <div className="relative">
                    <button 
                        onClick={() => setShowProductSearch(!showProductSearch)}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
                    >
                        <FiPlus /> Override Item
                    </button>
                    {showProductSearch && (
                        <div className="absolute right-0 mt-3 w-[400px] bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-[60] overflow-hidden">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                                <div className="relative">
                                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                  <input 
                                      autoFocus
                                      type="text" 
                                      value={searchQuery}
                                      onChange={(e) => setSearchQuery(e.target.value)}
                                      placeholder="Filter logic by asset specification..." 
                                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 pl-9 pr-4 py-2 text-xs font-semibold rounded-lg outline-none focus:border-primary-500 transition-all" 
                                  />
                                </div>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {filteredProducts.map(p => (
                                    <div key={p.id} onClick={() => handleAddProduct(p)} className="px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-none group transition-all">
                                        <div className="text-xs font-bold text-gray-800 dark:text-gray-200 group-hover:text-primary-600 transition-colors uppercase leading-none mb-1">{p.nama_produk}</div>
                                        <div className="text-[10px] text-gray-400 font-medium">System SKU: {p.sku || 'N/A'} • Ref Price: Rp {parseFloat(p.harga_beli_referensi || 0).toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
             </div>

             <div className="overflow-hidden border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm bg-white dark:bg-gray-900">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                            <th className="px-4 py-3 text-left font-bold uppercase tracking-tight text-[10px] text-gray-400">Inventory Specification</th>
                            <th className="px-4 py-3 text-center font-bold uppercase tracking-tight text-[10px] text-gray-400 w-24">Quantity</th>
                            <th className="px-4 py-3 text-left font-bold uppercase tracking-tight text-[10px] text-gray-400 w-48">Lot & Integrity</th>
                            <th className="px-4 py-3 text-left font-bold uppercase tracking-tight text-[10px] text-gray-400 w-32">Acq. Cost</th>
                            <th className="px-4 py-3 text-right font-bold uppercase tracking-tight text-[10px] text-gray-400">Aggregate</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-4 py-20 text-center text-gray-400 font-medium italic text-xs uppercase tracking-widest bg-gray-50/20">
                                   Awaiting Asset Entry Data...
                                </td>
                            </tr>
                        ) : (
                            items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800 transition-colors group">
                                    <td className="px-4 py-4">
                                        <div className="font-bold text-gray-800 dark:text-gray-100 uppercase text-xs tracking-tight">{item.nama_produk}</div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <input type="number" value={item.qty} onChange={(e) => updateItem(idx, 'qty', parseInt(e.target.value) || 0)} className="w-[80px] bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded px-2 py-1.5 text-xs font-bold text-center outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white" />
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="space-y-1.5">
                                            <div className="relative">
                                              <FiTag className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]" />
                                              <input type="text" value={item.no_batch} onChange={(e) => updateItem(idx, 'no_batch', e.target.value)} placeholder="BATCH / LOT ID" className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded pl-7 pr-2 py-1.5 text-[10px] font-bold uppercase placeholder:text-gray-300 outline-none focus:border-primary-500 transition-all dark:text-white" />
                                            </div>
                                            <div className="relative">
                                              <FiCalendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]" />
                                              <input type="date" value={item.tanggal_expired} onChange={(e) => updateItem(idx, 'tanggal_expired', e.target.value)} className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded pl-7 pr-2 py-1.5 text-[10px] font-bold outline-none focus:border-primary-500 transition-all dark:text-white" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="relative">
                                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">Rp</span>
                                          <input type="number" value={item.harga_beli} onChange={(e) => updateItem(idx, 'harga_beli', parseFloat(e.target.value) || 0)} className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded pl-7 pr-2 py-1.5 text-xs font-bold text-emerald-600 outline-none focus:border-emerald-500 transition-all" />
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-right font-bold text-gray-900 dark:text-gray-100 tabular-nums tracking-tight italic text-xs">
                                        Rp {item.subtotal.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <button onClick={() => removeItem(idx)} className="p-2 text-gray-300 hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20 rounded transition-all"><FiTrash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
             </div>

             <div className="space-y-1.5 focus-within:text-primary-600 transition-colors">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Contextual Narrative (Notes)</label>
                <textarea 
                    name="catatan" 
                    value={formData.catatan} 
                    onChange={handleChange} 
                    placeholder="Provide additional context for this shipment or discrepancies detected..." 
                    className="w-full h-24 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-xl px-5 py-4 text-xs font-medium outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all dark:text-white shadow-sm"
                ></textarea>
             </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-5 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <button onClick={onClose} className="px-6 py-2.5 text-xs font-bold uppercase text-gray-600 hover:bg-gray-100 rounded-lg transition-all tracking-tight">Abort Entry</button>
          <div className="flex gap-3">
            <button 
                onClick={() => handleSave(false)}
                className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg text-xs font-bold uppercase transition-all shadow-sm"
            >
                <FiSave /> Preserves as Draft
            </button>
            <button 
                onClick={() => handleSave(true)}
                className="flex items-center gap-2.5 px-8 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-bold uppercase transition-all shadow-md shadow-primary-500/20 active:scale-95"
            >
                <FiCheckCircle size={16} /> Synchronize & Post Stok
            </button>
          </div>
      </div>
    </ModalDialog>
  );
}
