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
  const [satuanLainnya, setSatuanLainnya] = useState([]);
  
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

  useEffect(() => {
    fetchProducts();
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
        title: 'Validation Failed',
        text: 'Product name is required for registration.',
        confirmButtonColor: '#7F56D9'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:8080/api/produk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      
      if (response.ok && result.status) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: result.message || 'Product catalog updated successfully.',
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'rounded-xl' }
        });
        setIsModalOpen(false);
        fetchProducts();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: result.message || 'Please check your inputs and try again.',
          confirmButtonColor: '#D92D20'
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'System could not reach API gateway.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { label: 'SKU / Identifier', key: 'sku', width: '150px', render: (val) => <span className="font-semibold text-primary-700">{val}</span> },
    { label: 'Product Signature', key: 'nama_produk', render: (val) => (
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900 dark:text-gray-100 uppercase text-xs">{val}</span>
        <span className="text-[10px] text-gray-500 font-medium tracking-tight">PHARMACEUTICAL ASSET</span>
      </div>
    )},
    { label: 'Classification', key: 'nama_kategori', render: (val, item) => (
      <div className="flex flex-col">
        <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">{val || '-'}</span>
        {item.kfa_code && <span className="text-[9px] text-success-600 font-bold uppercase tracking-widest mt-0.5">KFA: {item.kfa_code}</span>}
      </div>
    )},
    { 
      label: 'Acquisition Price', 
      key: 'harga_beli_referensi', 
      align: 'right',
      render: (val) => <span className="font-semibold text-gray-900 dark:text-gray-100 tabular-nums">Rp {new Intl.NumberFormat('id-ID').format(val)}</span> 
    },
    { 
      label: 'Unit', 
      key: 'nama_satuan',
      align: 'center',
      width: '100px',
      render: (val) => <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">{val || '-'}</span>
    },
    { 
      label: 'Market State', 
      key: 'is_dijual', 
      align: 'center',
      width: '120px',
      render: (val) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${val === 'ya' ? 'bg-success-50 text-success-700 border border-success-200' : 'bg-error-50 text-error-700 border border-error-200'}`}>
          {val === 'ya' ? 'Active' : 'Archived'}
        </span>
      ) 
    },
    { label: '', key: 'aksi', align: 'right', width: '80px', render: (_, item) => (
      <button onClick={() => handleOpenModal(item)} className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-all">
        <FiEdit2 size={16} />
      </button>
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
            kfa_code: '', kfa_name: ''
        });
        setSatuanLainnya([]);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-20">
      <SectionHeader 
        title="Product Inventory" 
        subtitle="Manage and regulate pharmaceutical products and catalog assets."
        icon={<FiBox size={24} className="text-gray-500" />}
      />

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
        <DataTable 
          data={products}
          columns={columns}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isLoading={isLoading}
          searchPlaceholder="Search by name, SKU or barcode..."
          primaryAction={{
            label: "Add Product",
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

              <div className="col-span-12 lg:col-span-8 grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
                  <input type="text" name="nama_produk" value={formData.nama_produk} onChange={handleInputChange} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none" placeholder="e.g. Paracetamol 500mg" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Manufacturer</label>
                  <input type="text" name="pabrik_prinsipal" value={formData.pabrik_prinsipal} onChange={handleInputChange} className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none" placeholder="e.g. Kimia Farma" />
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

          {/* Section 2: Logistics */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 pb-3">
              <FiLayers className="text-primary-600" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Logistics & Packaging</h3>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-4 space-y-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Base Stock Unit</label>
                <select 
                  name="satuan_utama_id"
                  value={formData.satuan_utama_id} 
                  onChange={handleInputChange}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none"
                >
                  <option value="1">Ampul</option>
                  <option value="2">Box</option>
                  <option value="3">Strip</option>
                  <option value="4">Pcs</option>
                </select>
                <p className="text-[10px] text-gray-500 font-medium italic mt-1.5">This unit will be used for all internal stock calculations.</p>
              </div>

              <div className="col-span-12 lg:col-span-8 space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Packaging Hierarchies</label>
                <div className="space-y-3">
                  {satuanLainnya.map((_, index) => (
                    <div key={index} className="flex items-center gap-3 animate-in fade-in duration-300">
                      <input type="number" className="w-16 bg-gray-50 border border-gray-300 rounded-lg px-2 py-2 text-sm text-center font-semibold outline-none" defaultValue="1" />
                      <select className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium outline-none">
                        <option>BOX</option>
                        <option>PACK</option>
                      </select>
                      <span className="text-xs text-gray-400">=</span>
                      <input type="number" className="w-16 bg-gray-50 border border-gray-300 rounded-lg px-2 py-2 text-sm text-center font-semibold outline-none" defaultValue="10" />
                      <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-500 min-w-[80px] text-center">
                        {formData.satuan_utama_id === '1' ? 'Ampul' : 'Pcs'}
                      </div>
                      <button onClick={() => setSatuanLainnya(satuanLainnya.filter((_, i) => i !== index))} className="p-2 text-gray-400 hover:text-error-600 transition-colors"><FiTrash2 size={16} /></button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setSatuanLainnya([...satuanLainnya, {}])}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <FiPlus size={14} /> Add conversion level
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
            <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-all">Cancel</button>
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
