import React, { useState, useEffect } from 'react';
import PageHeader from '../../../components/ui/PageHeader';
import Card from '../../../components/ui/Card';
import { FiSearch, FiRefreshCw, FiFileText, FiDollarSign, FiXCircle } from 'react-icons/fi';

const API_BASE = 'http://localhost:8080/api';

export default function PenjualanTertolak() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = (searchQ = '') => {
    setLoading(true);
    const params = new URLSearchParams({ status: 'Dibatalkan' });
    if (searchQ) params.set('search', searchQ);
    fetch(`${API_BASE}/master/penjualan?${params}`)
      .then(r => r.json())
      .then(result => { if (result.status) setData(result.data || []); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchData(search); };

  const fmt = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);
  const fmtDate = (d) => { try { return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return d; } };

  const totalNilai = data.reduce((s, r) => s + parseFloat(r.total_bayar || 0), 0);

  return (
    <div className="animate-unt-fade">
      <PageHeader
        title="Penjualan Tertolak"
        subtitle="Daftar transaksi penjualan yang ditolak atau dibatalkan."
        breadcrumbs={[{ label: 'Penjualan', path: '/penjualan' }, { label: 'Penjualan Tertolak' }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Tertolak</span>
            <FiXCircle size={14} className="text-red-500" />
          </div>
          <span className="text-xl font-extrabold text-red-600">{data.length}</span>
          <p className="text-[10px] text-gray-400 mt-1">transaksi</p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nilai Tertolak</span>
            <FiDollarSign size={14} className="text-orange-500" />
          </div>
          <span className="text-xl font-extrabold text-orange-600">{fmt(totalNilai)}</span>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Info</span>
            <FiFileText size={14} className="text-gray-400" />
          </div>
          <span className="text-sm font-bold text-gray-500">Transaksi yang dibatalkan dari Kasir</span>
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari invoice, pelanggan..."
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
                {['No.', 'Tanggal', 'No. Invoice', 'Pelanggan', 'Kasir', 'Total', 'Alasan'].map((h, i) => (
                  <th key={i} className="py-2.5 px-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="py-12 text-center text-gray-400 text-sm">Memuat data...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-gray-400 text-sm">
                  <FiXCircle className="mx-auto mb-2 text-gray-300" size={24} />
                  Tidak ada penjualan tertolak
                </td></tr>
              ) : data.map((row, i) => (
                <tr key={row.id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50 transition-all">
                  <td className="py-2.5 px-3 text-xs font-bold text-gray-400">{i + 1}</td>
                  <td className="py-2.5 px-3 text-xs text-gray-500 whitespace-nowrap">{fmtDate(row.tanggal_penjualan)}</td>
                  <td className="py-2.5 px-3 text-xs font-bold text-red-500 font-mono line-through">{row.no_invoice}</td>
                  <td className="py-2.5 px-3 text-xs font-medium text-gray-700 dark:text-gray-300">{row.nama_pelanggan || 'Umum'}</td>
                  <td className="py-2.5 px-3 text-xs text-gray-500">Admin</td>
                  <td className="py-2.5 px-3 text-xs font-bold text-red-500 tabular-nums text-right">{fmt(row.total_bayar)}</td>
                  <td className="py-2.5 px-3"><span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-500 border border-red-200">Dibatalkan</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
