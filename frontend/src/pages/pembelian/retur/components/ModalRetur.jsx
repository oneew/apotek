import React, { useState, useEffect } from 'react';
import ModalDialog from '../../../../components/ui/ModalDialog';
import { FiSave, FiX, FiRepeat, FiTruck, FiDatabase, FiPlus, FiTrash2, FiSearch } from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:8080/api';

export default function ModalRetur({ isOpen, onClose, onSaveSuccess }) {
  const [suppliers, setSuppliers] = useState([]);
  const [pembelianList, setPembelianList] = useState([]);
  const [selectedPembelianItems, setSelectedPembelianItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    supplier_id: '',
    pembelian_id: '',
    tanggal_retur: new Date().toISOString().split('T')[0],
    alasan: 'Obat Rusak / ED',
    items: []
  });

  useEffect(() => {
    if (isOpen) {
      fetchSuppliers();
    }
  }, [isOpen]);

  const fetchSuppliers = async () => {
    try {
      const resp = await axios.get(`${API_BASE}/master/suppliers`);
      if (resp.data.status) setSuppliers(resp.data.data);
    } catch (err) { console.error(err); }
  };

  const fetchPembelian = async (supplierId) => {
    try {
      const resp = await axios.get(`${API_BASE}/master/pembelian?supplier_id=${supplierId}`);
      if (resp.data.status) setPembelianList(resp.data.data);
    } catch (err) { console.error(err); }
  };

  const handleSupplierChange = (id) => {
    setFormData({ ...formData, supplier_id: id, pembelian_id: '', items: [] });
    fetchPembelian(id);
  };

  const handlePembelianChange = async (id) => {
    setFormData({ ...formData, pembelian_id: id, items: [] });
    try {
      const resp = await axios.get(`${API_BASE}/master/pembelian/${id}`);
      if (resp.data.status) {
        setSelectedPembelianItems(resp.data.data.items);
      }
    } catch (err) { console.error(err); }
  };

  const addItemForRetur = (item) => {
      const exists = formData.items.find(i => i.produk_id === item.produk_id);
      if (exists) return;
      
      setFormData({
          ...formData,
          items: [...formData.items, {
              produk_id: item.produk_id,
              nama_produk: item.nama_produk,
              stok_batch_id: item.stok_batch_id, // assuming it's in the item data
              jumlah: 1,
              max_qty: item.jumlah_beli
          }]
      });
  };

  const removeItem = (idx) => {
      const newItems = [...formData.items];
      newItems.splice(idx, 1);
      setFormData({ ...formData, items: newItems });
  };

  const updateQty = (idx, qty) => {
      const newItems = [...formData.items];
      newItems[idx].jumlah = Math.min(qty, newItems[idx].max_qty);
      setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.supplier_id || formData.items.length === 0) {
        Swal.fire({ title: 'Validasi', text: 'Supplier dan minimal 1 item harus dipilih', icon: 'warning' });
        return;
    }

    setIsSubmitting(true);
    try {
      const resp = await axios.post(`${API_BASE}/master/pembelian/retur`, formData);
      if (resp.data.status) {
        Swal.fire('Berhasil', 'Retur ke supplier berhasil dicatat', 'success');
        onSaveSuccess();
        onClose();
      }
    } catch (err) {
      Swal.fire('Gagal', 'Terjadi kesalahan sistem', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalDialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Buat Retur Supplier (PBF)" 
      subtitle="Input pengembalian barang ke supplier berdasarkan faktur pembelian."
      icon={<FiRepeat />}
      maxWidth="max-w-[900px]"
    >
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 focus-within:text-amber-600 transition-colors">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Pilih Supplier *</label>
                  <select 
                    value={formData.supplier_id} 
                    onChange={e => handleSupplierChange(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-xs font-semibold outline-none focus:border-amber-500 appearance-none"
                  >
                      <option value="">-- Pilih --</option>
                      {suppliers.map(s => <option key={s.id} value={s.id}>{s.nama_supplier}</option>)}
                  </select>
              </div>

              <div className="space-y-1.5 focus-within:text-amber-600 transition-colors">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Referensi Faktur (Opsional)</label>
                  <select 
                    value={formData.pembelian_id} 
                    onChange={e => handlePembelianChange(e.target.value)}
                    disabled={!formData.supplier_id}
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-xs font-semibold outline-none focus:border-amber-500 disabled:bg-gray-50 appearance-none"
                  >
                      <option value="">-- Cari Faktur --</option>
                      {pembelianList.map(p => <option key={p.id} value={p.id}>{p.no_faktur} ({new Date(p.tanggal_pembelian).toLocaleDateString()})</option>)}
                  </select>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              {/* Left Column: Items to select */}
              <div className="md:col-span-1 space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Item Faktur</h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                          {selectedPembelianItems.length > 0 ? selectedPembelianItems.map(item => (
                              <div 
                                key={item.id} 
                                onClick={() => addItemForRetur(item)}
                                className="p-3 bg-white border border-gray-100 rounded-lg cursor-pointer hover:border-amber-300 transition-all group"
                              >
                                  <div className="text-[11px] font-bold text-gray-700 group-hover:text-amber-600">{item.nama_produk}</div>
                                  <div className="text-[10px] text-gray-400">Qty Beli: {item.jumlah_beli}</div>
                              </div>
                          )) : <p className="text-[10px] text-gray-400 italic">Pilih faktur untuk melihat item.</p>}
                      </div>
                  </div>
              </div>

              {/* Right Column: Retur Cart */}
              <div className="md:col-span-3 space-y-4">
                  <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
                      <table className="w-full text-xs">
                          <thead className="bg-gray-50 border-b border-gray-100">
                              <tr>
                                  <th className="px-4 py-2 text-left">Produk</th>
                                  <th className="px-4 py-2 text-center w-24">Qty Retur</th>
                                  <th className="px-4 py-2"></th>
                              </tr>
                          </thead>
                          <tbody>
                              {formData.items.length === 0 ? (
                                  <tr><td colSpan="3" className="px-4 py-8 text-center text-gray-400 italic">Belum ada item dipilih</td></tr>
                              ) : formData.items.map((it, idx) => (
                                  <tr key={idx} className="border-b last:border-0 border-gray-50">
                                      <td className="px-4 py-3 font-semibold text-gray-700 uppercase">{it.nama_produk}</td>
                                      <td className="px-4 py-3">
                                          <input 
                                             type="number" 
                                             value={it.jumlah} 
                                             onChange={e => updateQty(idx, parseInt(e.target.value) || 0)}
                                             className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1 text-center font-bold outline-none" 
                                          />
                                      </td>
                                      <td className="px-4 py-3 text-right">
                                          <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600"><FiTrash2 /></button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>

                  <div className="space-y-1.5 focus-within:text-amber-600 transition-colors">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Alasan Retur</label>
                      <textarea 
                        value={formData.alasan} 
                        onChange={e => setFormData({...formData, alasan: e.target.value})}
                        className="w-full h-20 bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-medium outline-none focus:border-amber-500" 
                        placeholder="Detail alasan pengembalian..."
                      />
                  </div>
              </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
              <button type="button" onClick={onClose} className="px-6 py-2.5 text-xs font-bold text-gray-500 uppercase hover:bg-gray-50 rounded-lg">Batal</button>
              <button 
                 type="submit" 
                 disabled={isSubmitting}
                 className="flex items-center gap-2 px-8 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold uppercase transition-all shadow-md shadow-amber-500/20"
              >
                  <FiSave /> {isSubmitting ? 'Menyimpan...' : 'Simpan Retur'}
              </button>
          </div>
      </form>
    </ModalDialog>
  );
}
