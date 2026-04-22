import React, { useState, useEffect } from 'react';
import PageHeader from '../../../components/ui/PageHeader';
import Card from '../../../components/ui/Card';
import ModalDialog from '../../../components/ui/ModalDialog';
import { FiSearch, FiRefreshCw, FiDownload, FiEye, FiXCircle, FiFileText, FiCalendar, FiDollarSign, FiUser, FiCheckCircle } from 'react-icons/fi';

const API_BASE = 'http://localhost:8080/api';

export default function PenjualanDaftar() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSale, setSelectedSale] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [summary, setSummary] = useState({ total_records: 0, total_nilai: 0 });

  const fetchData = (searchQ = '') => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQ) params.set('search', searchQ);
    fetch(`${API_BASE}/master/penjualan?${params}`)
      .then(r => r.json())
      .then(result => {
        if (result.status) {
          setData(result.data || []);
          setSummary(result.summary || { total_records: 0, total_nilai: 0 });
        }
      })
      .catch(err => console.error('API error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(search);
  };

  const openDetail = (id) => {
    setDetailLoading(true);
    fetch(`${API_BASE}/master/penjualan/${id}`)
      .then(r => r.json())
      .then(result => { if (result.status) setSelectedSale(result.data); })
      .catch(err => console.error(err))
      .finally(() => setDetailLoading(false));
  };

  const handleVoid = (id) => {
    if (!confirm('Yakin ingin membatalkan penjualan ini?')) return;
    fetch(`${API_BASE}/master/penjualan/${id}`, { method: 'DELETE' })
      .then(r => r.json())
      .then(result => {
        if (result.status) {
          fetchData(search);
          setSelectedSale(null);
        }
      });
  };

  const fmt = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);
  const fmtDate = (d) => { try { return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return d; } };

  const statusBadge = (s) => {
    const map = {
      'Selesai': 'bg-green-50 text-green-600 border-green-200',
      'Dibatalkan': 'bg-red-50 text-red-500 border-red-200',
      'Pending': 'bg-yellow-50 text-yellow-600 border-yellow-200',
    };
    return map[s] || 'bg-gray-50 text-gray-500 border-gray-200';
  };

  const payBadge = (t) => {
    const map = {
      'Tunai': 'bg-green-50 text-green-600',
      'Qris/E-Wallet': 'bg-teal-50 text-teal-600',
      'Debit': 'bg-blue-50 text-blue-600',
      'Kredit': 'bg-purple-50 text-purple-600',
    };
    return map[t] || 'bg-gray-50 text-gray-500';
  };

  return (
    <div className="animate-unt-fade">
      <PageHeader
        title="Daftar Penjualan"
        subtitle="Riwayat semua transaksi penjualan apotek."
        breadcrumbs={[{ label: 'Penjualan', path: '/penjualan' }, { label: 'Daftar Penjualan' }]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Transaksi</span>
            <FiFileText size={14} className="text-green-500" />
          </div>
          <span className="text-xl font-extrabold text-green-600">{summary.total_records}</span>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Nilai</span>
            <FiDollarSign size={14} className="text-blue-500" />
          </div>
          <span className="text-xl font-extrabold text-blue-600">{fmt(summary.total_nilai)}</span>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rata-Rata</span>
            <FiDollarSign size={14} className="text-purple-500" />
          </div>
          <span className="text-xl font-extrabold text-purple-600">{fmt(summary.total_records > 0 ? summary.total_nilai / summary.total_records : 0)}</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari invoice, pelanggan..."
              className="pl-9 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all"
            />
          </form>
          <div className="flex items-center gap-2">
            <button onClick={() => fetchData(search)} className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg border border-gray-200 dark:border-gray-800 transition-all" title="Refresh">
              <FiRefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                {['No.', 'Tanggal', 'No. Invoice', 'Pelanggan', 'Dokter', 'Pembayaran', 'Total', 'Status', 'Aksi'].map((h, i) => (
                  <th key={i} className="py-2.5 px-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="py-12 text-center text-gray-400 text-sm">Memuat data...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={9} className="py-12 text-center text-gray-400 text-sm">Belum ada data penjualan</td></tr>
              ) : data.map((row, i) => (
                <tr key={row.id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-all">
                  <td className="py-2.5 px-3 text-xs font-bold text-gray-400">{i + 1}</td>
                  <td className="py-2.5 px-3 text-xs text-gray-500 whitespace-nowrap">{fmtDate(row.tanggal_penjualan)}</td>
                  <td className="py-2.5 px-3 text-xs font-bold text-primary-600 font-mono">{row.no_invoice}</td>
                  <td className="py-2.5 px-3 text-xs font-medium text-gray-700 dark:text-gray-300">{row.nama_pelanggan || 'Umum'}</td>
                  <td className="py-2.5 px-3 text-xs text-gray-500">{row.nama_dokter || '-'}</td>
                  <td className="py-2.5 px-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${payBadge(row.jenis_pembayaran)}`}>{row.jenis_pembayaran}</span></td>
                  <td className="py-2.5 px-3 text-xs font-bold text-gray-900 dark:text-white tabular-nums text-right">{fmt(row.total_bayar)}</td>
                  <td className="py-2.5 px-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusBadge(row.status_penjualan)}`}>{row.status_penjualan}</span></td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openDetail(row.id)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="Lihat Detail">
                        <FiEye size={14} />
                      </button>
                      {row.status_penjualan === 'Selesai' && (
                        <button onClick={() => handleVoid(row.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Batalkan">
                          <FiXCircle size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Modal */}
      <ModalDialog
        isOpen={!!selectedSale}
        onClose={() => setSelectedSale(null)}
        title="Detail Penjualan"
        maxWidth="max-w-[700px]"
      >
        {selectedSale && (
          <>
            <div className="p-6 space-y-5 border-t border-gray-100 dark:border-gray-800">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">No. Invoice</span>
                    <p className="text-sm font-bold text-primary-600 font-mono">{selectedSale.no_invoice}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Tanggal</span>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{fmtDate(selectedSale.tanggal_penjualan)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Status</span>
                    <p><span className={`text-xs font-bold px-2 py-0.5 rounded border ${statusBadge(selectedSale.status_penjualan)}`}>{selectedSale.status_penjualan}</span></p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Pelanggan</span>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{selectedSale.nama_pelanggan || 'Umum (Walk-in)'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Dokter</span>
                    <p className="text-sm text-gray-500">{selectedSale.nama_dokter || '-'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Pembayaran</span>
                    <p><span className={`text-xs font-bold px-2 py-0.5 rounded ${payBadge(selectedSale.jenis_pembayaran)}`}>{selectedSale.jenis_pembayaran}</span></p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">Daftar Produk</h4>
                <div className="overflow-x-auto bg-gray-50 dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-gray-800">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800">
                        {['Produk', 'Qty', 'Harga', 'Subtotal'].map((h, i) => (
                          <th key={i} className="py-2 px-3 text-left text-[10px] font-bold text-gray-400 uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedSale.items || []).map((item, i) => (
                        <tr key={i} className="border-b border-gray-100 dark:border-gray-900">
                          <td className="py-2 px-3">
                            <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">{item.nama_produk}</div>
                            <div className="text-[10px] text-gray-400">{item.nama_satuan || '-'}</div>
                          </td>
                          <td className="py-2 px-3 text-xs font-bold text-gray-700">{item.jumlah_jual}</td>
                          <td className="py-2 px-3 text-xs text-gray-500 tabular-nums">{fmt(item.harga_jual_per_satuan)}</td>
                          <td className="py-2 px-3 text-xs font-bold text-gray-900 dark:text-white tabular-nums">{fmt(item.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="bg-primary-50 dark:bg-primary-900/10 rounded-xl p-4 border border-primary-100 dark:border-primary-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-bold tabular-nums">{fmt(selectedSale.total_belanja)}</span>
                </div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Diskon</span>
                  <span className="font-bold text-red-500 tabular-nums">-{fmt(selectedSale.diskon_nota)}</span>
                </div>
                <div className="border-t border-primary-200 dark:border-primary-800 my-2" />
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-gray-900 dark:text-white">Total Bayar</span>
                  <span className="font-extrabold text-primary-600 tabular-nums">{fmt(selectedSale.total_bayar)}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-500">Uang Diterima</span>
                  <span className="font-bold tabular-nums">{fmt(selectedSale.uang_diterima)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Kembalian</span>
                  <span className="font-bold text-green-500 tabular-nums">{fmt(selectedSale.uang_kembali)}</span>
                </div>
              </div>

              {selectedSale.keterangan && (
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Catatan</span>
                  <p className="text-xs text-gray-500 mt-1">{selectedSale.keterangan}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button onClick={() => setSelectedSale(null)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">Tutup</button>
            </div>
          </>
        )}
      </ModalDialog>
    </div>
  );
}
