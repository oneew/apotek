import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import { FiSearch, FiRefreshCw, FiPackage, FiAlertTriangle, FiBox } from 'react-icons/fi';

const API_BASE = 'http://localhost:8080/api';

export default function LaporanPersediaan() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dashData, setDashData] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/produk`).then(r => r.json()),
      fetch(`${API_BASE}/dashboard/summary`).then(r => r.json()),
    ]).then(([prodRes, dashRes]) => {
      if (prodRes.status) setProducts(prodRes.data || []);
      if (dashRes.status) setDashData(dashRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const fmt = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0);

  const filtered = search ? products.filter(p => p.nama_produk?.toLowerCase().includes(search.toLowerCase())) : products;
  const totalUnit = filtered.reduce((s, p) => s + (parseInt(p.stok_total) || 0), 0);
  const totalNilai = filtered.reduce((s, p) => s + ((parseInt(p.stok_total) || 0) * (parseFloat(p.harga_beli_referensi) || 0)), 0);

  return (
    <div className="animate-unt-fade">
      <PageHeader title="Laporan Persediaan" subtitle="Status stok produk dan peringatan persediaan."
        breadcrumbs={[{ label: 'Laporan', path: '/laporan' }, { label: 'Persediaan' }]} />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-gray-400 uppercase">Total Produk</span><FiPackage size={14} className="text-blue-500" /></div>
          <span className="text-xl font-extrabold text-blue-600">{filtered.length}</span>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-gray-400 uppercase">Total Unit</span><FiBox size={14} className="text-green-500" /></div>
          <span className="text-xl font-extrabold text-green-600">{totalUnit.toLocaleString('id-ID')}</span>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-gray-400 uppercase">Nilai Stok</span></div>
          <span className="text-xl font-extrabold text-purple-600">{fmt(totalNilai)}</span>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-gray-400 uppercase">Peringatan</span><FiAlertTriangle size={14} className="text-red-500" /></div>
          <span className="text-xl font-extrabold text-red-600">{dashData?.stock?.habis || 0} habis</span>
          <p className="text-[10px] text-gray-400">{dashData?.stock?.dekat_expired || 0} dekat expired</p>
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari produk..."
              className="pl-9 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 dark:border-gray-800">
              {['No.', 'Nama Produk', 'SKU', 'Kategori', 'Satuan', 'Stok', 'Harga Beli', 'Nilai Stok', 'Status'].map((h, i) => (
                <th key={i} className="py-2.5 px-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={9} className="py-12 text-center text-gray-400 text-sm">Memuat data...</td></tr>
              : filtered.length === 0 ? <tr><td colSpan={9} className="py-12 text-center text-gray-400 text-sm">Tidak ada data</td></tr>
              : filtered.map((p, i) => {
                const stok = parseInt(p.stok_total) || 0;
                const hb = parseFloat(p.harga_beli_referensi) || 0;
                return (
                  <tr key={p.id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50">
                    <td className="py-2.5 px-3 text-xs font-bold text-gray-400">{i+1}</td>
                    <td className="py-2.5 px-3 text-xs font-semibold text-gray-800 dark:text-gray-200">{p.nama_produk}</td>
                    <td className="py-2.5 px-3 text-xs text-gray-400 font-mono">{p.sku || '-'}</td>
                    <td className="py-2.5 px-3 text-xs text-gray-500">{p.nama_kategori || '-'}</td>
                    <td className="py-2.5 px-3 text-xs text-gray-500">{p.nama_satuan || '-'}</td>
                    <td className="py-2.5 px-3 text-xs font-bold tabular-nums"><span className={stok <= 0 ? 'text-red-500' : stok <= 10 ? 'text-amber-500' : 'text-green-600'}>{stok}</span></td>
                    <td className="py-2.5 px-3 text-xs text-gray-500 tabular-nums">{fmt(hb)}</td>
                    <td className="py-2.5 px-3 text-xs font-bold tabular-nums text-right">{fmt(stok * hb)}</td>
                    <td className="py-2.5 px-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${stok <= 0 ? 'bg-red-50 text-red-500' : stok <= 10 ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>{stok <= 0 ? 'Habis' : stok <= 10 ? 'Rendah' : 'Aman'}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
