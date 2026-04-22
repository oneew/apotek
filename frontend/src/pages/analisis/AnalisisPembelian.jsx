import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import { FiSearch, FiDollarSign, FiTruck, FiPackage, FiTrendingDown } from 'react-icons/fi';

const API_BASE = 'http://localhost:8080/api';

export default function AnalisisPembelian() {
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/master/pembelian`).then(r => r.json()),
      fetch(`${API_BASE}/produk`).then(r => r.json()),
    ]).then(([pemRes, prodRes]) => {
      if (pemRes.status) setData(pemRes.data || []);
      if (prodRes.status) setProducts(prodRes.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const fmt = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0);
  const fmtDate = (d) => { try { return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return d; } };

  // Product analysis: compare harga beli vs harga jual
  const productAnalysis = products.map(p => {
    const hb = parseFloat(p.harga_beli_referensi) || 0;
    const hj = parseFloat(p.harga_jual_utama) || 0;
    const stok = parseInt(p.stok_total) || 0;
    return {
      id: p.id,
      nama: p.nama_produk,
      sku: p.sku || '-',
      supplier: p.nama_supplier || '-',
      hargaBeli: hb,
      hargaJual: hj,
      stok,
      nilaiPembelian: stok * hb,
      margin: hb > 0 ? ((hj - hb) / hb * 100).toFixed(1) : '0.0',
      tren: 'Stabil',
    };
  });

  const filtered = search ? productAnalysis.filter(p => p.nama.toLowerCase().includes(search.toLowerCase())) : productAnalysis;
  const totalNilaiPembelian = data.reduce((s, r) => s + parseFloat(r.total || 0), 0);
  const totalSupplier = new Set(data.map(r => r.supplier_id).filter(Boolean)).size;

  return (
    <div className="animate-unt-fade">
      <PageHeader title="Analisis Pembelian" subtitle="Evaluasi pola pembelian dan efisiensi harga beli dari supplier."
        breadcrumbs={[{ label: 'Analisis', path: '/analisis' }, { label: 'Pembelian' }]} />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Total Faktur</span>
          <p className="text-xl font-extrabold text-teal-600">{data.length}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Nilai Pembelian</span>
          <p className="text-xl font-extrabold text-blue-600">{fmt(totalNilaiPembelian)}</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Supplier Aktif</span>
          <p className="text-xl font-extrabold text-purple-600">{totalSupplier}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Total Produk</span>
          <p className="text-xl font-extrabold text-green-600">{products.length}</p>
        </div>
      </div>

      {/* Purchase History */}
      {data.length > 0 && (
        <Card className="mb-6" title="Riwayat Pembelian Terbaru">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100 dark:border-gray-800">
                {['No.', 'Tanggal', 'No. Faktur', 'Supplier', 'Status', 'Total'].map((h, i) => (
                  <th key={i} className="py-2.5 px-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {data.slice(0, 10).map((r, i) => (
                  <tr key={r.id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50">
                    <td className="py-2.5 px-3 text-xs font-bold text-gray-400">{i+1}</td>
                    <td className="py-2.5 px-3 text-xs text-gray-500">{fmtDate(r.tanggal_faktur || r.created_at)}</td>
                    <td className="py-2.5 px-3 text-xs font-bold text-primary-600 font-mono">{r.no_faktur}</td>
                    <td className="py-2.5 px-3 text-xs font-medium">{r.nama_supplier || '-'}</td>
                    <td className="py-2.5 px-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${r.status === 'Lunas' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>{r.status || 'Pending'}</span></td>
                    <td className="py-2.5 px-3 text-xs font-bold tabular-nums text-right">{fmt(r.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Product Price Analysis */}
      <Card title="Analisis Harga Beli per Produk">
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
              {['No.', 'Produk', 'Harga Beli', 'Harga Jual', 'Margin', 'Stok', 'Nilai Persediaan', 'Tren'].map((h, i) => (
                <th key={i} className="py-2.5 px-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={8} className="py-12 text-center text-gray-400 text-sm">Memuat data...</td></tr>
              : filtered.length === 0 ? <tr><td colSpan={8} className="py-12 text-center text-gray-400 text-sm">Tidak ada data</td></tr>
              : filtered.map((p, i) => (
                <tr key={p.id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 text-xs font-bold text-gray-400">{i+1}</td>
                  <td className="py-2.5 px-3"><div className="text-xs font-semibold text-gray-800 dark:text-gray-200">{p.nama}</div><div className="text-[10px] text-gray-400">{p.sku}</div></td>
                  <td className="py-2.5 px-3 text-xs text-gray-500 tabular-nums">{fmt(p.hargaBeli)}</td>
                  <td className="py-2.5 px-3 text-xs font-bold tabular-nums">{fmt(p.hargaJual)}</td>
                  <td className="py-2.5 px-3 text-xs font-bold tabular-nums"><span className={parseFloat(p.margin) >= 20 ? 'text-green-600' : parseFloat(p.margin) >= 0 ? 'text-yellow-600' : 'text-red-500'}>{p.margin}%</span></td>
                  <td className="py-2.5 px-3 text-xs font-bold tabular-nums">{p.stok}</td>
                  <td className="py-2.5 px-3 text-xs font-bold tabular-nums text-right">{fmt(p.nilaiPembelian)}</td>
                  <td className="py-2.5 px-3"><span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-50 text-gray-500 border border-gray-200">{p.tren}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
