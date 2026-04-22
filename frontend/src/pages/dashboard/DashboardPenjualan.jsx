import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiRotateCcw, FiXCircle, FiTrendingUp } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import DashboardCard from '../../components/ui/DashboardCard';
import LinkCard from '../../components/ui/LinkCard';
import SectionHeader, { DateFilter } from '../../components/ui/SectionHeader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE = 'http://localhost:8080/api';

export default function DashboardPenjualan() {
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
  const salesChart = data?.sales_chart || [{ name: todayStr, total: 0, frekuensi: 0 }];

  return (
    <div className="animate-unt-fade">
      <PageHeader
        title="Dashboard Penjualan"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Dashboard Penjualan' }]}
      />

      {/* ─── Riwayat Penjualan ───────────────────────────────── */}
      <SectionHeader title="Riwayat Penjualan">
        <DateFilter value="Hari ini" dateRange={todayStr} />
      </SectionHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <DashboardCard label="Total Penjualan" value={loading ? '...' : formatCurrency(data?.sales?.today_total)}
          icon={FiDollarSign} iconBg="bg-green-100 dark:bg-green-900/30" iconColor="text-green-600 dark:text-green-400" />
        <DashboardCard label="Jumlah Transaksi" value={loading ? '...' : `${data?.sales?.today_count || 0} trx`}
          icon={FiRotateCcw} iconBg="bg-orange-100 dark:bg-orange-900/30" iconColor="text-orange-500 dark:text-orange-400" />
        <DashboardCard label="Penjualan Bulan Ini" value={loading ? '...' : formatCurrency(data?.sales?.month_total)}
          icon={FiTrendingUp} iconBg="bg-blue-100 dark:bg-blue-900/30" iconColor="text-blue-600 dark:text-blue-400" />
      </div>

      {/* ─── Chart ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <Card title="Tren Penjualan 7 Hari Terakhir">
            <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400 font-medium">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-green-400 inline-block" />Nilai Penjualan</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-400 inline-block" />Frek. Transaksi</span>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesChart} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-base)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#98a2b3' }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#98a2b3' }} tickFormatter={v => formatCurrency(v)} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#98a2b3' }} tickFormatter={v => `${v}x`} />
                  <Tooltip formatter={(val, name) => name === 'total' ? formatCurrency(val) : `${val}x`} />
                  <Bar yAxisId="left" dataKey="total" name="Penjualan" fill="#4ade80" radius={[3, 3, 0, 0]} />
                  <Bar yAxisId="right" dataKey="frekuensi" name="Frekuensi" fill="#60a5fa" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <DashboardCard label="Total Transaksi Bulan Ini" value={loading ? '...' : `${data?.sales?.month_count || 0} trx`}
            icon={FiTrendingUp} iconBg="bg-blue-100 dark:bg-blue-900/30" iconColor="text-blue-600 dark:text-blue-400" />
          <LinkCard title="Penjualan Per User" color="blue" />
        </div>
      </div>

      {/* ─── Recent Transactions Table ────────────────────────── */}
      <SectionHeader title="Transaksi Terakhir" />
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
              {!data || data.recent_sales.length === 0 ? (
                <tr><td colSpan={5} className="py-8 text-center text-sm text-gray-400 font-medium">Belum ada transaksi</td></tr>
              ) : data.recent_sales.map((sale, i) => (
                <tr key={i} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50 transition-all">
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
    </div>
  );
}
