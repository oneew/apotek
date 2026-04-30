import React, { useState, useEffect } from 'react';
import PageHeader from '../../../components/ui/PageHeader';
import Card from '../../../components/ui/Card';
import { FiSearch, FiRefreshCw, FiFileText, FiXCircle, FiTrash2 } from 'react-icons/fi';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:8080/api';

export default function PenjualanTertolak() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  useEffect(() => { fetchData(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchData(search); };

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

  const fmtDate = (d) => { try { return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return d; } };

  return (
    <div className="animate-unt-fade">
      <PageHeader
        title="Penjualan Tertolak"
        subtitle="Daftar log penolakan barang di kasir (misal: stok habis)."
        breadcrumbs={[{ label: 'Penjualan', path: '/penjualan' }, { label: 'Penjualan Tertolak' }]}
      />

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

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama obat..."
              className="pl-9 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all" />
          </form>
          <button onClick={() => fetchData(search)} className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg border border-gray-200 dark:border-gray-800 transition-all">
            <FiRefreshCw size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                {['No.', 'Tanggal', 'Nama Obat', 'Jumlah', 'Alasan', 'Aksi'].map((h, i) => (
                  <th key={i} className="py-2.5 px-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">Memuat data...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                  <FiXCircle className="mx-auto mb-2 text-gray-300" size={24} />
                  Tidak ada data penjualan tertolak
                </td></tr>
              ) : data.map((row, i) => (
                <tr key={row.id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50 transition-all">
                  <td className="py-2.5 px-3 text-xs font-bold text-gray-400">{i + 1}</td>
                  <td className="py-2.5 px-3 text-xs text-gray-500 whitespace-nowrap">{fmtDate(row.tanggal)}</td>
                  <td className="py-2.5 px-3 text-xs font-medium text-gray-700 dark:text-gray-300">{row.nama_produk || `ID: ${row.produk_id}`}</td>
                  <td className="py-2.5 px-3 text-xs font-bold text-gray-900 dark:text-gray-100">{row.jumlah}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">
                      {row.alasan}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <button onClick={() => handleDelete(row.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Hapus Log">
                      <FiTrash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
