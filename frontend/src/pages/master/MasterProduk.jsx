import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import ModalDialog from '../../components/ui/ModalDialog';
import { FiPlus, FiEdit2, FiTrash2, FiBox, FiPackage, FiSearch, FiRefreshCw, FiInfo, FiTag, FiLayers, FiCreditCard, FiActivity } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function MasterProduk() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [isModalSatuanOpen, setIsModalSatuanOpen] = useState(false);
  const [showMargin, setShowMargin] = useState(false);
  // konversi: array of { nama_satuan_beli: 'Strip', isi: 10, is_default_beli: false }
  const [konversi, setKonversi] = useState([]);
  const [satuanList, setSatuanList] = useState([]); // list dari API m_satuan
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    tipe_produk: 'Obat',
    nama_produk: '',
    pabrik_prinsipal: '',
    sku: '',
    barcode: '',
    satuan_utama_id: '1',
    harga_beli_referensi: '',
    harga_jual_utama: '',
    status_penjualan: 'Dijual',
    resep_wajib: 'Tidak Wajib',
    komisi_penjualan: 'Tidak Ada',
    rak_penyimpanan: '1',
    katalog_online: 'Tampilkan',
    zat_aktif: '',
    bentuk_sediaan: '',
    indikasi_utama: '',
    catatan_lainnya: '',
    kategori_1_id: '1',
    pajak: 'PPN',
    nie: '',
    kfa_code: '',
    kfa_name: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/produk');
      const result = await response.json();
      if (result.status) {
        setProducts(result.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSatuan = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/master/satuan');
      const result = await res.json();
      if (result.status) setSatuanList(result.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchProducts();
    fetchSatuan();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.nama_produk) {
      Swal.fire({
        icon: 'warning',
        title: 'Validasi Gagal',
        text: 'Nama produk harus diisi.',
        confirmButtonColor: '#7F56D9'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Sertakan data konversi dalam payload
      const payload = { ...formData, konversi };
      const url = isEditing ? `http://localhost:8080/api/produk/${formData.id}` : 'http://localhost:8080/api/produk';
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      
      if (response.ok && result.status) {
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: result.message || 'Data produk berhasil disimpan.',
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'rounded-xl' }
        });
        setIsModalOpen(false);
        fetchProducts();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: result.message || 'Terjadi kesalahan saat menyimpan data.',
          confirmButtonColor: '#D92D20'
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Kesalahan Jaringan',
        text: 'Sistem tidak dapat terhubung ke server.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Apakah anda yakin?',
      text: "Data produk ini akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#7F56D9',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:8080/api/produk/${id}`, { method: 'DELETE' });
        const res = await response.json();
        if (res.status) {
          Swal.fire('Terhapus!', 'Produk telah dihapus.', 'success');
          fetchProducts();
        }
      } catch (err) {
        Swal.fire('Gagal!', 'Terjadi kesalahan jaringan.', 'error');
      }
    }
  };

  const handleOpenEdit = (item) => {
    setIsEditing(true);
    setFormData({ ...item });
    // Load konversi satuan dari data produk
    setKonversi(item.konversi || []);
    setIsModalOpen(true);
  };

  const columns = [
    { label: 'SKU / Identifier', key: 'sku', width: '150px', render: (val) => <span className="font-semibold text-primary-700">{val}</span> },
    { label: 'Identitas Produk', key: 'nama_produk', render: (val) => (
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-xs">{val}</span>
        <span className="text-[10px] text-gray-500 font-medium tracking-tight">DATA PRODUK APOTEK</span>
      </div>
    )},
    { label: 'Klasifikasi', key: 'nama_kategori', render: (val, item) => (
      <div className="flex flex-col">
        <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">{val || '-'}</span>
        {item.kfa_code && <span className="text-[9px] text-success-600 font-bold uppercase tracking-widest mt-0.5">KFA: {item.kfa_code}</span>}
      </div>
    )},
    { 
      label: 'Harga Beli', 
      key: 'harga_beli_referensi', 
      align: 'right',
      render: (val) => <span className="font-semibold text-gray-900 dark:text-gray-100 tabular-nums">Rp {new Intl.NumberFormat('id-ID').format(val)}</span> 
    },
    { 
      label: 'Satuan Terkecil', 
      key: 'nama_satuan_terkecil',
      align: 'center',
      width: '120px',
      render: (val) => <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">{val || '-'}</span>
    },
    { 
      label: 'Status', 
      key: 'is_dijual', 
      align: 'center',
      width: '120px',
      render: (val) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${val === 'ya' ? 'bg-success-50 text-success-700 border border-success-200' : 'bg-error-50 text-error-700 border border-error-200'}`}>
          {val === 'ya' ? 'Aktif' : 'Non-Aktif'}
        </span>
      ) 
    },
    { label: 'Aksi', key: 'aksi', align: 'right', width: '120px', render: (_, item) => (
      <div className="flex justify-end gap-2">
        <button onClick={() => handleOpenEdit(item)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="Edit">
          <FiEdit2 size={16} />
        </button>
        <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Hapus">
          <FiTrash2 size={16} />
        </button>
      </div>
    ) }
  ];

  const handleOpenModal = (edit = false) => {
    setIsEditing(edit);
    setIsModalOpen(true);
    if (!edit) {
        setFormData({
            tipe_produk: 'Obat', nama_produk: '', pabrik_prinsipal: '', sku: '', barcode: '',
            satuan_utama_id: '1', harga_beli_referensi: '', harga_jual_utama: '',
            status_penjualan: 'Dijual', resep_wajib: 'Tidak Wajib', komisi_penjualan: 'Tidak Ada',
            rak_penyimpanan: '1', katalog_online: 'Tampilkan',
            zat_aktif: '', bentuk_sediaan: '', indikasi_utama: '', catatan_lainnya: '',
            kategori_1_id: '1', pajak: 'PPN', nie: '',
            kfa_code: '', kfa_name: '', drug_class: '-'
        });
        setKonversi([]); // reset konversi
    }
  };

  // Helper untuk update baris konversi
  const updateKonversi = (index, field, value) => {
    setKonversi(prev => prev.map((k, i) => i === index ? { ...k, [field]: value } : k));
  };
  const addKonversi = () => setKonversi(prev => [...prev, { nama_satuan_beli: '', isi: 1, is_default_beli: false }]);
  const removeKonversi = (index) => setKonversi(prev => prev.filter((_, i) => i !== index));


  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-20">
      <SectionHeader 
        title="Daftar Produk" 
        subtitle="Kelola dan atur daftar obat serta aset barang farmasi."
        icon={<FiBox size={24} className="text-gray-500" />}
      />

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
        <DataTable 
          data={products}
          columns={columns}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isLoading={isLoading}
          searchPlaceholder="Cari produk, SKU atau barcode..."
          primaryAction={{
            label: "Tambah Produk",
            onClick: () => handleOpenModal(false)
          }}
        />
      </div>

      <ModalDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? 'Edit Asset Record' : 'Create New Asset'}
        subtitle="Ensure data integrity for accurate inventory tracking."
        icon={<FiPackage />}
        maxWidth="max-w-4xl"
      >
        <div className="p-8 space-y-10">
          {/* Section 1: General Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <FiTag className="text-primary-600" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">General Information</h3>
            </div>
            
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-4 space-y-1.5 focus-within:text-primary-600 transition-colors">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Classification</label>
                <div className="flex bg-gray-50 dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                  {['Obat', 'Alkes', 'Umum'].map(type => (
                    <button 
                      key={type}
                      onClick={() => handleFieldChange('tipe_produk', type)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${formData.tipe_produk === type ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-span-12 lg:col-span-8 grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5 lg:col-span-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
                  <input type="text" name="nama_produk" value={formData.nama_produk} onChange={handleInputChange} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none" placeholder="e.g. Paracetamol 500mg" />
                </div>
                <div className="space-y-1.5 lg:col-span-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Manufacturer</label>
                  <input type="text" name="pabrik_prinsipal" value={formData.pabrik_prinsipal} onChange={handleInputChange} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none" placeholder="e.g. Kimia Farma" />
                </div>
                <div className="space-y-1.5 lg:col-span-1">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Drug Class (Interaction Safety)</label>
                  <select name="drug_class" value={formData.drug_class || '-'} onChange={handleInputChange} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none">
                    <option value="-">- Bukan Obat Spesifik -</option>
                    <option value="NSAID">NSAID (Painkillers)</option>
                    <option value="Antikoagulan">Antikoagulan (Pengencer Darah)</option>
                    <option value="ACE Inhibitor">ACE Inhibitor (Darah Tinggi)</option>
                    <option value="Potassium-sparing Diuretics">Diuretik Hemat Kalium</option>
                    <option value="Beta Blocker">Beta Blocker (Jantung)</option>
                    <option value="Calcium Channel Blocker">Calcium Channel Blocker</option>
                    <option value="Statin">Statin (Kolesterol)</option>
                    <option value="Makrolida">Makrolida (Antibiotik)</option>
                    <option value="Antasida">Antasida (Lambung)</option>
                    <option value="Tetrasiklin">Tetrasiklin (Antibiotik)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Internal SKU</label>
                <div className="relative group">
                  <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm font-semibold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none uppercase font-mono" placeholder="AUTO_GEN" />
                  <button className="absolute right-2 top-1.5 p-1 text-gray-400 hover:text-primary-600 transition-colors"><FiRefreshCw size={14} /></button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Barcode / EAN</label>
                <input type="text" name="barcode" value={formData.barcode} onChange={handleInputChange} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none" placeholder="Scan barcode..." />
              </div>
            </div>
          </div>

          {/* Section 2: Logistics & Konversi Satuan */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <FiLayers className="text-primary-600" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Logistics & Konversi Satuan</h3>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-4 space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Satuan Terkecil (Base Unit)</label>
                <select 
                  name="satuan_utama_id"
                  value={formData.satuan_utama_id} 
                  onChange={handleInputChange}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                >
                  {satuanList.length > 0
                    ? satuanList.map(s => <option key={s.id} value={s.id}>{s.nama_satuan}</option>)
                    : <>
                        <option value="1">Tablet</option>
                        <option value="2">Kapsul</option>
                        <option value="3">Ampul</option>
                        <option value="4">Sachet</option>
                        <option value="5">Botol</option>
                      </>
                  }
                </select>
                <p className="text-[10px] text-primary-600 font-semibold mt-1.5 bg-primary-50 px-2 py-1 rounded">
                  ✓ Satuan ini dipakai untuk semua perhitungan stok internal.
                </p>
              </div>

              <div className="col-span-12 lg:col-span-8 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Konversi Satuan Beli</label>
                  <span className="text-[10px] text-gray-400 italic">Opsional: jika beli per strip/box</span>
                </div>

                {/* Header hint */}
                {konversi.length === 0 && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <span className="text-amber-600 text-xs">💡</span>
                    <p className="text-xs text-amber-700 font-medium">
                      Tambah konversi jika obat dibeli dalam strip/box. Contoh: 1 Strip = 10 Tablet.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  {konversi.map((k, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                      <span className="text-xs text-gray-400 font-medium shrink-0">1</span>
                      <input
                        type="text"
                        placeholder="Strip / Box / Dus"
                        value={k.nama_satuan_beli}
                        onChange={e => updateKonversi(index, 'nama_satuan_beli', e.target.value)}
                        className="flex-1 bg-white border border-gray-300 rounded px-2 py-1.5 text-xs font-semibold outline-none focus:border-primary-500 min-w-0"
                      />
                      <span className="text-xs text-gray-400 font-medium shrink-0">=</span>
                      <input
                        type="number"
                        min="1"
                        placeholder="10"
                        value={k.isi}
                        onChange={e => updateKonversi(index, 'isi', parseInt(e.target.value) || 1)}
                        className="w-16 bg-white border border-gray-300 rounded px-2 py-1.5 text-xs font-bold text-center outline-none focus:border-primary-500"
                      />
                      <div className="px-2 py-1.5 bg-primary-50 border border-primary-200 rounded text-xs font-semibold text-primary-700 shrink-0">
                        {satuanList.find(s => String(s.id) === String(formData.satuan_utama_id))?.nama_satuan || 'Satuan'}
                      </div>
                      <label className="flex items-center gap-1 shrink-0 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!k.is_default_beli}
                          onChange={e => updateKonversi(index, 'is_default_beli', e.target.checked)}
                          className="w-3 h-3 accent-primary-600"
                        />
                        <span className="text-[10px] text-gray-500">Default</span>
                      </label>
                      <button onClick={() => removeKonversi(index)} className="p-1 text-gray-300 hover:text-red-500 transition-colors shrink-0">
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  ))}

                  <button 
                    onClick={addKonversi}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors mt-1"
                  >
                    <FiPlus size={13} /> Tambah Konversi Satuan
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Financials */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <FiCreditCard className="text-primary-600" />
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Financial Intelligence</h3>
              </div>
              <button 
                onClick={() => setShowMargin(!showMargin)}
                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border transition-all ${showMargin ? 'bg-primary-50 text-primary-600 border-primary-200' : 'bg-gray-50 text-gray-400 border-gray-200'}`}
              >
                {showMargin ? 'Hide Analytics' : 'Show Margin Analyser'}
              </button>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-4 space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Base Acquisition Cost</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-[10px]">RP</span>
                  <input type="number" name="harga_beli_referensi" value={formData.harga_beli_referensi} onChange={handleInputChange} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg pl-10 pr-3 py-2 text-sm font-semibold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none" placeholder="0" />
                </div>
              </div>
              <div className="col-span-12 lg:col-span-4 space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Standard Retail Price</label>
                <div className="relative font-semibold">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-500 text-[10px]">RP</span>
                  <input type="number" name="harga_jual_utama" value={formData.harga_jual_utama} onChange={handleInputChange} className="w-full bg-white dark:bg-gray-900 border border-primary-300 dark:border-primary-700/50 rounded-lg pl-10 pr-3 py-2 text-sm font-bold text-primary-700 dark:text-primary-300 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none" placeholder="0" />
                </div>
              </div>
              {showMargin && (
                <div className="col-span-12 lg:col-span-4 space-y-1.5 animate-in zoom-in-95 duration-300">
                  <label className="text-sm font-medium text-success-700">Projected Markup</label>
                  <div className="w-full bg-success-50 dark:bg-success-950/20 border border-success-200 dark:border-success-900 rounded-lg px-4 py-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-success-800 dark:text-success-300">Margin</span>
                    <span className="text-sm font-bold text-success-700 dark:text-success-400">
                      {formData.harga_beli_referensi && formData.harga_jual_utama 
                        ? `${Math.round(((formData.harga_jual_utama - formData.harga_beli_referensi) / formData.harga_beli_referensi) * 100)}%` 
                        : '0%'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Operations & Compliance */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <FiActivity className="text-primary-600" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Operations & SATUSEHAT Compliance</h3>
            </div>
 
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-4 space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Shelf Placement (Rak)</label>
                <select name="rak_penyimpanan" value={formData.rak_penyimpanan} onChange={handleInputChange} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium outline-none shadow-sm">
                  <option value="1">RAK DEPAN A-01</option>
                  <option value="2">RAK UTAMA B-05</option>
                </select>
              </div>
              <div className="col-span-12 lg:col-span-4 space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">BPOM / NIE Registration</label>
                <input type="text" name="nie" value={formData.nie} onChange={handleInputChange} className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none" placeholder="Reg ID..." />
              </div>
              <div className="col-span-12 lg:col-span-4 space-y-1.5">
                <label className="text-sm font-medium text-success-700">Kemenkes KFA Code</label>
                <div className="relative">
                  <input type="text" name="kfa_code" value={formData.kfa_code} onChange={handleInputChange} className="w-full bg-success-50/30 border border-success-200 rounded-lg px-3 py-2 text-sm font-bold text-success-700 focus:ring-4 focus:ring-success-500/10 focus:border-success-500 transition-all outline-none uppercase" placeholder="KFA-000XXX" />
                  <div className="absolute -top-6 right-0">
                    <a href="https://kfa.kemkes.go.id" target="_blank" rel="noreferrer" className="text-[9px] font-bold text-primary-600 hover:underline flex items-center gap-1">
                      <FiInfo size={10} /> Look up KFA
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Official KFA Generic Name</label>
              <input type="text" name="kfa_name" value={formData.kfa_name} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none" placeholder="e.g., Paracetamol 500 mg Tablet (KFA Name)" />
              <p className="text-[10px] text-gray-400 font-medium">Matching the generic name ensures higher bridge synchronization success rate.</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-all">Batal</button>
            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="px-10 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Syncing...' : 'Save Product Record'}
            </button>
          </div>
        </div>
      </ModalDialog>
    </div>
  );
}
