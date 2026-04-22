import React from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import { FiClock, FiUsers, FiAlertCircle } from 'react-icons/fi';

export default function LaporanPresensi() {
  return (
    <div className="animate-unt-fade">
      <PageHeader title="Laporan Presensi" subtitle="Rekap kehadiran dan absensi staf apotek."
        breadcrumbs={[{ label: 'Laporan', path: '/laporan' }, { label: 'Presensi' }]} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-gray-400 uppercase">Fitur</span><FiClock size={14} className="text-blue-500" /></div>
          <span className="text-lg font-extrabold text-blue-600">PRO</span>
          <p className="text-[10px] text-gray-400 mt-1">Fitur ini memerlukan paket PRO</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-gray-400 uppercase">Staf Terdaftar</span><FiUsers size={14} className="text-gray-400" /></div>
          <span className="text-xl font-extrabold text-gray-600">-</span>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-gray-400 uppercase">Kehadiran</span></div>
          <span className="text-xl font-extrabold text-gray-600">-</span>
        </div>
      </div>

      <Card>
        <div className="py-16 text-center">
          <FiAlertCircle className="mx-auto mb-4 text-primary-300" size={48} />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Fitur Presensi (PRO)</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            Fitur Laporan Presensi tersedia pada paket PRO. Upgrade untuk mengelola kehadiran staf, shift kerja, dan rekap presensi bulanan.
          </p>
          <button className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-primary-500/20">
            Upgrade ke PRO
          </button>
        </div>
      </Card>
    </div>
  );
}
