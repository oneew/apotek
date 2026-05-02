import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiSave, FiSettings, FiCopy } from 'react-icons/fi';
import Swal from 'sweetalert2';
import Button from '../../../components/ui/Button';
import ModalDialog from '../../../components/ui/ModalDialog';

const API_BASE = 'http://localhost:8080/api';

export default function FormResepModal({ isOpen, onClose, onSaved, defaultSumber = 'Pelayanan' }) {
  const [loading, setLoading] = useState(false);
  const [dokters, setDokters] = useState([]);
  const [pelanggans, setPelanggans] = useState([]);
  const [produks, setProduks] = useState([]);

  // Form State
  const [form, setForm] = useState({
    tanggal_resep: new Date().toISOString().slice(0, 16),
    sumber: defaultSumber,
    pelanggan_id: '',
    dokter_id: '',
    is_racikan: false,
    catatan: ''
  });

  const [items, setItems] = useState([
    { id: Date.now(), produk_id: '', jumlah: 1, dosis_aturan: '', keterangan: '' }
  ]);

  useEffect(() => {
    if (isOpen) {
      fetchDependencies();
      // Reset form on open if needed
    }
  }, [isOpen]);

  const fetchDependencies = async () => {
    try {
      const [dokRes, pelRes, prodRes] = await Promise.all([
        fetch(`${API_BASE}/master/dokter`).then(r => r.json()),
        fetch(`${API_BASE}/master/pelanggan`).then(r => r.json()),
        fetch(`${API_BASE}/produk`).then(r => r.json())
      ]);

      if (dokRes.status) setDokters(dokRes.data);
      if (pelRes.status) setPelanggans(pelRes.data);
      if (prodRes.status) setProduks(prodRes.data);
    } catch (error) {
      console.error("Fetch dependencies error:", error);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), produk_id: '', jumlah: 1, dosis_aturan: '', keterangan: '' }]);
  };

  const handleRemoveItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSave = async () => {
    if (!form.pelanggan_id) {
      Swal.fire('Error', 'Silakan pilih pasien', 'error');
      return;
    }
    
    const validItems = items.filter(item => item.produk_id && item.jumlah > 0);
    if (validItems.length === 0) {
      Swal.fire('Error', 'Silakan masukkan minimal 1 produk/obat', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        tanggal_resep: form.tanggal_resep.replace('T', ' '),
        dokter_id: form.dokter_id || null,
        pelanggan_id: form.pelanggan_id,
        catatan: form.catatan,
        sumber: form.sumber,
        is_racikan: form.is_racikan === 'true' || form.is_racikan === true ? 1 : 0,
        items: validItems.map(item => ({
          produk_id: item.produk_id,
          jumlah: item.jumlah,
          dosis_aturan: item.dosis_aturan,
          keterangan: item.keterangan
        }))
      };

      const response = await fetch(`${API_BASE}/master/resep`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const res = await response.json();
      if (res.status) {
        Swal.fire({
          title: 'Tersimpan!',
          text: 'Data resep berhasil disimpan.',
          icon: 'success',
          confirmButtonColor: '#7F56D9'
        }).then(() => {
          onSaved(res.data.id);
          onClose();
        });
      } else {
        Swal.fire('Gagal', res.message || 'Gagal menyimpan resep', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Terjadi kesalahan sistem', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    const validItems = items.filter(item => item.produk_id && item.jumlah > 0);
    if (validItems.length === 0) {
      Swal.fire('Error', 'Silakan masukkan minimal 1 produk/obat untuk disimpan sebagai template', 'error');
      return;
    }

    const { value: templateName } = await Swal.fire({
      title: 'Simpan sebagai Template',
      input: 'text',
      inputLabel: 'Nama Template (cth: Resep Batuk Anak)',
      inputPlaceholder: 'Masukkan nama template',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Nama template tidak boleh kosong!'
        }
      }
    });

    if (templateName) {
      const existingTemplates = JSON.parse(localStorage.getItem('resep_templates') || '[]');
      
      const templateData = {
        id: Date.now().toString(),
        name: templateName,
        is_racikan: form.is_racikan,
        items: validItems.map(item => {
           const produkInfo = produks.find(p => p.id == item.produk_id);
           return {
             produk_id: item.produk_id,
             jumlah: item.jumlah,
             dosis_aturan: item.dosis_aturan,
             keterangan: item.keterangan,
             nama_produk: produkInfo ? produkInfo.nama_produk : ''
           };
        }),
        created_at: new Date().toISOString()
      };

      existingTemplates.push(templateData);
      localStorage.setItem('resep_templates', JSON.stringify(existingTemplates));
      
      Swal.fire('Berhasil!', `Template "${templateName}" telah disimpan.`, 'success');
    }
  };

  // Exposed method via props or just listen to an event, but easier to pass applyTemplate as prop or handle it inside.
  // Actually, we can add a "Pilih Template" button right inside this modal to load from localStorage.
  const loadTemplate = async () => {
    const existingTemplates = JSON.parse(localStorage.getItem('resep_templates') || '[]');
    if (existingTemplates.length === 0) {
      Swal.fire('Info', 'Belum ada template resep yang tersimpan.', 'info');
      return;
    }

    const inputOptions = {};
    existingTemplates.forEach(t => {
      inputOptions[t.id] = t.name;
    });

    const { value: templateId } = await Swal.fire({
      title: 'Gunakan Template',
      input: 'select',
      inputOptions: inputOptions,
      inputPlaceholder: 'Pilih Template...',
      showCancelButton: true,
    });

    if (templateId) {
      const selected = existingTemplates.find(t => t.id === templateId);
      if (selected) {
        setForm(prev => ({
          ...prev,
          is_racikan: selected.is_racikan
        }));
        setItems(selected.items.map(item => ({
          id: Date.now() + Math.random(),
          produk_id: item.produk_id,
          jumlah: item.jumlah,
          dosis_aturan: item.dosis_aturan,
          keterangan: item.keterangan
        })));
      }
    }
  };

  const inputClass = "w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium";
  const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";

  return (
    <ModalDialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Catat Resep Baru" 
      subtitle="Input resep dokter atau resep masuk eksternal."
      icon={<FiPlus />}
      maxWidth="max-w-4xl"
    >
      <div className="p-6">
        {/* Top Control Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
          <div>
              <label className={labelClass}>Tanggal Resep *</label>
              <input 
                type="datetime-local" 
                name="tanggal_resep"
                value={form.tanggal_resep}
                onChange={handleChange}
                className={inputClass} 
              />
          </div>
          <div>
              <label className={labelClass}>Sumber Resep *</label>
              <select 
                name="sumber"
                value={form.sumber}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Pelayanan">Apoteker (Internal)</option>
                <option value="Kasir">Kasir (Eksternal)</option>
              </select>
          </div>
          <div>
            <label className={labelClass}>Pasien *</label>
            <select 
              name="pelanggan_id"
              value={form.pelanggan_id}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">-- Pilih Pasien --</option>
              {pelanggans.map(p => (
                <option key={p.id} value={p.id}>{p.nama_pelanggan} - {p.no_telepon || '-'}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Dokter Peresep</label>
            <select 
              name="dokter_id"
              value={form.dokter_id}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">-- Pilih Dokter (Opsional) --</option>
              {dokters.map(d => (
                <option key={d.id} value={d.id}>{d.nama_dokter} - {d.spesialisasi || 'Umum'}</option>
              ))}
            </select>
          </div>
          <div>
              <label className={labelClass}>Jenis Resep</label>
              <select 
                name="is_racikan"
                value={form.is_racikan}
                onChange={handleChange}
                className={inputClass}
              >
                <option value={false}>Obat Non-Racikan</option>
                <option value={true}>Obat Racikan</option>
              </select>
          </div>
          <div className="lg:col-span-3">
            <label className={labelClass}>Catatan Tambahan</label>
            <input 
              type="text" 
              name="catatan"
              value={form.catatan}
              onChange={handleChange}
              placeholder="Catatan penebusan atau keterangan lain..." 
              className={inputClass} 
            />
          </div>
        </div>

        {/* Prescription Items */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-base tracking-tight">Detail Obat / R/</h3>
          <div className="flex gap-2">
            <button 
              onClick={loadTemplate}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <FiCopy size={12} /> Gunakan Template
            </button>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          {items.map((item, index) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-start gap-4 p-4 border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50/50 dark:bg-gray-800/20">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-extrabold flex-shrink-0 mt-6 sm:mt-0">
                  R/
                </div>
                
                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-4">
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Nama Obat *</label>
                      <select 
                        value={item.produk_id}
                        onChange={(e) => handleItemChange(item.id, 'produk_id', e.target.value)}
                        className={inputClass}
                      >
                        <option value="">-- Pilih Obat --</option>
                        {produks.map(p => (
                          <option key={p.id} value={p.id}>{p.nama_produk} (Stok: {p.stok_total})</option>
                        ))}
                      </select>
                  </div>

                  <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Jumlah *</label>
                      <input 
                        type="number" 
                        min="1"
                        value={item.jumlah}
                        onChange={(e) => handleItemChange(item.id, 'jumlah', e.target.value)}
                        className={inputClass} 
                      />
                  </div>

                  <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Signa</label>
                      <input 
                        type="text" 
                        placeholder="Cth: 3 x 1 tab"
                        value={item.dosis_aturan}
                        onChange={(e) => handleItemChange(item.id, 'dosis_aturan', e.target.value)}
                        className={inputClass} 
                      />
                  </div>

                  <div className="sm:col-span-3">
                      <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Keterangan</label>
                      <input 
                        type="text" 
                        placeholder="Cth: Sesudah makan"
                        value={item.keterangan}
                        onChange={(e) => handleItemChange(item.id, 'keterangan', e.target.value)}
                        className={inputClass} 
                      />
                  </div>
                </div>

                <button 
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={items.length === 1}
                  title="Hapus Item"
                  className={`mt-6 sm:mt-0 p-2 rounded-lg transition-colors flex-shrink-0 ${items.length === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                >
                  <FiTrash2 size={16} />
                </button>
            </div>
          ))}
        </div>

        <div className="flex justify-center mb-8">
          <button 
            onClick={handleAddItem}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
          >
            <FiPlus size={16} /> Tambah Obat / Racikan
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center rounded-b-xl">
         <button onClick={handleSaveTemplate} className="text-xs font-bold text-gray-500 hover:text-primary-600 transition-colors flex items-center gap-1.5">
           <FiSettings size={14} /> Simpan sebagai Template
         </button>
         <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>Batal</Button>
            <Button variant="primary" iconLeft={FiSave} onClick={handleSave} disabled={loading}>
               {loading ? 'Menyimpan...' : 'Simpan Resep'}
            </Button>
         </div>
      </div>
    </ModalDialog>
  );
}
