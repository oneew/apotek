import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiSave, FiLayers } from 'react-icons/fi';
import Swal from 'sweetalert2';
import ModalDialog from '../../../components/ui/ModalDialog';
import Button from '../../../components/ui/Button';

const API_BASE = 'http://localhost:8080/api';

export default function ModalTemplateRacikan({ isOpen, onClose, id, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  
  const [formData, setFormData] = useState({
    nama_template: '',
    keterangan: '',
    items: []
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (id) {
        fetchDetail();
      } else {
        setFormData({ nama_template: '', keterangan: '', items: [] });
      }
    }
  }, [isOpen, id]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/produk`);
      const result = await response.json();
      if (result.status) setProducts(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/master/template-racikan/${id}`);
      const result = await response.json();
      if (result.status) {
        setFormData({
          nama_template: result.data.nama_template,
          keterangan: result.data.keterangan || '',
          items: result.data.items || []
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Gagal memuat detail template', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { produk_id: '', jumlah: 1, keterangan: '' }]
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const handleSimpan = async () => {
    if (!formData.nama_template || formData.items.length === 0) {
      Swal.fire('Validasi Gagal', 'Nama template dan setidaknya 1 bahan racikan harus diisi.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/master/template-racikan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      
      if (result.status) {
        Swal.fire('Berhasil', 'Template racikan berhasil disimpan.', 'success').then(() => {
          onSuccess();
          onClose();
        });
      } else {
        Swal.fire('Gagal', result.message || 'Terjadi kesalahan.', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Terjadi kesalahan koneksi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium";

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title={id ? "Detail Template Racikan" : "Buat Template Racikan Baru"}
      subtitle="Kumpulan bahan obat yang sering diracik untuk mempercepat input resep."
      icon={<FiLayers />}
      maxWidth="max-w-3xl"
    >
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Nama Template *</label>
            <input 
              type="text" 
              value={formData.nama_template}
              onChange={(e) => setFormData({...formData, nama_template: e.target.value})}
              placeholder="Misal: Puyer Batuk Pilek Anak"
              className={inputClass}
              readOnly={!!id}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Keterangan / Signa Umum</label>
            <input 
              type="text" 
              value={formData.keterangan}
              onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
              placeholder="Opsional, misal: 3 x Sehari 1 Bungkus"
              className={inputClass}
              readOnly={!!id}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-tight">Komposisi Obat</h4>
            {!id && (
              <button onClick={handleAddItem} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-bold transition-all hover:bg-primary-100 dark:hover:bg-primary-900/50">
                <FiPlus size={14} /> Tambah Obat
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-3 items-start bg-white dark:bg-gray-900/50 p-3 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Obat / Bahan</label>
                  {id ? (
                    <input type="text" readOnly value={item.nama_produk || ''} className={inputClass} />
                  ) : (
                    <select 
                      value={item.produk_id}
                      onChange={(e) => handleItemChange(index, 'produk_id', e.target.value)}
                      className={inputClass}
                    >
                      <option value="">-- Pilih Obat --</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.nama_produk}</option>)}
                    </select>
                  )}
                </div>
                <div className="w-24">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Jml Default</label>
                  <input 
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={item.jumlah}
                    onChange={(e) => handleItemChange(index, 'jumlah', parseFloat(e.target.value) || 0)}
                    className={inputClass}
                    readOnly={!!id}
                  />
                </div>
                <div className="w-48">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Keterangan Khusus</label>
                  <input 
                    type="text"
                    value={item.keterangan || ''}
                    onChange={(e) => handleItemChange(index, 'keterangan', e.target.value)}
                    className={inputClass}
                    placeholder="Opsional"
                    readOnly={!!id}
                  />
                </div>
                {!id && (
                  <div className="pt-6">
                    <button onClick={() => handleRemoveItem(index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            ))}
            {formData.items.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm font-medium border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                Belum ada obat yang dimasukkan ke template.
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Tutup</Button>
          {!id && (
            <Button variant="primary" iconLeft={FiSave} onClick={handleSimpan} disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Template'}
            </Button>
          )}
        </div>
      </div>
    </ModalDialog>
  );
}
