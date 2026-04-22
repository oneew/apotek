import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import ModalDialog from '../../components/ui/ModalDialog';
import { FiFilter, FiSearch, FiPlus, FiTrash2, FiEdit2, FiTruck, FiBox } from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function KonsinyasiMasuk() {
  const [data, setData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    no_faktur: '',
    tanggal: new Date().toISOString().split('T')[0],
    supplier_id: '',
    status: 'Pending',
    keterangan: '',
    items: []
  });
  const [editingId, setEditingId] = useState(null);

  const columns = [
    { key: 'no', label: 'No.', width: '60px', render: (_, index) => index + 1 },
    { 
      key: 'no_faktur', 
      label: 'No. Faktur',
      render: (val) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
            <FiTruck size={16} />
          </div>
          <span className="font-medium text-gray-900">{val}</span>
        </div>
      )
    },
    { key: 'nama_supplier', label: 'Supplier' },
    { 
        key: 'tanggal', 
        label: 'Tanggal',
        render: (val) => new Date(val).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
    },
    { 
        key: 'total_nilai', 
        label: 'Total Nilai',
        render: (val) => <span className="font-bold">Rp {new Intl.NumberFormat('id-ID').format(val)}</span>
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          val === 'Received' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
          val === 'Pending' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-gray-50 text-gray-600 border border-gray-200'
        }`}>
          {val}
        </span>
      )
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      align: 'right',
      render: (_, row) => (
        <div className="flex gap-2 justify-end items-center">
            <button 
                onClick={() => handleEdit(row)}
                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            >
                <FiEdit2 size={16} />
            </button>
            <button 
                onClick={() => handleDelete(row.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
                <FiTrash2 size={16} />
            </button>
        </div>
      )
    }
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resLogs, resSuppliers, resProducts] = await Promise.all([
        axios.get('http://localhost:8080/api/master/konsinyasi'),
        axios.get('http://localhost:8080/api/master/suppliers'),
        axios.get('http://localhost:8080/api/produk')
      ]);
      setData(resLogs.data.data);
      setSuppliers(resSuppliers.data.data);
      setProducts(resProducts.data.data);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal mengambil data konsinyasi', confirmButtonColor: '#7F56D9' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = async (row) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/master/konsinyasi/${row.id}`);
      setFormData(res.data.data);
      setEditingId(row.id);
      setIsModalOpen(true);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal memuat detail konsinyasi', confirmButtonColor: '#7F56D9' });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
        title: 'Yakin hapus konsinyasi?',
        text: "Data yang dihapus tidak dapat dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/master/konsinyasi/${id}`);
          Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Konsinyasi berhasil dihapus', timer: 1500, showConfirmButton: false });
          fetchData();
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal menghapus konsinyasi', confirmButtonColor: '#7F56D9' });
        }
    }
  };

  const addItem = () => {
    setFormData({
        ...formData,
        items: [...formData.items, { produk_id: '', qty: 1, harga_beli: 0, satuan_id: '' }]
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    if (field === 'produk_id') {
        const prod = products.find(p => p.id == value);
        if (prod) {
            newItems[index].satuan_id = prod.satuan_utama_id;
            newItems[index].harga_beli = prod.harga_beli;
        }
    }
    setFormData({ ...formData, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.items.length === 0) {
        Swal.fire({ icon: 'warning', title: 'Validation', text: 'Tambahkan setidaknya satu item', confirmButtonColor: '#7F56D9' });
        return;
    }
    
    // Calculate total value
    const total_nilai = formData.items.reduce((acc, item) => acc + (item.qty * item.harga_beli), 0);
    const finalData = { ...formData, total_nilai };

    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/master/konsinyasi/${editingId}`, finalData);
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Konsinyasi berhasil diupdate', timer: 1500, showConfirmButton: false });
      } else {
        await axios.post('http://localhost:8080/api/master/konsinyasi', finalData);
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Konsinyasi berhasil disimpan', timer: 1500, showConfirmButton: false });
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({
        no_faktur: '',
        tanggal: new Date().toISOString().split('T')[0],
        supplier_id: '',
        status: 'Pending',
        keterangan: '',
        items: []
      });
      fetchData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal menyimpan konsinyasi', confirmButtonColor: '#7F56D9' });
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 p-6">
      <SectionHeader 
        title="Konsinyasi Masuk" 
        subtitle="Penerimaan stok barang konsinyasi dari supplier"
      >
          <button 
            onClick={() => {
                setEditingId(null);
                setFormData({
                    no_faktur: '',
                    tanggal: new Date().toISOString().split('T')[0],
                    supplier_id: '',
                    status: 'Pending',
                    keterangan: '',
                    items: []
                });
                setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95"
          >
             <FiPlus size={18} /> Penerimaan Baru
          </button>
      </SectionHeader>

      <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-gray-100 dark:border-[#2a2a30] p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-50 dark:border-[#2a2a30] mb-4">
          <div className="relative w-full sm:w-80">
            <input 
              type="text" 
              placeholder="Cari faktur..."
              className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-[#1a1a20] border border-gray-100 dark:border-[#2a2a30] rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
          
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-[#1a1a20] border border-gray-100 dark:border-[#2a2a30] rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 transition-all">
            <FiFilter size={16} /> Filter
          </button>
        </div>

        <DataTable 
          columns={columns} 
          data={data} 
          loading={loading}
        />
      </div>

      <ModalDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Konsinyasi' : 'Penerimaan Konsinyasi Baru'}
        width="max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">No. Faktur</label>
                <input 
                  type="text"
                  required
                  placeholder="INV/KNS/..."
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  value={formData.no_faktur}
                  onChange={(e) => setFormData({...formData, no_faktur: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Tanggal</label>
                <input 
                  type="date"
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                  value={formData.tanggal ? formData.tanggal.split(' ')[0] : ''}
                  onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Supplier</label>
                <select 
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  value={formData.supplier_id}
                  required
                  onChange={(e) => setFormData({...formData, supplier_id: e.target.value})}
                >
                  <option value="">Pilih Supplier</option>
                  {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.nama_supplier}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <FiBox className="text-primary-600" /> Item Konsinyasi
                  </h3>
                  <button 
                      type="button" 
                      onClick={addItem}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg border border-primary-200 transition-all"
                  >
                      <FiPlus /> Tambah Produk
                  </button>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {formData.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3 items-end bg-gray-50/50 p-4 rounded-xl border border-gray-200 hover:bg-white hover:shadow-sm transition-all">
                          <div className="col-span-5 space-y-1.5">
                              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-tight">Pilih Produk</label>
                              <select 
                                  className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                                  value={item.produk_id}
                                  onChange={(e) => handleItemChange(index, 'produk_id', e.target.value)}
                              >
                                  <option value="">- Pilih Produk -</option>
                                  {products.map(p => (
                                      <option key={p.id} value={p.id}>{p.nama_produk}</option>
                                  ))}
                              </select>
                          </div>
                          <div className="col-span-2 space-y-1.5">
                              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-tight">Qty</label>
                              <input 
                                  type="number"
                                  className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-center font-bold"
                                  value={item.qty}
                                  onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                              />
                          </div>
                          <div className="col-span-4 space-y-1.5">
                              <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-tight">Harga Beli (Rp)</label>
                              <input 
                                  type="number"
                                  className="w-full px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-mono font-bold text-gray-900"
                                  value={item.harga_beli}
                                  onChange={(e) => handleItemChange(index, 'harga_beli', e.target.value)}
                              />
                          </div>
                          <div className="col-span-1 text-right">
                              <button 
                                  type="button" 
                                  onClick={() => removeItem(index)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                  title="Hapus baris"
                              >
                                  <FiTrash2 size={18} />
                              </button>
                          </div>
                      </div>
                  ))}
                  {formData.items.length === 0 && (
                      <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                          <FiBox className="mx-auto text-gray-400 mb-2" size={32} />
                          <p className="text-sm text-gray-500 font-medium tracking-tight">Belum ada produk ditambahkan</p>
                          <button 
                            type="button" 
                            onClick={addItem}
                            className="mt-3 text-xs font-bold text-primary-600 hover:underline"
                          >
                            Mulai pnerimaan barang
                          </button>
                      </div>
                  )}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50/50">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-sm transition-all"
            >
              Simpan Penerimaan
            </button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
}
