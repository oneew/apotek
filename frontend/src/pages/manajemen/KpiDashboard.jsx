import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import { FiTrendingUp, FiAward, FiTarget, FiActivity } from 'react-icons/fi';

const API_KPI = 'http://localhost:8080/api/master/kpi/dashboard';

export default function KpiDashboard() {
  const [periode, setPeriode] = useState(new Date().toISOString().slice(0, 7));
  const [data, setData] = useState({ leaderboard_kasir: [], kepatuhan_resep: 0, total_transaksi_all: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_KPI}?periode=${periode}`).then(r => r.json()).then(r => {
      if(r.status) setData(r.data);
      setLoading(false);
    });
  }, [periode]);

  const rp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-20">
      <SectionHeader title="KPI & Leaderboard Kasir" subtitle="Monitoring performa individu berdasarkan transaksi aktual apotek." icon={<FiTrendingUp size={24} className="text-gray-500" />} />

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Performa {new Date(periode + '-01').toLocaleString('id-ID', {month: 'long', year: 'numeric'})}</h2>
        <div className="flex items-center gap-3 bg-white dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
          <label className="text-xs font-bold text-gray-500 uppercase px-2">Bulan</label>
          <input type="month" value={periode} onChange={e => setPeriode(e.target.value)} className="px-2 py-1 bg-gray-50 rounded text-sm font-bold outline-none border border-gray-100" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Transaksi Global */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Transaksi Apotek</p>
              <h3 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">{data.total_transaksi_all}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FiActivity size={24} /></div>
          </div>
          <p className="text-[11px] text-gray-500 font-medium">Gabungan seluruh kasir bulan ini</p>
        </div>

        {/* Kepatuhan Resep */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Kepatuhan Resep (Target &gt;80%)</p>
              <h3 className={`text-4xl font-extrabold ${data.kepatuhan_resep >= 80 ? 'text-success-600' : 'text-warning-600'}`}>{data.kepatuhan_resep}%</h3>
            </div>
            <div className="p-3 bg-success-50 text-success-600 rounded-xl"><FiTarget size={24} /></div>
          </div>
          <p className="text-[11px] text-gray-500 font-medium">% Transaksi mencantumkan SIP/Nama Dokter</p>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4">
            <div className={`h-1.5 rounded-full ${data.kepatuhan_resep >= 80 ? 'bg-success-500' : 'bg-warning-500'}`} style={{ width: `${data.kepatuhan_resep}%` }}></div>
          </div>
        </div>

        {/* Top Performer */}
        <div className="bg-gradient-to-br from-primary-600 to-indigo-700 p-6 rounded-2xl shadow-md text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4"><FiAward size={160} /></div>
          <p className="text-xs font-bold text-primary-200 uppercase tracking-wider mb-1">Top Kasir Bulan Ini</p>
          <h3 className="text-3xl font-extrabold mb-1 drop-shadow-sm truncate">{data.leaderboard_kasir[0]?.nama_lengkap || 'Belum Ada'}</h3>
          <p className="text-sm font-medium text-primary-100 opacity-90">{rp(data.leaderboard_kasir[0]?.total_pendapatan || 0)} Pendapatan</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden min-h-[300px]">
        {loading ? (
           <div className="flex items-center justify-center h-48 text-gray-400 font-medium animate-pulse">Menghitung matriks performa...</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Peringkat</th>
                <th className="px-6 py-4">Nama Pegawai / Kasir</th>
                <th className="px-6 py-4 text-center">Total Transaksi Dilayani</th>
                <th className="px-6 py-4 text-right">Rata-rata Nilai Transaksi</th>
                <th className="px-6 py-4 text-right">Total Pendapatan Diperoleh</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {data.leaderboard_kasir.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-gray-400 italic">Belum ada data transaksi bulan ini.</td></tr>
              ) : data.leaderboard_kasir.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    {i === 0 ? <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 font-black">1</span> :
                     i === 1 ? <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-black">2</span> :
                     i === 2 ? <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-800 font-black">3</span> :
                     <span className="flex items-center justify-center w-8 h-8 font-bold text-gray-400">{i+1}</span>}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900 dark:text-gray-100">{row.nama_lengkap}</p>
                    <p className="text-[10px] text-gray-400 font-mono">@{row.username}</p>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-gray-600 dark:text-gray-300">
                    {row.total_transaksi}
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400 text-right">
                    {rp(row.rata_rata_transaksi)}
                  </td>
                  <td className="px-6 py-4 text-right text-success-600 font-black bg-success-50/50">
                    {rp(row.total_pendapatan)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
