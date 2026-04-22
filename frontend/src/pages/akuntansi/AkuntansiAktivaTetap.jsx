import React from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import { FiAlertCircle, FiBox } from 'react-icons/fi';

export default function AkuntansiAktivaTetap() {
  return (
    <div className="animate-unt-fade">
      <PageHeader title="Aktiva Tetap" subtitle="Pencatatan dan penyusutan aset tetap apotek."
        breadcrumbs={[{ label: 'Akuntansi', path: '/akuntansi' }, { label: 'Aktiva Tetap' }]}
        badge={{ text: 'PRO', variant: 'primary' }} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Total Aset</span>
          <p className="text-xl font-extrabold text-purple-600">0</p>
          <p className="text-[10px] text-gray-400 mt-1">Belum ada aset terdaftar</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Nilai Perolehan</span>
          <p className="text-xl font-extrabold text-blue-600">Rp 0</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Akm. Penyusutan</span>
          <p className="text-xl font-extrabold text-gray-600">Rp 0</p>
        </div>
      </div>

      <Card>
        <div className="py-16 text-center">
          <FiBox className="mx-auto mb-4 text-purple-200" size={48} />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Aktiva Tetap</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            Catat dan kelola aset tetap apotek seperti peralatan, kendaraan, dan bangunan. Fitur ini menghitung penyusutan secara otomatis.
          </p>
          <p className="text-xs text-gray-400 mb-4">Belum ada aset tetap yang dicatat. Tambahkan aset pertama Anda.</p>
          <button className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-primary-500/20">
            + Tambah Aset Tetap
          </button>
        </div>
      </Card>

      <div className="mt-6 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800 rounded-xl p-5">
        <h4 className="text-xs font-bold text-purple-700 dark:text-purple-400 mb-2 uppercase tracking-wider">Informasi Aktiva Tetap</h4>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Aktiva tetap dihitung penyusutannya berdasarkan metode Garis Lurus</p>
          <p>• Contoh aset: Komputer, Printer, Rak Obat, Kendaraan, AC</p>
          <p>• Penyusutan dihitung otomatis berdasarkan umur ekonomis</p>
        </div>
      </div>
    </div>
  );
}
