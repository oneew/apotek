import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import { FiSearch, FiRefreshCw, FiDollarSign, FiFileText, FiTruck } from 'react-icons/fi';

const API_BASE = 'http://localhost:8080/api';

export default function LaporanPembelian() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = (q = '') => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('search', q);
    fetch(`${API_BASE}/master/pembelian?${params}`)
      .then(r => r.json())
      .then(result => { if (result.status) setData(result.data || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchData(); }, []);

  const fmt = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0);
  const fmtDate = (d) => { try { return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return d; } };
  const totalNilai = data.reduce((s, r) => s + parseFloat(r.total || 0), 0);

  return (
    <div className="animate-unt-fade">
      <PageHeader title="Laporan Pembelian" subtitle="Ringkasan transaksi pembelian dari supplier."
        breadcrumbs={[{ label: 'Laporan', path: '/laporan' }, { label: 'Pembelian' }]} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Faktur</span><FiFileText size={14} className="text-teal-500" /></div>
          <span className="text-xl font-extrabold text-teal-600">{data.length}</span>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nilai Pembelian</span><FiDollarSign size={14} className="text-blue-500" /></div>
          <span className="text-xl font-extrabold text-blue-600">{fmt(totalNilai)}</span>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Supplier</span><FiTruck size={14} className="text-purple-500" /></div>
          <span className="text-xl font-extrabold text-purple-600">{new Set(data.map(r => r.supplier_id)).size}</span>
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <form onSubmit={e => { e.preventDefault(); fetchData(search); }} className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari faktur, supplier..."
              className="pl-9 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all" />
          </form>
          <button onClick={() => fetchData(search)} className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg border border-gray-200 dark:border-gray-800"><FiRefreshCw size={14} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 dark:border-gray-800">
              {['No.', 'Tanggal', 'No. Faktur', 'Supplier', 'Status', 'Total'].map((h, i) => (
                <th key={i} className="py-2.5 px-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">Memuat data...</td></tr>
              : data.length === 0 ? <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">Tidak ada data pembelian</td></tr>
              : data.map((r, i) => (
                <tr key={r.id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 text-xs font-bold text-gray-400">{i+1}</td>
                  <td className="py-2.5 px-3 text-xs text-gray-500 whitespace-nowrap">{fmtDate(r.tanggal_faktur || r.created_at)}</td>
                  <td className="py-2.5 px-3 text-xs font-bold text-primary-600 font-mono">{r.no_faktur}</td>
                  <td className="py-2.5 px-3 text-xs font-medium text-gray-700 dark:text-gray-300">{r.nama_supplier || '-'}</td>
                  <td className="py-2.5 px-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${r.status === 'Lunas' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>{r.status || 'Pending'}</span></td>
                  <td className="py-2.5 px-3 text-xs font-bold text-gray-900 dark:text-white tabular-nums text-right">{fmt(r.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-6 bg-teal-50 dark:bg-teal-900/10 border border-teal-100 dark:border-teal-800 rounded-xl p-5">
        <h4 className="text-xs font-bold text-teal-700 dark:text-teal-400 mb-3 uppercase tracking-wider">Rekapitulasi Pembelian</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">Total Faktur</span><p className="font-extrabold text-gray-900 dark:text-white">{data.length} faktur</p></div>
          <div><span className="text-gray-500">Total Nilai Pembelian</span><p className="font-extrabold text-teal-600">{fmt(totalNilai)}</p></div>
        </div>
      </div>
    </div>
  );
}
