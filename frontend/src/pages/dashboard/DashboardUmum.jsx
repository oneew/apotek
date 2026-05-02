import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDollarSign, FiRotateCcw, FiXCircle, FiUsers, FiTruck, FiPackage, FiUserCheck, FiAlertTriangle, FiActivity, FiShield, FiLink } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import DashboardCard from '../../components/ui/DashboardCard';
import StatusCard from '../../components/ui/StatusCard';
import SectionHeader, { DateFilter } from '../../components/ui/SectionHeader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE = 'http://localhost:8080/api';

export default function DashboardUmum() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/dashboard/summary`)
      .then(r => r.json())
      .then(result => { if (result.status) setData(result.data); })
      .catch(err => console.error('Dashboard API error:', err))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);

  const salesChart = data?.sales_chart || Array.from({ length: 7 }, (_, i) => ({ name: `${i + 1}`, total: 0, frekuensi: 0 }));

  const todayStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="animate-unt-fade space-y-0 pb-12">
      <SectionHeader title="Dashboard Umum" />

      {/* ─── SATUSEHAT Integration Status (Strategic Priority) ────── */}
      <div className="mb-6">
        <Card className="bg-gradient-to-r from-primary-600 to-primary-800 border-none shadow-lg overflow-hidden relative group cursor-pointer" onClick={() => navigate('/manajemen-pengguna/satusehat')}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 p-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white shadow-inner">
                <FiLink size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white tracking-tight uppercase">SATUSEHAT Bridge Status</h3>
                <p className="text-primary-100 text-xs font-bold uppercase tracking-widest opacity-80">RME Synchronization Engine</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-success-500/20 text-success-50 border border-success-400/30 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 bg-success-400 rounded-full animate-pulse" /> Connected
              </span>
              <button className="px-5 py-2 bg-white text-primary-700 font-black text-xs rounded-lg shadow-xl hover:bg-primary-50 transition-all uppercase tracking-tighter">
                Manage Bridge
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* ─── Ringkasan Penjualan ─────────────────────────────── */}
      <SectionHeader title="Ringkasan Penjualan">
        <DateFilter value="Hari ini" dateRange={todayStr} />
      </SectionHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <DashboardCard
          label="Total Penjualan Hari Ini"
          value={loading ? '...' : formatCurrency(data?.sales?.today_total)}
          icon={FiDollarSign}
          iconBg="bg-primary-100 dark:bg-primary-900/30"
          iconColor="text-primary-600 dark:text-primary-400"
          className="cursor-pointer hover:ring-2 hover:ring-primary-500/20 transition-all"
          onClick={() => navigate('/penjualan/daftar')}
        />
        <DashboardCard
          label="Transaksi Hari Ini"
          value={loading ? '...' : `${data?.sales?.today_count || 0} trx`}
          icon={FiActivity}
          iconBg="bg-primary-100 dark:bg-primary-900/30"
          iconColor="text-primary-600 dark:text-primary-400"
          className="cursor-pointer hover:ring-2 hover:ring-primary-500/20 transition-all"
          onClick={() => navigate('/penjualan/daftar')}
        />
        <DashboardCard
          label="Penjualan Bulan Ini"
          value={loading ? '...' : formatCurrency(data?.sales?.month_total)}
          icon={FiDollarSign}
          iconBg="bg-primary-100 dark:bg-primary-900/30"
          iconColor="text-primary-600 dark:text-primary-400"
          className="cursor-pointer hover:ring-2 hover:ring-primary-500/20 transition-all"
          onClick={() => navigate('/penjualan/daftar')}
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
                <YAxis tick={{ fontSize: 10, fill: '#98a2b3' }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(val) => formatCurrency(val)} />
                <Bar dataKey="total" name="Penjualan" fill="#7F56D9" radius={[3, 3, 0, 0]} />
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
                <Bar dataKey="frekuensi" name="Transaksi" fill="#7F56D9" radius={[3, 3, 0, 0]} />
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
          iconBg="bg-primary-50 dark:bg-primary-900/30"
          iconColor="text-primary-600 dark:text-primary-400"
          onClick={() => navigate('/kontak/pelanggan')}
        />
        <DashboardCard
          label="Database Supplier"
          value={loading ? '...' : (data?.counts?.supplier || 0)}
          icon={FiTruck}
          iconBg="bg-primary-50 dark:bg-primary-900/30"
          iconColor="text-primary-600 dark:text-primary-400"
          onClick={() => navigate('/kontak/supplier')}
        />
        <DashboardCard
          label="Database Produk"
          value={loading ? '...' : (data?.counts?.produk || 0)}
          icon={FiPackage}
          iconBg="bg-primary-50 dark:bg-primary-900/30"
          iconColor="text-primary-600 dark:text-primary-400"
          onClick={() => navigate('/master/produk')}
        />
        <DashboardCard
          label="Database Dokter"
          value={loading ? '...' : (data?.counts?.dokter || 0)}
          icon={FiUserCheck}
          iconBg="bg-primary-50 dark:bg-primary-900/30"
          iconColor="text-primary-600 dark:text-primary-400"
          onClick={() => navigate('/kontak/dokter')}
        />
      </div>

      {/* ─── Status Persediaan ───────────────────────────────── */}
      <SectionHeader title="Status Persediaan" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Stok Rendah"
          value={loading ? 0 : (data?.stock?.rendah || 0)}
          unit="produk"
          color="purple"
          onClick={() => navigate('/persediaan/daftar-produk')}
        />
        <StatusCard
          title="Stok Habis"
          value={loading ? 0 : (data?.stock?.habis || 0)}
          unit="produk"
          color="purple"
          onClick={() => navigate('/persediaan/daftar-produk')}
        />
        <StatusCard
          title="Dekat Kadaluarsa"
          value={loading ? 0 : (data?.stock?.dekat_expired || 0)}
          unit="batch"
          color="purple"
          onClick={() => navigate('/klinis/fefo')}
        />
        <StatusCard
          title="Sudah Kadaluarsa"
          value={loading ? 0 : (data?.stock?.sudah_expired || 0)}
          unit="batch"
          color="purple"
          onClick={() => navigate('/klinis/fefo')}
        />
      </div>
    </div>
  );
}

