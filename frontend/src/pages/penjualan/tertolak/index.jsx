import React, { useState, useEffect } from 'react';
import SectionHeader from '../../../components/ui/SectionHeader';
import Card from '../../../components/ui/Card';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { FiSearch, FiRefreshCw, FiFileText, FiXCircle, FiTrash2, FiEdit2, FiPlus, FiAlertCircle } from 'react-icons/fi';
import DataTable from '../../../components/ui/DataTable';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:8080/api';

export default function PenjualanTertolak() {
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ produk_id: '', nama_produk_manual: '', jumlah: 1, alasan: '' });
  const [isManual, setIsManual] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = (searchQ = '') => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQ) params.set('search', searchQ);
    fetch(`${API_BASE}/master/penjualan-tertolak?${params}`)
      .then(r => r.json())
      .then(result => { if (result.status) setData(result.data || []); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const fetchProducts = () => {
    fetch(`${API_BASE}/produk`)
      .then(r => r.json())
      .then(result => { if (result.status) setProducts(result.data || []); })
      .catch(err => console.error(err));
  };

  useEffect(() => { 
    fetchData(); 
    fetchProducts();
  }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchData(search); };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditId(item.id);
      setIsManual(!!item.nama_produk_manual);
      setFormData({
        produk_id: item.produk_id || '',
        nama_produk_manual: item.nama_produk_manual || '',
        jumlah: parseInt(item.jumlah) || 1,
        alasan: item.alasan || ''
      });
    } else {
      setEditId(null);
      setIsManual(false);
      setFormData({ produk_id: '', nama_produk_manual: '', jumlah: 1, alasan: '' });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditId(null);
    setIsManual(false);
    setFormData({ produk_id: '', nama_produk_manual: '', jumlah: 1, alasan: '' });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!isManual && !formData.produk_id) {
      Swal.fire('Error', 'Pilih produk terlebih dahulu', 'error');
      return;
    }
    if (isManual && !formData.nama_produk_manual) {
      Swal.fire('Error', 'Tulis nama produk terlebih dahulu', 'error');
      return;
    }
    
    setSubmitting(true);
    const method = editId ? 'PUT' : 'POST';
    const url = editId 
      ? `${API_BASE}/master/penjualan-tertolak/${editId}` 
      : `${API_BASE}/master/penjualan-tertolak`;

    // Ensure jumlah is a number
    const payload = {
      ...formData,
      jumlah: parseInt(formData.jumlah) || 1
    };

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(res => {
      if (res.status) {
        Swal.fire('Berhasil', res.message, 'success');
        handleCloseModal();
        fetchData();
      } else {
        Swal.fire('Gagal', res.message || 'Terjadi kesalahan', 'error');
      }
    })
    .catch(err => {
      console.error(err);
      Swal.fire('Gagal', 'Terjadi kesalahan sistem', 'error');
    })
    .finally(() => setSubmitting(false));
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Hapus Log?',
      text: 'Data penolakan ini akan dihapus permanen.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Hapus!'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${API_BASE}/master/penjualan-tertolak/${id}`, { method: 'DELETE' })
          .then(r => r.json())
          .then(res => {
            if (res.status) {
              Swal.fire('Terhapus!', res.message, 'success');
              fetchData();
            } else {
              Swal.fire('Gagal', res.message, 'error');
            }
          });
      }
    });
  };

  const fmtDate = (d) => { 
    try { 
      const dt = new Date(d);
      return (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900">{dt.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          <span className="text-[10px] text-gray-400 font-medium">{dt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      );
    } catch { return d; } 
  };

  const columns = [
    {
      key: 'tanggal',
      label: 'Tanggal & Waktu',
      render: (val) => fmtDate(val)
    },
    {
      key: 'nama_produk',
      label: 'Produk Obat',
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-800">{val || row.nama_produk_manual || `ID: ${row.produk_id}`}</span>
          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">
            {row.nama_produk_manual ? 'Input Manual' : 'Master Produk'}
          </span>
        </div>
      )
    },
    {
      key: 'jumlah',
      label: 'Jumlah',
      render: (val) => <span className="font-bold text-gray-900">{val}</span>
    },
    {
      key: 'alasan',
      label: 'Alasan Penolakan',
      render: (val) => (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-50 text-red-600 text-[10px] font-bold border border-red-100 uppercase tracking-wide">
          <FiAlertCircle size={10} />
          {val}
        </span>
      )
    },
    {
      key: 'actions',
      label: '',
      align: 'right',
      render: (_, row) => (
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => handleOpenModal(row)} 
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            title="Edit Log"
          >
            <FiEdit2 size={14} />
          </button>
          <button 
            onClick={() => handleDelete(row.id)} 
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Hapus Log"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="animate-unt-fade">
      <SectionHeader
        title="Penjualan Tertolak"
        subtitle="Daftar log penolakan barang di kasir (misal: stok habis)."
      >
        <Button variant="primary" onClick={() => handleOpenModal()} iconLeft={FiPlus}>
          Tambah Data
        </Button>
      </SectionHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 border-2 border-primary-200 dark:border-primary-800/50 shadow-sm rounded-xl p-4 hover:border-primary-300 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Tertolak</span>
            <FiXCircle size={14} className="text-red-500" />
          </div>
          <span className="text-xl font-extrabold text-gray-900 dark:text-white">{data.length}</span>
          <p className="text-[10px] text-gray-400 mt-1">item ditolak</p>
        </div>
        <div className="bg-white dark:bg-gray-900 border-2 border-primary-200 dark:border-primary-800/50 shadow-sm rounded-xl p-4 hover:border-primary-300 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Info</span>
            <FiFileText size={14} className="text-purple-500" />
          </div>
          <span className="text-sm font-bold text-gray-500">Log transaksi gagal dari Kasir</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm overflow-hidden">
        <DataTable 
          columns={columns} 
          data={data} 
          isLoading={loading}
          searchQuery={search}
          onSearchChange={setSearch}
          searchPlaceholder="Cari berdasarkan nama obat atau alasan..."
        />
      </div>

      <Modal
        open={showModal}
        onClose={handleCloseModal}
        title={editId ? 'Edit Log Tertolak' : 'Tambah Log Tertolak'}
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseModal}>Batal</Button>
            <Button variant="primary" onClick={handleSubmit} loading={submitting}>
              {editId ? 'Simpan Perubahan' : 'Simpan Data'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Produk Obat <span className="text-red-500">*</span></label>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="isManual" 
                checked={isManual} 
                onChange={(e) => {
                  setIsManual(e.target.checked);
                  if (e.target.checked) setFormData({ ...formData, produk_id: '' });
                  else setFormData({ ...formData, nama_produk_manual: '' });
                }}
                className="w-3.5 h-3.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="isManual" className="text-[10px] font-bold text-primary-600 cursor-pointer">Input Manual?</label>
            </div>
          </div>

          {!isManual ? (
            <select
              value={formData.produk_id}
              onChange={(e) => setFormData({ ...formData, produk_id: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
              required
            >
              <option value="">-- Pilih Produk --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.kode_produk || ''} - {p.nama_produk}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={formData.nama_produk_manual}
              onChange={(e) => setFormData({ ...formData, nama_produk_manual: e.target.value })}
              placeholder="Tulis nama produk..."
              className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
              required
            />
          )}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Jumlah</label>
            <input
              type="number"
              min="1"
              value={formData.jumlah}
              onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Alasan Penolakan</label>
            <textarea
              value={formData.alasan}
              onChange={(e) => setFormData({ ...formData, alasan: e.target.value })}
              placeholder="Contoh: Stok Habis, Harga Terlalu Mahal, dll"
              className="w-full px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
              rows={3}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
