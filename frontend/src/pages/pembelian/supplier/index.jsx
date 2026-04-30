import React, { useState, useEffect } from 'react';
import { FiTruck, FiSearch, FiPlus, FiEdit2, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

const API_BASE = 'http://localhost:8080/api';

export default function BukuSupplier() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/master/supplier`);
      const result = await res.json();
      if (result.status) setData(result.data || []);
    } catch (e) {
      console.error('Gagal memuat data supplier:', e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = data.filter(d =>
    d.nama_supplier?.toLowerCase().includes(search.toLowerCase()) ||
    d.kode_supplier?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <FiTruck size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Buku Supplier</h1>
            <p className="text-xs text-gray-400">Daftar lengkap semua mitra supplier apotek</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-lg transition-all shadow-md shadow-primary-500/20">
          <FiPlus size={14} />
          Tambah Supplier
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau kode supplier..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Memuat data supplier...</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-gray-300">
          <FiTruck size={48} className="opacity-30" />
          <p className="text-sm font-medium text-gray-400">Belum ada data supplier</p>
          <p className="text-xs text-gray-300">Tambahkan supplier baru untuk memulai</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <div key={s.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    <FiTruck size={18} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">{s.nama_supplier}</h3>
                    <span className="text-[10px] text-gray-400 font-mono">{s.kode_supplier}</span>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                  <FiEdit2 size={13} />
                </button>
              </div>

              <div className="space-y-2">
                {s.telepon && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FiPhone size={12} className="text-gray-400" />
                    <span>{s.telepon}</span>
                  </div>
                )}
                {s.email && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FiMail size={12} className="text-gray-400" />
                    <span>{s.email}</span>
                  </div>
                )}
                {s.alamat && (
                  <div className="flex items-start gap-2 text-xs text-gray-500">
                    <FiMapPin size={12} className="text-gray-400 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{s.alamat}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
