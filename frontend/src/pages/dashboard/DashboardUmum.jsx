import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiRotateCcw, FiXCircle, FiUsers, FiTruck, FiPackage, FiUserCheck, FiAlertTriangle } from 'react-icons/fi';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import DashboardCard from '../../components/ui/DashboardCard';
import StatusCard from '../../components/ui/StatusCard';
import SectionHeader, { DateFilter } from '../../components/ui/SectionHeader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE = 'http://localhost:8080/api';

export default function DashboardUmum() {
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

  const salesChart = data?.sales_chart || Array.from({ length: 7 }, (_, i) => ({ name: `${i+1}`, total: 0, frekuensi: 0 }));

  const todayStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="animate-unt-fade space-y-0">
      <PageHeader
        title="Dashboard Umum"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Dashboard Umum' }]}
      />

      {/* ─── Ringkasan Penjualan ─────────────────────────────── */}
      <SectionHeader title="Ringkasan Penjualan">
        <DateFilter value="Hari ini" dateRange={todayStr} />
      </SectionHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <DashboardCard
          label="Total Penjualan Hari Ini"
          value={loading ? '...' : formatCurrency(data?.sales?.today_total)}
          icon={FiDollarSign}
          iconBg="bg-green-100 dark:bg-green-900/30"
          iconColor="text-green-600 dark:text-green-400"
        />
        <DashboardCard
          label="Transaksi Hari Ini"
          value={loading ? '...' : `${data?.sales?.today_count || 0} trx`}
          icon={FiDollarSign}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <DashboardCard
          label="Penjualan Bulan Ini"
          value={loading ? '...' : formatCurrency(data?.sales?.month_total)}
          icon={FiDollarSign}
          iconBg="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* ─── Chart Penjualan 7 Hari ──────────────────────────── */}
      <SectionHeader title="Tren Penjualan 7 Hari Terakhir" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card title="Nilai Penjualan">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-base)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#98a2b3' }} />
                <YAxis tick={{ fontSize: 10, fill: '#98a2b3' }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(val) => formatCurrency(val)} />
                <Bar dataKey="total" name="Penjualan" fill="#B19CD9" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Frekuensi Transaksi">
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-base)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#98a2b3' }} />
                <YAxis tick={{ fontSize: 10, fill: '#98a2b3' }} />
                <Tooltip />
                <Bar dataKey="frekuensi" name="Transaksi" fill="#60a5fa" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ─── Database Apotek ─────────────────────────────────── */}
      <SectionHeader title="Database Apotek" />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <DashboardCard
          label="Database Pelanggan"
          value={loading ? '...' : (data?.counts?.pelanggan || 0)}
          icon={FiUsers}
          iconBg="bg-teal-100 dark:bg-teal-900/30"
          iconColor="text-teal-600 dark:text-teal-400"
        />
        <DashboardCard
          label="Database Supplier"
          value={loading ? '...' : (data?.counts?.supplier || 0)}
          icon={FiTruck}
          iconBg="bg-red-100 dark:bg-red-900/30"
          iconColor="text-red-500 dark:text-red-400"
        />
        <DashboardCard
          label="Database Produk"
          value={loading ? '...' : (data?.counts?.produk || 0)}
          icon={FiPackage}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
        />
        <DashboardCard
          label="Database Dokter"
          value={loading ? '...' : (data?.counts?.dokter || 0)}
          icon={FiUserCheck}
          iconBg="bg-purple-100 dark:bg-purple-900/30"
          iconColor="text-purple-600 dark:text-purple-400"
        />
      </div>

      {/* ─── Status Persediaan ───────────────────────────────── */}
      <SectionHeader title="Status Persediaan" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Stok Rendah"
          value={loading ? 0 : (data?.stock?.rendah || 0)}
          unit="produk"
          color="orange"
        />
        <StatusCard
          title="Stok Habis"
          value={loading ? 0 : (data?.stock?.habis || 0)}
          unit="produk"
          color="red"
        />
        <StatusCard
          title="Dekat Kadaluarsa"
          value={loading ? 0 : (data?.stock?.dekat_expired || 0)}
          unit="batch"
          color="purple"
        />
        <StatusCard
          title="Sudah Kadaluarsa"
          value={loading ? 0 : (data?.stock?.sudah_expired || 0)}
          unit="batch"
          color="red"
        />
      </div>
    </div>
  );
}
