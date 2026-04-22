import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import { FiSearch, FiDollarSign, FiCreditCard, FiTrendingUp } from 'react-icons/fi';

const API_BASE = 'http://localhost:8080/api';

export default function KeuanganDaftarAkun() {
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
  const saldoKas = pemasukan - pengeluaran;

  const accounts = [
    { id: 1, nama: 'Kas Utama', kategori: 'Kas', saldo: saldoKas, status: 'Aktif' },
    { id: 2, nama: 'Pemasukan Penjualan', kategori: 'Pendapatan', saldo: pemasukan, status: 'Aktif' },
    { id: 3, nama: 'Pengeluaran Pembelian', kategori: 'Beban', saldo: pengeluaran, status: 'Aktif' },
  ];

  return (
    <div className="animate-unt-fade">
      <PageHeader title="Daftar Akun Kas / Bank" subtitle="Kelola akun kas dan bank apotek."
        breadcrumbs={[{ label: 'Keuangan', path: '/keuangan' }, { label: 'Daftar Akun' }]} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Saldo Kas</span>
          <p className="text-xl font-extrabold text-green-600">{loading ? '...' : fmt(saldoKas)}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Total Pemasukan</span>
          <p className="text-xl font-extrabold text-blue-600">{loading ? '...' : fmt(pemasukan)}</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Total Pengeluaran</span>
          <p className="text-xl font-extrabold text-red-500">{loading ? '...' : fmt(pengeluaran)}</p>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 dark:border-gray-800">
              {['No.', 'Nama Akun', 'Kategori', 'Saldo', 'Status'].map((h, i) => (
                <th key={i} className="py-2.5 px-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={5} className="py-12 text-center text-gray-400 text-sm">Memuat data...</td></tr>
              : accounts.map((a, i) => (
                <tr key={a.id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 text-xs font-bold text-gray-400">{i+1}</td>
                  <td className="py-2.5 px-3 text-xs font-semibold text-gray-800 dark:text-gray-200">{a.nama}</td>
                  <td className="py-2.5 px-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${a.kategori === 'Kas' ? 'bg-green-50 text-green-600' : a.kategori === 'Pendapatan' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-500'}`}>{a.kategori}</span></td>
                  <td className="py-2.5 px-3 text-xs font-bold tabular-nums">{fmt(a.saldo)}</td>
                  <td className="py-2.5 px-3"><span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-50 text-green-600 border border-green-200">{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
