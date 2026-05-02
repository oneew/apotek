import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import { FiPlus, FiFilter, FiRefreshCw, FiAlertCircle, FiSearch, FiTrash2, FiSave, FiCheckCircle } from 'react-icons/fi';
import ModalDialog from '../../components/ui/ModalDialog';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:8080/api';

export default function PersediaanPenyesuaianStok() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAdjustment, setSelectedAdjustment] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0] + 'T' + new Date().toTimeString().split(' ')[0].substring(0, 5),
    keterangan: '',
    items: []
  });

  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`${API_BASE}/master/penyesuaian-stok`);
      if (resp.data.status) setData(resp.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const resp = await axios.get(`${API_BASE}/produk`);
      if (resp.data.status) setProducts(resp.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchProducts();
  }, []);

  const handleAddProduct = (p) => {
    if (formData.items.find(item => item.produk_id === p.id)) {
      return Swal.fire('Info', 'Produk sudah ada dalam daftar', 'info');
    }
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          produk_id: p.id,
          nama_produk: p.nama_produk,
          sku: p.sku,
          stok_sistem: p.stok_total || 0,
          stok_fisik: p.stok_total || 0,
          selisih: 0,
          keterangan: ''
        }
      ]
    });
    setProductSearch('');
  };

  const handleUpdateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    if (field === 'stok_fisik') {
      newItems[index].selisih = value - newItems[index].stok_sistem;
    }
    setFormData({ ...formData, items: newItems });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async () => {
    if (formData.items.length === 0) return Swal.fire('Error', 'Daftar produk masih kosong', 'error');
    
    setIsSubmitting(true);
    try {
      const resp = await axios.post(`${API_BASE}/master/penyesuaian-stok`, formData);
      if (resp.data.status) {
        Swal.fire('Berhasil', 'Penyesuaian stok berhasil disimpan', 'success');
        setIsModalOpen(false);
        setFormData({ tanggal: new Date().toISOString().substring(0, 16), keterangan: '', items: [] });
        fetchHistory();
      }
    } catch (err) {
      Swal.fire('Error', 'Gagal menyimpan penyesuaian', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showDetail = async (id) => {
    try {
      const resp = await axios.get(`${API_BASE}/master/penyesuaian-stok/${id}`);
      if (resp.data.status) {
        setSelectedAdjustment(resp.data.data);
        setIsDetailModalOpen(true);
      }
    } catch (err) {
      Swal.fire('Error', 'Gagal memuat detail', 'error');
    }
  };

  const columns = [
    { key: 'no', label: 'No.', width: '60px', render: (_, __, i) => i + 1 },
    { 
      key: 'tanggal', 
      label: 'Tanggal', 
      render: (val) => new Date(val).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) 
    },
    { key: 'no_penyesuaian', label: 'No. Penyesuaian', render: (val) => <span className="font-bold text-primary-600">{val}</span> },
    { key: 'total_item', label: 'Total Item', align: 'center' },
    { key: 'keterangan', label: 'Keterangan', render: (val) => val || '-' },
    { 
      key: 'actions', 
      label: 'Aksi', 
      align: 'right',
      render: (_, row) => (
        <Button variant="secondary" size="sm" onClick={() => showDetail(row.id)}>Detail</Button>
      )
    }
  ];

  return (
    <div className="animate-unt-fade pb-20">
      <SectionHeader 
        title="Penyesuaian Stok" 
        subtitle="Kelola koreksi stok fisik obat dan alat kesehatan secara manual."
      >
        <Button icon={<FiPlus />} onClick={() => setIsModalOpen(true)}>Penyesuaian Baru</Button>
      </SectionHeader>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-4 mt-8 mb-6 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <Button variant="secondary" icon={<FiRefreshCw className={loading ? "animate-spin" : ""} />} onClick={fetchHistory}>Refresh</Button>
         </div>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        isLoading={loading}
      />

      {/* Create Adjustment Modal */}
      <ModalDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Form Penyesuaian Stok"
        subtitle="Input selisih stok fisik hasil stock opname atau koreksi manual."
        maxWidth="max-w-5xl"
        icon={<FiAlertCircle />}
      >
        <div className="p-6 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Tanggal & Waktu</label>
                <input 
                  type="datetime-local" 
                  value={formData.tanggal}
                  onChange={e => setFormData({...formData, tanggal: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Keterangan Umum</label>
                <input 
                  type="text" 
                  placeholder="Contoh: Stok opname berkala"
                  value={formData.keterangan}
                  onChange={e => setFormData({...formData, keterangan: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500"
                />
              </div>
           </div>

           <div className="relative">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Cari Produk untuk Disesuaikan</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Ketik nama produk atau SKU..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:border-primary-500"
                />
              </div>
              
              {productSearch && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {products.filter(p => p.nama_produk.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase())).map(p => (
                    <div 
                      key={p.id} 
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-50 dark:border-gray-800 last:border-0 flex justify-between items-center"
                      onClick={() => handleAddProduct(p)}
                    >
                       <div>
                         <p className="text-sm font-bold text-gray-900 dark:text-white">{p.nama_produk}</p>
                         <p className="text-[10px] text-gray-500 uppercase font-mono">{p.sku} • Stok: {p.stok_total || 0}</p>
                       </div>
                       <Button size="sm" variant="secondary" icon={<FiPlus />}>Pilih</Button>
                    </div>
                  ))}
                </div>
              )}
           </div>

           <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                 <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                       <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase">Produk</th>
                       <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase w-32">Stok Sistem</th>
                       <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase w-32">Stok Fisik</th>
                       <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase w-24">Selisih</th>
                       <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase">Alasan/Ket</th>
                       <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase w-16"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {formData.items.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-10 text-center text-gray-400 text-sm italic">Belum ada produk yang dipilih.</td>
                      </tr>
                    ) : formData.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                        <td className="px-4 py-3">
                           <p className="text-sm font-bold text-gray-900 dark:text-white">{item.nama_produk}</p>
                           <p className="text-[10px] text-gray-500 font-mono">{item.sku}</p>
                        </td>
                        <td className="px-4 py-3">
                           <input type="number" readOnly value={item.stok_sistem} className="w-full bg-gray-100 dark:bg-gray-900 border-0 rounded px-2 py-1 text-sm font-bold text-gray-600 outline-none" />
                        </td>
                        <td className="px-4 py-3">
                           <input 
                             type="number" 
                             value={item.stok_fisik} 
                             onChange={e => handleUpdateItem(idx, 'stok_fisik', parseFloat(e.target.value) || 0)}
                             className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-primary-500" 
                           />
                        </td>
                        <td className="px-4 py-3">
                           <span className={`text-sm font-bold ${item.selisih > 0 ? 'text-emerald-600' : item.selisih < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                              {item.selisih > 0 ? '+' : ''}{item.selisih}
                           </span>
                        </td>
                        <td className="px-4 py-3">
                           <input 
                             type="text" 
                             placeholder="Alasan..." 
                             value={item.keterangan}
                             onChange={e => handleUpdateItem(idx, 'keterangan', e.target.value)}
                             className="w-full bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm outline-none focus:border-primary-500" 
                           />
                        </td>
                        <td className="px-4 py-3 text-right">
                           <button onClick={() => handleRemoveItem(idx)} className="text-gray-400 hover:text-red-500 transition-colors"><FiTrash2 /></button>
                        </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
            <div className="flex items-center gap-2 text-amber-600">
               <FiAlertCircle />
               <span className="text-xs font-semibold">Penyesuaian akan langsung mengupdate stok batch & kartu stok.</span>
            </div>
            <div className="flex gap-3">
               <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
               <Button icon={<FiSave />} disabled={isSubmitting} onClick={handleSubmit}>{isSubmitting ? 'Menyimpan...' : 'Simpan Penyesuaian'}</Button>
            </div>
        </div>
      </ModalDialog>

      {/* Detail Modal */}
      <ModalDialog
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Detail Penyesuaian: ${selectedAdjustment?.no_penyesuaian}`}
        subtitle="Rincian item produk yang disesuaikan stoknya."
        maxWidth="max-w-4xl"
        icon={<FiCheckCircle className="text-emerald-500" />}
      >
        {selectedAdjustment && (
          <div className="p-6">
             <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 mb-6 flex justify-between items-center">
                <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Keterangan</p>
                   <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedAdjustment.keterangan || '-'}</p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tanggal</p>
                   <p className="text-sm font-bold text-gray-900 dark:text-white">{new Date(selectedAdjustment.tanggal).toLocaleString('id-ID')}</p>
                </div>
             </div>

             <div className="space-y-4">
                {selectedAdjustment.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl hover:shadow-sm transition-all">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 flex items-center justify-center font-bold text-xs uppercase">
                           {item.nama_produk.substring(0, 2)}
                        </div>
                        <div>
                           <h5 className="text-sm font-bold text-gray-900 dark:text-white">{item.nama_produk}</h5>
                           <p className="text-[10px] text-gray-500 font-mono">{item.sku} • {item.keterangan || 'Tanpa catatan item'}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-8">
                        <div className="text-right">
                           <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Sistem → Fisik</p>
                           <p className="text-xs font-bold text-gray-600">{item.stok_sistem} → <span className="text-gray-900 dark:text-white">{item.stok_fisik}</span></p>
                        </div>
                        <div className={`px-3 py-1 rounded-lg text-xs font-black border ${item.selisih > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : item.selisih < 0 ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                           {item.selisih > 0 ? '+' : ''}{item.selisih}
                        </div>
                     </div>
                  </div>
                ))}
             </div>
             <div className="mt-8 flex justify-end">
                <Button variant="secondary" onClick={() => setIsDetailModalOpen(false)}>Tutup</Button>
             </div>
          </div>
        )}
      </ModalDialog>
    </div>
  );
}
