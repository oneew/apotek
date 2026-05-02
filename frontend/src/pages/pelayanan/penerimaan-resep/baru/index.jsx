import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiPlus, FiTrash2, FiSave, FiAlertCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Button from '../../../../components/ui/Button';

const API_BASE = 'http://localhost:8080/api';

export default function FormPenerimaanResep() {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [dokters, setDokters] = useState([]);
  const [pelanggans, setPelanggans] = useState([]);
  const [produks, setProduks] = useState([]);

  // Form State
  const [form, setForm] = useState({
    tanggal_resep: new Date().toISOString().slice(0, 16),
    sumber: 'Pelayanan',
    pelanggan_id: '',
    dokter_id: '',
    is_racikan: false,
    catatan: ''
  });

  const [items, setItems] = useState([
    { id: Date.now(), produk_id: '', jumlah: 1, dosis_aturan: '', keterangan: '' }
  ]);

  useEffect(() => {
    fetchDependencies();
  }, []);

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
    // Validate
    if (!form.pelanggan_id) {
      Swal.fire('Error', 'Silakan pilih pasien', 'error');
      return;
    }
    
    // Filter out items without product
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
          navigate('/pelayanan/penerimaan-resep');
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

  const inputClass = "w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium";
  const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";
  const cardClass = "bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm";

  return (
    <div className="animate-unt-fade">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Catat Resep Baru</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Masukkan data resep dari dokter atau klinik eksternal.</p>
          </div>
        </div>
        <Button 
          onClick={handleSave}
          disabled={loading}
          variant="primary"
          iconLeft={FiSave}
          className="rounded-lg shadow-sm"
        >
          {loading ? 'Menyimpan...' : 'Simpan Resep'}
        </Button>
      </div>

      <div className="space-y-6">
        
        {/* Top Control Bar */}
        <div className={cardClass}>
          <h3 className="font-bold text-gray-900 dark:text-white text-base mb-6 tracking-tight border-b border-gray-100 dark:border-gray-800 pb-3">Informasi Umum</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
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
            <div>
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
        </div>

        {/* Prescription Items */}
        <div className={cardClass}>
           <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white text-base tracking-tight">Detail Obat / R/</h3>
              <div className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                {items.length} Item
              </div>
           </div>
           
           <div className="space-y-6">
              {items.map((item, index) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start gap-4 p-4 border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50/50 dark:bg-gray-800/20 relative group transition-all hover:border-primary-200">
                   <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 text-primary-700 font-extrabold flex-shrink-0 mt-6 sm:mt-0">
                     R/
                   </div>
                   
                   <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-12 gap-4">
                      {/* Drug Selector */}
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

                      {/* Quantity */}
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

                      {/* Signa / Dosis Aturan */}
                      <div className="sm:col-span-3">
                         <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Signa (Aturan Pakai)</label>
                         <input 
                           type="text" 
                           placeholder="Contoh: 3 x 1 tablet pc"
                           value={item.dosis_aturan}
                           onChange={(e) => handleItemChange(item.id, 'dosis_aturan', e.target.value)}
                           className={inputClass} 
                         />
                      </div>

                      {/* Keterangan */}
                      <div className="sm:col-span-3">
                         <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Keterangan Khusus</label>
                         <input 
                           type="text" 
                           placeholder="Catatan pada etiket..."
                           value={item.keterangan}
                           onChange={(e) => handleItemChange(item.id, 'keterangan', e.target.value)}
                           className={inputClass} 
                         />
                      </div>
                   </div>

                   {/* Delete Action */}
                   <button 
                     onClick={() => handleRemoveItem(item.id)}
                     disabled={items.length === 1}
                     title="Hapus Item"
                     className={`mt-6 sm:mt-0 p-2 rounded-lg transition-colors flex-shrink-0 ${items.length === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                   >
                     <FiTrash2 size={20} />
                   </button>
                </div>
              ))}
           </div>

           <div className="mt-6 flex justify-center border-t border-dashed border-gray-200 dark:border-gray-700 pt-6">
             <Button 
               onClick={handleAddItem}
               variant="secondary"
               iconLeft={FiPlus}
               className="rounded-full shadow-sm text-primary-600 border-primary-200 hover:bg-primary-50"
             >
               Tambah Obat / Racikan
             </Button>
           </div>
        </div>
      </div>
    </div>
  );
}

