import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiShuffle, FiTrendingUp, FiShoppingBag, FiPackage, FiBox, FiAlertTriangle } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import DashboardCard from '../../components/ui/DashboardCard';
import StatusCard from '../../components/ui/StatusCard';
import SectionHeader, { DateFilter } from '../../components/ui/SectionHeader';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE = 'http://localhost:8080/api';

export default function DashboardPersediaan() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [produkList, setProdukList] = useState([]);

  useEffect(() => {
    // Fetch dashboard summary
    fetch(`${API_BASE}/dashboard/summary`)
      .then(r => r.json())
      .then(result => { if (result.status) setData(result.data); })
      .catch(err => console.error('Dashboard API error:', err))
      .finally(() => setLoading(false));

    // Fetch product list for stock overview
    fetch(`${API_BASE}/produk`)
      .then(r => r.json())
      .then(result => { if (result.status) setProdukList(result.data || []); })
      .catch(err => console.error('Produk API error:', err));
  }, []);

  const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);
  const todayStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  // Build stock chart from sales_chart (approximate stock movement)
  const stockChart = data?.sales_chart?.map(d => ({
    name: d.name,
    terjual: d.total,
    transaksi: d.frekuensi,
  })) || [];

  // Calculate total stock value
  const totalNilaiStok = produkList.reduce((sum, p) => {
    const stok = parseInt(p.stok_total) || 0;
    const hargaBeli = parseFloat(p.harga_beli_referensi) || 0;
    return sum + (stok * hargaBeli);
  }, 0);

  const totalStokUnit = produkList.reduce((sum, p) => sum + (parseInt(p.stok_total) || 0), 0);

  // Categorize products by stock level
  const stokCukup = produkList.filter(p => (parseInt(p.stok_total) || 0) > 10).length;
  const stokRendah = produkList.filter(p => { const s = parseInt(p.stok_total) || 0; return s > 0 && s <= 10; }).length;
  const stokHabis = produkList.filter(p => (parseInt(p.stok_total) || 0) <= 0).length;

  // Top 5 products by stock (lowest)
  const produkStokRendahList = [...produkList]
    .filter(p => (parseInt(p.stok_total) || 0) > 0)
    .sort((a, b) => (parseInt(a.stok_total) || 0) - (parseInt(b.stok_total) || 0))
    .slice(0, 5);

  return (
    <div className="animate-unt-fade">
      <PageHeader
        title="Dashboard Persediaan"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Dashboard Persediaan' }]}
      />

      {/* ─── Ringkasan Stok ──────────────────────────────────── */}
      <SectionHeader title="Ringkasan Persediaan">
        <DateFilter value="Hari ini" dateRange={todayStr} />
      </SectionHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <DashboardCard label="Total Produk Terdaftar" value={loading ? '...' : (data?.counts?.produk || 0)}
          icon={FiPackage} iconBg="bg-blue-100 dark:bg-blue-900/30" iconColor="text-blue-600 dark:text-blue-400" />
        <DashboardCard label="Total Unit Stok" value={loading ? '...' : totalStokUnit.toLocaleString('id-ID')}
          icon={FiBox} iconBg="bg-purple-100 dark:bg-purple-900/30" iconColor="text-purple-600 dark:text-purple-400" />
        <DashboardCard label="Nilai Persediaan" value={loading ? '...' : formatCurrency(totalNilaiStok)}
          icon={FiTrendingUp} iconBg="bg-green-100 dark:bg-green-900/30" iconColor="text-green-600 dark:text-green-400" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <DashboardCard label="Stok Cukup" value={loading ? '...' : stokCukup}
          icon={FiPackage} iconBg="bg-green-100 dark:bg-green-900/30" iconColor="text-green-600 dark:text-green-400" />
        <DashboardCard label="Stok Rendah (≤10)" value={loading ? '...' : stokRendah}
          icon={FiAlertTriangle} iconBg="bg-orange-100 dark:bg-orange-900/30" iconColor="text-orange-500 dark:text-orange-400" />
        <DashboardCard label="Stok Habis" value={loading ? '...' : stokHabis}
          icon={FiRefreshCw} iconBg="bg-red-100 dark:bg-red-900/30" iconColor="text-red-500 dark:text-red-400" />
      </div>

      {/* ─── Chart & Produk Stok Rendah ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card title="Tren Penjualan 7 Hari (Nilai)">
          <div className="flex items-center gap-2 mb-3 text-xs text-gray-500 dark:text-gray-400 font-medium">
            <span className="w-3 h-3 rounded-sm bg-primary-400 inline-block" />
            Total Nilai Penjualan
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stockChart} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="persGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B19CD9" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#B19CD9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-base)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#98a2b3' }} />
                <YAxis tick={{ fontSize: 10, fill: '#98a2b3' }} tickFormatter={v => formatCurrency(v)} />
                <Tooltip formatter={(val) => formatCurrency(val)} />
                <Area type="monotone" dataKey="terjual" name="Terjual" stroke="#B19CD9" fill="url(#persGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="5 Produk Stok Terendah">
          {produkStokRendahList.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">Data stok tidak tersedia</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    {['No.', 'Produk', 'Stok', 'Satuan'].map((h, i) => (
                      <th key={i} className="py-2 px-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {produkStokRendahList.map((p, i) => {
                    const stok = parseInt(p.stok_total) || 0;
                    return (
                      <tr key={p.id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50">
                        <td className="py-2.5 px-3 text-xs font-bold text-gray-400">{i + 1}</td>
                        <td className="py-2.5 px-3">
                          <div className="text-xs font-semibold text-gray-900 dark:text-white">{p.nama_produk}</div>
                          <div className="text-[10px] text-gray-400">{p.sku || '-'}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`text-xs font-bold ${stok <= 5 ? 'text-red-500' : 'text-amber-500'}`}>{stok}</span>
                        </td>
                        <td className="py-2.5 px-3 text-xs text-gray-500">{p.nama_satuan || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* ─── Status Persediaan ─────────────────────────────── */}
      <SectionHeader title="Peringatan Persediaan" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard title="Stok Rendah"      value={loading ? 0 : (data?.stock?.rendah || 0)} unit="produk" color="orange" />
        <StatusCard title="Stok Habis"       value={loading ? 0 : (data?.stock?.habis || 0)} unit="produk" color="red" />
        <StatusCard title="Dekat Kadaluarsa" value={loading ? 0 : (data?.stock?.dekat_expired || 0)} unit="batch" color="purple" />
        <StatusCard title="Sudah Kadaluarsa" value={loading ? 0 : (data?.stock?.sudah_expired || 0)} unit="batch" color="red" />
      </div>
    </div>
  );
}
