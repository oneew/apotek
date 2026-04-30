import React, { useState, useEffect } from 'react';
import { FiShoppingBag, FiSearch, FiEye, FiDownload, FiFilter } from 'react-icons/fi';

const API_BASE = 'http://localhost:8080/api';

export default function PembelianList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/master/pembelian`);
      const result = await res.json();
      if (result.status) setData(result.data || []);
    } catch (e) {
      console.error('Gagal memuat data pembelian:', e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = data.filter(d =>
    d.no_invoice?.toLowerCase().includes(search.toLowerCase()) ||
    d.nama_supplier?.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);
  const formatDate = (d) => { try { return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return d; } };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <FiShoppingBag size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Daftar Pembelian</h1>
            <p className="text-xs text-gray-400">Rekap semua transaksi pembelian dari supplier</p>
          </div>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-lg transition-all shadow-md shadow-primary-500/20"
        >
          <FiDownload size={14} />
          Export
        </button>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari no. invoice atau supplier..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-800 text-gray-500 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
          <FiFilter size={14} />
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
            <tr>
              {['No. Invoice', 'Tanggal', 'Supplier', 'Total', 'Status', 'Aksi'].map((h, i) => (
                <th key={i} className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
            {loading ? (
              <tr><td colSpan="6" className="px-4 py-20 text-center text-gray-400 text-sm">Memuat data...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="6" className="px-4 py-20 text-center">
                <div className="flex flex-col items-center gap-3 text-gray-300">
                  <FiShoppingBag size={40} className="opacity-30" />
                  <p className="text-sm font-medium text-gray-400">Belum ada data pembelian</p>
                </div>
              </td></tr>
            ) : filtered.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-950/50 transition-all">
                <td className="px-4 py-3 text-xs font-bold text-primary-600 font-mono">{item.no_invoice}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{formatDate(item.tanggal_pembelian)}</td>
                <td className="px-4 py-3 text-xs font-medium text-gray-700">{item.nama_supplier}</td>
                <td className="px-4 py-3 text-xs font-bold text-gray-900">{formatCurrency(item.total_harga)}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${item.status_pembayaran === 'Lunas' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                    {item.status_pembayaran || 'Pending'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                    <FiEye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
