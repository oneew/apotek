import React, { useState, useEffect } from 'react';
import { FiInfo, FiDollarSign, FiTrendingUp, FiTrendingDown, FiShoppingCart, FiTruck, FiCreditCard } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import DashboardCard from '../../components/ui/DashboardCard';
import LinkCard from '../../components/ui/LinkCard';
import SectionHeader, { DateFilter } from '../../components/ui/SectionHeader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE = 'http://localhost:8080/api';

function RatioCard({ title, value, icon: Icon = FiInfo, color = 'text-gray-900' }) {
  return (
    <div className="bg-white dark:bg-[#1e1e24] border border-gray-200 dark:border-[#2a2a30] rounded-2xl p-5 hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{title}</p>
        <Icon className="text-gray-400 w-4 h-4 shrink-0" />
      </div>
      <p className={`text-2xl font-extrabold ${color} dark:text-white tracking-tight`}>{value}</p>
    </div>
  );
}

export default function DashboardKeuangan() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/dashboard/summary`)
      .then(r => r.json())
      .then(result => { if (result.status) setData(result.data); })
      .catch(err => console.error('Dashboard API error:', err))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);

  const todayStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  const yearStart = `1 Jan ${new Date().getFullYear()}`;

  // Build chart from sales data (pemasukan = sales, pengeluaran = purchases)
  const chartData = data?.sales_chart?.map(d => ({
    name: d.name,
    pemasukan: d.total,
    pengeluaran: 0, // No daily purchase data available yet
    cashflow: d.total,
  })) || [{ name: '', pemasukan: 0, pengeluaran: 0, cashflow: 0 }];

  // Calculate financial ratios from available data
  const totalPemasukan = data?.sales?.month_total || 0;
  const totalPembelian = data?.purchases?.month_total || 0;
  const labaBruto = totalPemasukan - totalPembelian;
  const rasioLabaBruto = totalPemasukan > 0 ? ((labaBruto / totalPemasukan) * 100).toFixed(1) : '0,0';

  return (
    <div className="animate-unt-fade">
      <PageHeader
        title="Dashboard Keuangan"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Dashboard Keuangan' }]}
      />

      {/* ─── Ringkasan Keuangan ──────────────────────────────── */}
      <SectionHeader title="Ringkasan Keuangan Bulanan">
        <DateFilter value="Bulan ini" dateRange={todayStr} />
      </SectionHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <RatioCard title="Total Pemasukan (Penjualan)" value={loading ? '...' : formatCurrency(totalPemasukan)}
          icon={FiTrendingUp} color="text-green-600" />
        <RatioCard title="Total Pengeluaran (Pembelian)" value={loading ? '...' : formatCurrency(totalPembelian)}
          icon={FiTrendingDown} color="text-red-500" />
        <RatioCard title="Laba Kotor Estimasi" value={loading ? '...' : formatCurrency(labaBruto)}
          icon={FiDollarSign} color={labaBruto >= 0 ? 'text-green-600' : 'text-red-500'} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <RatioCard title="Jumlah Transaksi" value={loading ? '...' : `${data?.sales?.month_count || 0} trx`}
          icon={FiShoppingCart} color="text-blue-600" />
        <RatioCard title="Rata-Rata per Transaksi" value={loading ? '...' : formatCurrency(data?.sales?.month_count > 0 ? totalPemasukan / data.sales.month_count : 0)}
          icon={FiDollarSign} color="text-purple-600" />
        <RatioCard title="Rasio Laba Kotor" value={loading ? '...' : `${rasioLabaBruto}%`}
          icon={FiInfo} color="text-teal-600" />
      </div>

      {/* ─── Info Cards ──────────────────────────────────────── */}
      <SectionHeader title="Status Keuangan" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <DashboardCard label="Database Pelanggan" value={loading ? '...' : (data?.counts?.pelanggan || 0)}
          icon={FiShoppingCart} iconBg="bg-teal-100 dark:bg-teal-900/30" iconColor="text-teal-600 dark:text-teal-400" />
        <DashboardCard label="Database Supplier" value={loading ? '...' : (data?.counts?.supplier || 0)}
          icon={FiTruck} iconBg="bg-red-100 dark:bg-red-900/30" iconColor="text-red-500 dark:text-red-400" />
        <DashboardCard label="Database Produk" value={loading ? '...' : (data?.counts?.produk || 0)}
          icon={FiCreditCard} iconBg="bg-blue-100 dark:bg-blue-900/30" iconColor="text-blue-600 dark:text-blue-400" />
      </div>

      {/* ─── Charts ──────────────────────────────────────────── */}
      <SectionHeader title="Grafik Arus Kas 7 Hari Terakhir" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Pemasukan vs Pengeluaran">
          <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-green-400 inline-block" />Pemasukan</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-300 inline-block" />Pengeluaran</span>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-base)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#98a2b3' }} />
                <YAxis tick={{ fontSize: 10, fill: '#98a2b3' }} tickFormatter={v => formatCurrency(v)} />
                <Tooltip formatter={(val) => formatCurrency(val)} />
                <Bar dataKey="pemasukan" name="Pemasukan" fill="#4ade80" radius={[3, 3, 0, 0]} />
                <Bar dataKey="pengeluaran" name="Pengeluaran" fill="#fca5a5" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Net Cashflow">
          <div className="flex items-center gap-2 mb-4 text-xs text-gray-500 font-medium">
            <span className="w-3 h-3 rounded-sm bg-primary-400 inline-block" />Net Cashflow
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-base)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#98a2b3' }} />
                <YAxis tick={{ fontSize: 10, fill: '#98a2b3' }} tickFormatter={v => formatCurrency(v)} />
                <Tooltip formatter={(val) => formatCurrency(val)} />
                <Bar dataKey="cashflow" name="Net Cashflow" fill="#B19CD9" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ─── Recent Transactions ─────────────────────────────── */}
      {data?.recent_sales && data.recent_sales.length > 0 && (
        <>
          <SectionHeader title="Transaksi Penjualan Terbaru" />
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800">
                    {['No.', 'Invoice', 'Tanggal', 'Total', 'Status'].map((h, i) => (
                      <th key={i} className="py-2 px-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.recent_sales.map((sale, i) => (
                    <tr key={i} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50">
                      <td className="py-2.5 px-3 text-xs font-bold text-gray-400">{i + 1}</td>
                      <td className="py-2.5 px-3 text-xs font-bold text-primary-600 font-mono">{sale.no_invoice}</td>
                      <td className="py-2.5 px-3 text-xs text-gray-500">{new Date(sale.tanggal_penjualan || sale.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="py-2.5 px-3 text-xs font-bold text-gray-900 dark:text-white tabular-nums">{formatCurrency(sale.total_bayar)}</td>
                      <td className="py-2.5 px-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sale.status_penjualan === 'Selesai' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>{sale.status_penjualan}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
