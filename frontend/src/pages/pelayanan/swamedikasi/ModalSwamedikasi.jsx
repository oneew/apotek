import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiSave, FiActivity } from 'react-icons/fi';
import Swal from 'sweetalert2';
import ModalDialog from '../../../components/ui/ModalDialog';
import Button from '../../../components/ui/Button';

const API_BASE = 'http://localhost:8080/api';

export default function ModalSwamedikasi({ isOpen, onClose, id, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [pelanggans, setPelanggans] = useState([]);
  const [apotekers, setApotekers] = useState([]);
  
  const [formData, setFormData] = useState({
    pelanggan_id: '',
    apoteker_id: '',
    keluhan: '',
    items: []
  });

  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (id) {
        fetchDetail();
      } else {
        setFormData({ pelanggan_id: '', apoteker_id: '', keluhan: '', items: [] });
      }
    }
  }, [isOpen, id]);

  const fetchMasterData = async () => {
    try {
      const [resProd, resPel, resApoteker] = await Promise.all([
        fetch(`${API_BASE}/produk`),
        fetch(`${API_BASE}/master/pelanggan`),
        fetch(`${API_BASE}/master/apoteker`)
      ]);
      const [prod, pel, apt] = await Promise.all([resProd.json(), resPel.json(), resApoteker.json()]);
      
      if (prod.status) setProducts(prod.data);
      if (pel.status) setPelanggans(pel.data);
      if (apt.status) setApotekers(apt.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/master/swamedikasi/${id}`);
      const result = await response.json();
      if (result.status) {
        setFormData({
          pelanggan_id: result.data.pelanggan_id || '',
          apoteker_id: result.data.apoteker_id || '',
          keluhan: result.data.keluhan || '',
          items: result.data.items || []
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Gagal memuat detail swamedikasi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { produk_id: '', jumlah: 1, dosis_aturan: '' }]
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
    if (!formData.keluhan || formData.items.length === 0) {
      Swal.fire('Validasi Gagal', 'Keluhan dan setidaknya 1 produk yang direkomendasikan harus diisi.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/master/swamedikasi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      
      if (result.status) {
        Swal.fire('Berhasil', 'Catatan Swamedikasi berhasil disimpan.', 'success').then(() => {
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
      title={id ? "Detail Swamedikasi" : "Catat Swamedikasi Baru"}
      subtitle="Konsultasi keluhan pasien dan rekomendasi obat bebas (OTC)."
      icon={<FiActivity />}
      maxWidth="max-w-4xl"
    >
      <div className="p-6 flex flex-col md:flex-row gap-6">
        {/* Kolom Kiri: Assesment */}
        <div className="flex-1 space-y-4">
          <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-tight border-b border-gray-100 dark:border-gray-800 pb-2">Assesment Klinis</h4>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Pasien (Opsional)</label>
            <select 
              value={formData.pelanggan_id}
              onChange={(e) => setFormData({...formData, pelanggan_id: e.target.value})}
              className={inputClass}
              disabled={!!id}
            >
              <option value="">-- Pasien Umum --</option>
              {pelanggans.map(p => <option key={p.id} value={p.id}>{p.nama_pelanggan} - {p.no_telepon}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Apoteker / Asisten</label>
            <select 
              value={formData.apoteker_id}
              onChange={(e) => setFormData({...formData, apoteker_id: e.target.value})}
              className={inputClass}
              disabled={!!id}
            >
              <option value="">-- Pilih Apoteker --</option>
              {apotekers.map(a => <option key={a.id} value={a.id}>{a.nama_apoteker}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Keluhan Utama & Riwayat *</label>
            <textarea 
              value={formData.keluhan}
              onChange={(e) => setFormData({...formData, keluhan: e.target.value})}
              placeholder="Contoh: Pasien mengeluh batuk berdahak sejak 3 hari lalu, tidak demam."
              className={`${inputClass} min-h-[120px] resize-y`}
              readOnly={!!id}
            />
          </div>
        </div>

        {/* Kolom Kanan: Rekomendasi */}
        <div className="flex-[1.5] space-y-4 flex flex-col">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2">
            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-tight">Rekomendasi Obat</h4>
            {!id && (
              <button onClick={handleAddItem} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-bold transition-all hover:bg-primary-100 dark:hover:bg-primary-900/50">
                <FiPlus size={14} /> Tambah
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto max-h-[300px] space-y-3 custom-scrollbar pr-2">
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-3 items-start bg-white dark:bg-gray-900/50 p-3 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Pilih Produk</label>
                  {id ? (
                    <input type="text" readOnly value={item.nama_produk || ''} className={inputClass} />
                  ) : (
                    <select 
                      value={item.produk_id}
                      onChange={(e) => handleItemChange(index, 'produk_id', e.target.value)}
                      className={inputClass}
                    >
                      <option value="">-- Obat Bebas --</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.nama_produk}</option>)}
                    </select>
                  )}
                </div>
                <div className="w-16">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Jml</label>
                  <input 
                    type="number"
                    min="1"
                    value={item.jumlah}
                    onChange={(e) => handleItemChange(index, 'jumlah', parseInt(e.target.value) || 1)}
                    className={inputClass}
                    readOnly={!!id}
                  />
                </div>
                <div className="w-32">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Dosis / Aturan</label>
                  <input 
                    type="text"
                    value={item.dosis_aturan || ''}
                    onChange={(e) => handleItemChange(index, 'dosis_aturan', e.target.value)}
                    className={inputClass}
                    placeholder="Contoh: 3x1"
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
                Belum ada obat yang direkomendasikan.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 mt-4">
        <Button variant="secondary" onClick={onClose}>Tutup</Button>
        {!id && (
          <Button variant="primary" iconLeft={FiSave} onClick={handleSimpan} disabled={loading}>
            {loading ? 'Menyimpan...' : 'Simpan Rekam Swamedikasi'}
          </Button>
        )}
      </div>
    </ModalDialog>
  );
}
