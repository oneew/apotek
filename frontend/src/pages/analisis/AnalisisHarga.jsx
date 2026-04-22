import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import { FiSearch, FiDollarSign, FiTrendingUp, FiPackage } from 'react-icons/fi';

const API_BASE = 'http://localhost:8080/api';

export default function AnalisisHarga() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${API_BASE}/produk`).then(r => r.json())
      .then(result => { if (result.status) setProducts(result.data || []); })
      .catch(console.error).finally(() => setLoading(false));
  }, []);

  const fmt = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0);

  const analyzed = products.map(p => {
    const hb = parseFloat(p.harga_beli_referensi) || 0;
    const hj = parseFloat(p.harga_jual_utama) || 0;
    const margin = hb > 0 ? ((hj - hb) / hb * 100) : 0;
    const profit = hj - hb;
    let status = 'Aman';
    let statusColor = 'bg-green-50 text-green-600 border-green-200';
    if (margin < 0) { status = 'Rugi'; statusColor = 'bg-red-50 text-red-500 border-red-200'; }
    else if (margin < 10) { status = 'Margin Rendah'; statusColor = 'bg-yellow-50 text-yellow-600 border-yellow-200'; }
    else if (margin > 50) { status = 'Margin Tinggi'; statusColor = 'bg-blue-50 text-blue-600 border-blue-200'; }
    return { ...p, hb, hj, margin, profit, status, statusColor };
  }).sort((a, b) => b.margin - a.margin);

  const filtered = search ? analyzed.filter(p => p.nama_produk?.toLowerCase().includes(search.toLowerCase())) : analyzed;
  const avgMargin = analyzed.length > 0 ? analyzed.reduce((s, p) => s + p.margin, 0) / analyzed.length : 0;
  const lowMargin = analyzed.filter(p => p.margin < 10 && p.margin >= 0).length;
  const rugi = analyzed.filter(p => p.margin < 0).length;

  return (
    <div className="animate-unt-fade">
      <PageHeader title="Analisis Harga & Margin" subtitle="Evaluasi margin keuntungan per produk."
        breadcrumbs={[{ label: 'Analisis', path: '/analisis' }, { label: 'Harga & Margin' }]} />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Total Produk</span>
          <p className="text-xl font-extrabold text-purple-600">{analyzed.length}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Margin Rata-Rata</span>
          <p className="text-xl font-extrabold text-green-600">{avgMargin.toFixed(1)}%</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Margin Rendah (&lt;10%)</span>
          <p className="text-xl font-extrabold text-yellow-600">{lowMargin} produk</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Berpotensi Rugi</span>
          <p className="text-xl font-extrabold text-red-500">{rugi} produk</p>
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
              {['No.', 'Produk', 'Harga Beli', 'Harga Jual', 'Profit/Unit', 'Margin %', 'Status'].map((h, i) => (
                <th key={i} className="py-2.5 px-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="py-12 text-center text-gray-400 text-sm">Memuat data...</td></tr>
              : filtered.length === 0 ? <tr><td colSpan={7} className="py-12 text-center text-gray-400 text-sm">Tidak ada data</td></tr>
              : filtered.map((p, i) => (
                <tr key={p.id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 text-xs font-bold text-gray-400">{i+1}</td>
                  <td className="py-2.5 px-3"><div className="text-xs font-semibold text-gray-800 dark:text-gray-200">{p.nama_produk}</div><div className="text-[10px] text-gray-400">{p.sku || '-'}</div></td>
                  <td className="py-2.5 px-3 text-xs text-gray-500 tabular-nums">{fmt(p.hb)}</td>
                  <td className="py-2.5 px-3 text-xs font-bold tabular-nums">{fmt(p.hj)}</td>
                  <td className="py-2.5 px-3 text-xs font-bold tabular-nums"><span className={p.profit >= 0 ? 'text-green-600' : 'text-red-500'}>{fmt(p.profit)}</span></td>
                  <td className="py-2.5 px-3 text-xs font-bold tabular-nums"><span className={p.margin >= 20 ? 'text-green-600' : p.margin >= 10 ? 'text-blue-600' : p.margin >= 0 ? 'text-yellow-600' : 'text-red-500'}>{p.margin.toFixed(1)}%</span></td>
                  <td className="py-2.5 px-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${p.statusColor}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
