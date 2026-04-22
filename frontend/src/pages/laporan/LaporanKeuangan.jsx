import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import { FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE = 'http://localhost:8080/api';

export default function LaporanKeuangan() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/dashboard/summary`)
      .then(r => r.json())
      .then(result => { if (result.status) setData(result.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fmt = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0);

  const pemasukan = data?.sales?.month_total || 0;
  const pengeluaran = data?.purchases?.month_total || 0;
  const laba = pemasukan - pengeluaran;
  const chartData = data?.sales_chart || [];

  return (
    <div className="animate-unt-fade">
      <PageHeader title="Laporan Keuangan" subtitle="Ringkasan pemasukan, pengeluaran, dan laba apotek."
        breadcrumbs={[{ label: 'Laporan', path: '/laporan' }, { label: 'Keuangan' }]} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-gray-400 uppercase">Pemasukan (Penjualan)</span><FiTrendingUp size={14} className="text-green-500" /></div>
          <span className="text-xl font-extrabold text-green-600">{loading ? '...' : fmt(pemasukan)}</span>
          <p className="text-[10px] text-gray-400 mt-1">{data?.sales?.month_count || 0} transaksi bulan ini</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-gray-400 uppercase">Pengeluaran (Pembelian)</span><FiTrendingDown size={14} className="text-red-500" /></div>
          <span className="text-xl font-extrabold text-red-500">{loading ? '...' : fmt(pengeluaran)}</span>
        </div>
        <div className={`${laba >= 0 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'} border rounded-xl p-4`}>
          <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-gray-400 uppercase">Laba Kotor</span><FiDollarSign size={14} className={laba >= 0 ? 'text-blue-500' : 'text-red-500'} /></div>
          <span className={`text-xl font-extrabold ${laba >= 0 ? 'text-blue-600' : 'text-red-500'}`}>{loading ? '...' : fmt(laba)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card title="Pemasukan 7 Hari Terakhir">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-base)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#98a2b3' }} />
                <YAxis tick={{ fontSize: 10, fill: '#98a2b3' }} tickFormatter={v => fmt(v)} />
                <Tooltip formatter={v => fmt(v)} />
                <Bar dataKey="total" name="Pemasukan" fill="#4ade80" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Frekuensi Transaksi">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-base)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#98a2b3' }} />
                <YAxis tick={{ fontSize: 10, fill: '#98a2b3' }} />
                <Tooltip />
                <Bar dataKey="frekuensi" name="Transaksi" fill="#B19CD9" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800 rounded-xl p-5">
        <h4 className="text-xs font-bold text-primary-700 dark:text-primary-400 mb-3 uppercase tracking-wider">Ringkasan Keuangan Bulan Ini</h4>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div><span className="text-gray-500">Total Pemasukan</span><p className="font-extrabold text-green-600">{fmt(pemasukan)}</p></div>
          <div><span className="text-gray-500">Total Pengeluaran</span><p className="font-extrabold text-red-500">{fmt(pengeluaran)}</p></div>
          <div><span className="text-gray-500">Laba Kotor</span><p className={`font-extrabold ${laba >= 0 ? 'text-blue-600' : 'text-red-500'}`}>{fmt(laba)}</p></div>
        </div>
      </div>
    </div>
  );
}
