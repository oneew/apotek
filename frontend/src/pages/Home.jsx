import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiClock, FiActivity, FiArrowRight, FiCheckCircle, FiShoppingCart, FiPackage, FiUsers, FiTruck, FiDollarSign, FiAlertTriangle, FiTrendingUp, FiUserCheck } from 'react-icons/fi';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const API_BASE = 'http://localhost:8080/api';

export default function Home() {
  const navigate = useNavigate();
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
  const formatDate = (d) => { try { return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return d; } };

  const quickStats = data ? [
    { label: 'Penjualan Hari Ini', value: formatCurrency(data.sales.today_total), sub: `${data.sales.today_count} transaksi`, icon: FiDollarSign, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-100 dark:border-green-800' },
    { label: 'Penjualan Bulan Ini', value: formatCurrency(data.sales.month_total), sub: `${data.sales.month_count} transaksi`, icon: FiTrendingUp, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-100 dark:border-blue-800' },
    { label: 'Total Produk', value: data.counts.produk, sub: `${data.stock.rendah} stok rendah`, icon: FiPackage, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-100 dark:border-purple-800' },
    { label: 'Peringatan Stok', value: data.stock.habis + data.stock.sudah_expired, sub: `${data.stock.habis} habis, ${data.stock.sudah_expired} expired`, icon: FiAlertTriangle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-100 dark:border-red-800' },
  ] : [];

  const quickLinks = [
    { label: 'Buka Kasir', sub: 'Point of Sale', icon: FiShoppingCart, path: '/penjualan/kasir', color: 'bg-primary-600 text-white' },
    { label: 'Persediaan', sub: 'Cek Stok Produk', icon: FiPackage, path: '/persediaan/daftar-produk', color: 'bg-teal-600 text-white' },
    { label: 'Pelanggan', sub: 'Database Pelanggan', icon: FiUsers, path: '/kontak/pelanggan', color: 'bg-blue-600 text-white' },
    { label: 'Pembelian', sub: 'Rencana Pembelian', icon: FiTruck, path: '/pembelian/rencana', color: 'bg-orange-600 text-white' },
  ];

  const dbCards = data ? [
    { label: 'Pelanggan', value: data.counts.pelanggan, icon: FiUsers, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Supplier', value: data.counts.supplier, icon: FiTruck, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Dokter', value: data.counts.dokter, icon: FiUserCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Kategori', value: data.counts.kategori, icon: FiPackage, color: 'text-purple-500', bg: 'bg-purple-50' },
  ] : [];

  return (
    <div className="animate-unt-fade">
      <PageHeader
        title="Selamat Datang kembali!"
        subtitle="Berikut ringkasan aktivitas dan status apotek Anda."
        breadcrumbs={[{ label: 'Aplikasi', path: '/' }, { label: 'Beranda' }]}
      />

      {/* Welcome Banner */}
      <div className="mb-6 translate-y-0 hover:-translate-y-0.5 transition-all duration-300">
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-2xl p-8 text-white shadow-xl shadow-primary-900/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          <div className="absolute -bottom-8 left-8 w-32 h-32 bg-white/5 rounded-full blur-xl" />

          <div className="relative z-10 flex-1">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border border-white/20">
              <FiActivity size={12} className="animate-pulse" /> Apotek Digital
            </div>
            <h2 className="text-2xl font-extrabold mb-2 tracking-tight">Nova Farma — Kasir & Manajemen Apotek</h2>
            <p className="text-primary-100 text-sm max-w-xl font-medium leading-relaxed opacity-90">
              Kelola stok obat, transaksi penjualan, dan rekam medis pasien dengan lebih cepat dan elegan.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Button onClick={() => navigate('/penjualan/kasir')} className="bg-white text-primary-700 hover:bg-primary-50 border-none font-bold px-6" size="md">
                Buka Kasir POS
              </Button>
              <Button onClick={() => navigate('/persediaan/daftar-produk')} variant="outline" className="text-white border-white/30 hover:bg-white/10 font-bold px-6" size="md">
                Cek Persediaan
              </Button>
            </div>
          </div>

          <div className="hidden lg:block relative z-10 shrink-0">
            <div className="w-40 h-40 bg-white/10 rounded-3xl border border-white/20 flex items-center justify-center backdrop-blur-md">
              <span className="text-6xl">🏥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24 mb-3" />
              <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded w-32" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          {quickStats.map((stat, i) => (
            <div key={i} className={`${stat.bg} rounded-xl p-4 border ${stat.border} hover:-translate-y-0.5 transition-all`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">{stat.label}</span>
                <stat.icon size={16} className={stat.color} />
              </div>
              <div className={`text-xl font-extrabold ${stat.color} tracking-tight`}>{stat.value}</div>
              <div className="text-[11px] text-gray-400 font-medium mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Quick Links + Database */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Access */}
          <Card title="Akses Cepat" subtitle="Menu yang sering digunakan">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickLinks.map((link, i) => (
                <button key={i} onClick={() => navigate(link.path)} className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-primary-300 hover:-translate-y-0.5 transition-all group">
                  <div className={`w-10 h-10 ${link.color} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <link.icon size={18} />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-gray-900 dark:text-white">{link.label}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{link.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Recent Sales */}
          <Card
            title="Transaksi Terakhir"
            subtitle="5 penjualan terbaru"
            actions={<Button onClick={() => navigate('/penjualan/daftar')} variant="link" iconRight={FiArrowRight} className="font-bold text-xs">Lihat Semua</Button>}
          >
            {!data || data.recent_sales.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-sm">Belum ada transaksi</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      {['Invoice', 'Tanggal', 'Total', 'Status'].map((h, i) => (
                        <th key={i} className="py-2 px-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent_sales.map((sale, i) => (
                      <tr key={i} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50 transition-all">
                        <td className="py-2.5 px-3 text-xs font-bold text-primary-600 font-mono">{sale.no_invoice}</td>
                        <td className="py-2.5 px-3 text-xs text-gray-500">{formatDate(sale.tanggal_penjualan || sale.created_at)}</td>
                        <td className="py-2.5 px-3 text-xs font-bold text-gray-900 dark:text-white tabular-nums">{formatCurrency(sale.total_bayar)}</td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sale.status_penjualan === 'Selesai' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                            {sale.status_penjualan}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Workspace Info */}
          <Card title="Info Workspace">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 mb-4">
              <p className="text-[11px] font-bold text-gray-400 uppercase">Outlet Aktif</p>
              <p className="text-base font-bold text-primary-600 mt-1">Nova Farma</p>
              <p className="text-xs text-gray-400 mt-0.5">nova08 • Administrator</p>
              <Button onClick={() => navigate('/select-outlet')} variant="secondary" size="sm" className="w-full mt-3 font-bold">Pindah Outlet</Button>
            </div>
          </Card>

          {/* Database Summary */}
          {data && (
            <Card title="Database Apotek" subtitle="Ringkasan data master">
              <div className="space-y-2">
                {dbCards.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-950 rounded-lg border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${item.bg} rounded-lg flex items-center justify-center ${item.color}`}>
                        <item.icon size={14} />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item.label}</span>
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 dark:text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
