import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import { FiSearch, FiDollarSign, FiLayers } from 'react-icons/fi';

const API_BASE = 'http://localhost:8080/api';

export default function AkuntansiDaftarAkun() {
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

  const chartOfAccounts = [
    { kode: '1-1000', nama: 'Kas', tipe: 'Aset', saldo: pemasukan - pengeluaran, normal: 'Debit' },
    { kode: '1-2000', nama: 'Persediaan Barang', tipe: 'Aset', saldo: 0, normal: 'Debit' },
    { kode: '2-1000', nama: 'Utang Usaha', tipe: 'Kewajiban', saldo: pengeluaran, normal: 'Kredit' },
    { kode: '3-1000', nama: 'Modal', tipe: 'Modal', saldo: 0, normal: 'Kredit' },
    { kode: '4-1000', nama: 'Pendapatan Penjualan', tipe: 'Pendapatan', saldo: pemasukan, normal: 'Kredit' },
    { kode: '5-1000', nama: 'Harga Pokok Penjualan', tipe: 'Beban', saldo: 0, normal: 'Debit' },
    { kode: '5-2000', nama: 'Beban Pembelian', tipe: 'Beban', saldo: pengeluaran, normal: 'Debit' },
    { kode: '5-3000', nama: 'Beban Operasional', tipe: 'Beban', saldo: 0, normal: 'Debit' },
  ];

  const tipeColors = {
    'Aset': 'bg-blue-50 text-blue-600',
    'Kewajiban': 'bg-red-50 text-red-500',
    'Modal': 'bg-purple-50 text-purple-600',
    'Pendapatan': 'bg-green-50 text-green-600',
    'Beban': 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="animate-unt-fade">
      <PageHeader title="Daftar Akun (CoA)" subtitle="Chart of Accounts - Daftar akun akuntansi apotek."
        breadcrumbs={[{ label: 'Akuntansi', path: '/akuntansi' }, { label: 'Daftar Akun' }]}
        badge={{ text: 'PRO', variant: 'primary' }} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Total Akun</span>
          <p className="text-xl font-extrabold text-blue-600">{chartOfAccounts.length}</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Total Aset</span>
          <p className="text-xl font-extrabold text-green-600">{fmt(pemasukan - pengeluaran)}</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Total Pendapatan</span>
          <p className="text-xl font-extrabold text-purple-600">{fmt(pemasukan)}</p>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 dark:border-gray-800">
              {['Kode', 'Nama Akun', 'Tipe', 'Saldo Normal', 'Saldo'].map((h, i) => (
                <th key={i} className="py-2.5 px-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={5} className="py-12 text-center text-gray-400 text-sm">Memuat data...</td></tr>
              : chartOfAccounts.map((a, i) => (
                <tr key={a.kode} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 text-xs font-bold text-primary-600 font-mono">{a.kode}</td>
                  <td className="py-2.5 px-3 text-xs font-semibold text-gray-800 dark:text-gray-200">{a.nama}</td>
                  <td className="py-2.5 px-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${tipeColors[a.tipe] || 'bg-gray-50 text-gray-500'}`}>{a.tipe}</span></td>
                  <td className="py-2.5 px-3 text-xs text-gray-500">{a.normal}</td>
                  <td className="py-2.5 px-3 text-xs font-bold tabular-nums text-right">{a.saldo > 0 ? fmt(a.saldo) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
