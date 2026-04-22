import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import { FiSearch, FiRefreshCw, FiDownload, FiDollarSign, FiFileText, FiTrendingUp } from 'react-icons/fi';

const API_BASE = 'http://localhost:8080/api';

export default function LaporanPenjualan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [summary, setSummary] = useState({ total_records: 0, total_nilai: 0 });

  const fetchData = (q = '') => {
    setLoading(true);
    const params = new URLSearchParams({ status: 'Selesai' });
    if (q) params.set('search', q);
    fetch(`${API_BASE}/master/penjualan?${params}`)
      .then(r => r.json())
      .then(result => {
        if (result.status) { setData(result.data || []); setSummary(result.summary || {}); }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, []);

  const fmt = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0);
  const fmtDate = (d) => { try { return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return d; } };

  return (
    <div className="animate-unt-fade">
      <PageHeader title="Laporan Penjualan" subtitle="Ringkasan transaksi penjualan berdasarkan periode."
        breadcrumbs={[{ label: 'Laporan', path: '/laporan' }, { label: 'Penjualan' }]} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Transaksi</span><FiFileText size={14} className="text-green-500" /></div>
          <span className="text-xl font-extrabold text-green-600">{summary.total_records}</span>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Nilai</span><FiDollarSign size={14} className="text-blue-500" /></div>
          <span className="text-xl font-extrabold text-blue-600">{fmt(summary.total_nilai)}</span>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rata-Rata / Trx</span><FiTrendingUp size={14} className="text-purple-500" /></div>
          <span className="text-xl font-extrabold text-purple-600">{fmt(summary.total_records > 0 ? summary.total_nilai / summary.total_records : 0)}</span>
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <form onSubmit={e => { e.preventDefault(); fetchData(search); }} className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari invoice, pelanggan..."
              className="pl-9 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all" />
          </form>
          <button onClick={() => fetchData(search)} className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg border border-gray-200 dark:border-gray-800"><FiRefreshCw size={14} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 dark:border-gray-800">
              {['No.', 'Tanggal', 'No. Invoice', 'Pelanggan', 'Pembayaran', 'Total'].map((h, i) => (
                <th key={i} className="py-2.5 px-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">Memuat data...</td></tr>
              : data.length === 0 ? <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">Tidak ada data</td></tr>
              : data.map((r, i) => (
                <tr key={r.id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 text-xs font-bold text-gray-400">{i+1}</td>
                  <td className="py-2.5 px-3 text-xs text-gray-500 whitespace-nowrap">{fmtDate(r.tanggal_penjualan)}</td>
                  <td className="py-2.5 px-3 text-xs font-bold text-primary-600 font-mono">{r.no_invoice}</td>
                  <td className="py-2.5 px-3 text-xs font-medium text-gray-700 dark:text-gray-300">{r.nama_pelanggan || 'Umum'}</td>
                  <td className="py-2.5 px-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${r.jenis_pembayaran === 'Tunai' ? 'bg-green-50 text-green-600' : 'bg-teal-50 text-teal-600'}`}>{r.jenis_pembayaran}</span></td>
                  <td className="py-2.5 px-3 text-xs font-bold text-gray-900 dark:text-white tabular-nums text-right">{fmt(r.total_bayar)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-6 bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800 rounded-xl p-5">
        <h4 className="text-xs font-bold text-primary-700 dark:text-primary-400 mb-3 uppercase tracking-wider">Rekapitulasi Penjualan</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Total Transaksi</span><p className="font-extrabold text-gray-900 dark:text-white">{summary.total_records} transaksi</p></div>
          <div><span className="text-gray-500">Total Nilai Penjualan</span><p className="font-extrabold text-primary-600">{fmt(summary.total_nilai)}</p></div>
        </div>
      </div>
    </div>
  );
}
