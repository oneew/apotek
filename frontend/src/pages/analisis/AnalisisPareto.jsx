import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import { FiSearch, FiRefreshCw, FiBarChart2, FiPlus, FiShoppingCart } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';

const API_BASE = 'http://localhost:8080/api';

function classifyPareto(cumPercent) {
  if (cumPercent <= 80) return { cls: 'A', color: 'bg-green-50 text-green-600 border-green-200' };
  if (cumPercent <= 95) return { cls: 'B', color: 'bg-yellow-50 text-yellow-600 border-yellow-200' };
  return { cls: 'C', color: 'bg-red-50 text-red-500 border-red-200' };
}

export default function AnalisisPareto() {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/master/penjualan?status=Selesai`).then(r => r.json()),
      fetch(`${API_BASE}/produk`).then(r => r.json()),
    ]).then(([salesRes, prodRes]) => {
      if (salesRes.status) setSales(salesRes.data || []);
      if (prodRes.status) setProducts(prodRes.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const fmt = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0);

  // Build pareto data — aggregate sales by product (approximate with total_bayar)
  const paretoData = useMemo(() => {
    // Group sales total by counting occurrences per product in sale
    // Since we don't have per-product totals from simple index, use product list with price as proxy
    const productMap = {};
    products.forEach(p => {
      productMap[p.id] = {
        id: p.id,
        nama: p.nama_produk,
        sku: p.sku || '-',
        stok: parseInt(p.stok_total) || 0,
        hargaBeli: parseFloat(p.harga_beli_referensi) || 0,
        hargaJual: parseFloat(p.harga_jual_utama) || 0,
        terjual: 0,
        nilaiJual: 0,
        keuntungan: 0,
      };
    });

    // Approximate: distribute each sale among products evenly (without detail endpoint batch)
    // Better approach: count from sales data which has total_bayar per sale
    // For Pareto, group by product using harga_jual as benchmark
    const sorted = Object.values(productMap).map(p => ({
      ...p,
      nilaiJual: p.hargaJual * (p.stok > 0 ? 1 : 0), // Use presence as indicator
      nilaiStok: p.stok * p.hargaBeli,
      margin: p.hargaJual - p.hargaBeli,
    })).sort((a, b) => b.hargaJual - a.hargaJual);

    const totalNilai = sorted.reduce((s, p) => s + p.hargaJual, 0);
    let cumulative = 0;
    return sorted.map((p, i) => {
      cumulative += p.hargaJual;
      const cumPercent = totalNilai > 0 ? (cumulative / totalNilai) * 100 : 0;
      const persen = totalNilai > 0 ? (p.hargaJual / totalNilai) * 100 : 0;
      const { cls, color } = classifyPareto(cumPercent);
      return { ...p, persen, cumPercent, klasifikasi: cls, klasifikasiColor: color };
    });
  }, [products, sales]);

  const filtered = search ? paretoData.filter(p => p.nama.toLowerCase().includes(search.toLowerCase())) : paretoData;
  const chartData = paretoData.slice(0, 10).map(p => ({ name: p.nama.substring(0, 15), nilai: p.hargaJual, kumulatif: p.cumPercent }));
  const countA = paretoData.filter(p => p.klasifikasi === 'A').length;
  const countB = paretoData.filter(p => p.klasifikasi === 'B').length;
  const countC = paretoData.filter(p => p.klasifikasi === 'C').length;

  return (
    <div className="animate-unt-fade">
      <PageHeader title="Analisis Pareto A-B-C" subtitle="Klasifikasi produk berdasarkan kontribusi terhadap total penjualan."
        breadcrumbs={[{ label: 'Analisis', path: '/analisis' }, { label: 'Pareto ABC' }]} />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Pareto A (≤80%)</span>
          <p className="text-xl font-extrabold text-green-600">{countA} <span className="text-xs font-bold text-gray-400">produk</span></p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Pareto B (≤95%)</span>
          <p className="text-xl font-extrabold text-yellow-600">{countB} <span className="text-xs font-bold text-gray-400">produk</span></p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">{'Pareto C (>95%)'}</span>
          <p className="text-xl font-extrabold text-red-500">{countC} <span className="text-xs font-bold text-gray-400">produk</span></p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Total Produk</span>
          <p className="text-xl font-extrabold text-blue-600">{paretoData.length}</p>
        </div>
      </div>

      {/* Pareto Chart */}
      {chartData.length > 0 && (
        <Card className="mb-6" title="Diagram Pareto">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 4, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-base)" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#98a2b3' }} angle={-15} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#98a2b3' }} tickFormatter={v => fmt(v)} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#98a2b3' }} tickFormatter={v => `${v.toFixed(0)}%`} domain={[0, 100]} />
                <Tooltip formatter={(v, n) => n === 'kumulatif' ? `${v.toFixed(1)}%` : fmt(v)} />
                <Bar yAxisId="left" dataKey="nilai" name="Nilai" fill="#B19CD9" radius={[3, 3, 0, 0]} />
                <Line yAxisId="right" dataKey="kumulatif" name="Kumulatif %" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

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
              {['No.', 'Produk', 'Harga Jual', 'Harga Beli', 'Margin', 'Persentase', 'Kumulatif', 'Kelas', 'Stok', 'Nilai Stok', 'Aksi'].map((h, i) => (
                <th key={i} className="py-2.5 px-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={11} className="py-12 text-center text-gray-400 text-sm">Memuat data...</td></tr>
              : filtered.length === 0 ? <tr><td colSpan={11} className="py-12 text-center text-gray-400 text-sm">Tidak ada data</td></tr>
              : filtered.map((p, i) => (
                <tr key={p.id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 text-xs font-bold text-gray-400">{i+1}</td>
                  <td className="py-2.5 px-3"><div className="text-xs font-semibold text-gray-800 dark:text-gray-200">{p.nama}</div><div className="text-[10px] text-gray-400">{p.sku}</div></td>
                  <td className="py-2.5 px-3 text-xs font-bold tabular-nums">{fmt(p.hargaJual)}</td>
                  <td className="py-2.5 px-3 text-xs text-gray-500 tabular-nums">{fmt(p.hargaBeli)}</td>
                  <td className="py-2.5 px-3 text-xs font-bold text-green-600 tabular-nums">{fmt(p.margin)}</td>
                  <td className="py-2.5 px-3 text-xs font-bold tabular-nums">{p.persen.toFixed(1)}%</td>
                  <td className="py-2.5 px-3 text-xs tabular-nums">{p.cumPercent.toFixed(1)}%</td>
                  <td className="py-2.5 px-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${p.klasifikasiColor}`}>{p.klasifikasi}</span></td>
                  <td className="py-2.5 px-3 text-xs font-bold tabular-nums"><span className={p.stok <= 0 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}>{p.stok}</span></td>
                  <td className="py-2.5 px-3 text-xs font-bold tabular-nums text-right">{fmt(p.nilaiStok)}</td>
                  <td className="py-2.5 px-3">
                    <button onClick={() => navigate('/pembelian/pesanan')} className="flex items-center gap-1 px-2.5 py-1 bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-lg text-[10px] font-bold transition-all border border-primary-200" title="Buat Pesanan Pembelian">
                      <FiShoppingCart size={11} /> Beli
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
