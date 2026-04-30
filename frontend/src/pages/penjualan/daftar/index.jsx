import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import PageHeader from '../../../components/ui/PageHeader';
import Card from '../../../components/ui/Card';
import ModalDialog from '../../../components/ui/ModalDialog';
import { FiSearch, FiRefreshCw, FiDownload, FiEye, FiXCircle, FiFileText, FiCalendar, FiDollarSign, FiUser, FiCheckCircle, FiRefreshCcw, FiAlertTriangle } from 'react-icons/fi';
import ModalTukarObat from './components/ModalTukarObat';

const API_BASE = '/api';

export default function PenjualanDaftar() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSale, setSelectedSale] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [summary, setSummary] = useState({ total_records: 0, total_nilai: 0 });
  const [isReturModalOpen, setIsReturModalOpen] = useState(false);
  const [saleToReturn, setSaleToReturn] = useState(null);
  const [filterTanggal, setFilterTanggal] = useState('Semua');
  const [selectedDateFrom, setSelectedDateFrom] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDateTo, setSelectedDateTo] = useState(new Date().toISOString().split('T')[0]);

  const fetchData = (searchQ = search, filterT = filterTanggal, dateF = selectedDateFrom, dateT = selectedDateTo) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQ) params.set('search', searchQ);
    if (filterT !== 'Semua' && filterT !== 'Rentang') params.set('filter_tanggal', filterT);
    if (filterT === 'Rentang') {
      params.set('date_from', dateF);
      params.set('date_to', dateT);
    }
    
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

  useEffect(() => { 
    fetchData(search, filterTanggal, selectedDateFrom, selectedDateTo); 
  }, [filterTanggal, selectedDateFrom, selectedDateTo]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(search, filterTanggal, selectedDateFrom, selectedDateTo);
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
    Swal.fire({
      title: 'Batalkan Penjualan?',
      text: 'Transaksi ini akan dibatalkan dan status akan diperbarui.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Batalkan!',
      cancelButtonText: 'Kembali'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${API_BASE}/master/penjualan/${id}`, { method: 'DELETE' })
          .then(r => r.json())
          .then(res => {
            if (res.status) {
              Swal.fire('Berhasil', 'Penjualan telah dibatalkan.', 'success');
              fetchData(search);
              setSelectedSale(null);
            } else {
              Swal.fire('Gagal', res.message || 'Gagal membatalkan penjualan', 'error');
            }
          });
      }
    });
  };

  const handleRestore = (id) => {
    Swal.fire({
      title: 'Pulihkan Penjualan?',
      text: 'Transaksi akan diaktifkan kembali dan stok akan dipotong ulang.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#7c3aed',
      confirmButtonText: 'Ya, Pulihkan',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${API_BASE}/master/penjualan/restore/${id}`, { method: 'POST' })
          .then(r => r.json())
          .then(res => {
            if (res.status) {
              Swal.fire('Dipulihkan', 'Penjualan telah aktif kembali.', 'success');
              fetchData(search);
            } else {
              Swal.fire('Gagal', res.message || 'Gagal memulihkan penjualan', 'error');
            }
          });
      }
    });
  };

  const fmt = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);
  const fmtDate = (d) => { try { return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return d; } };

  const statusBadge = (s) => {
    const map = {
      'Selesai': 'bg-green-50 text-green-600 border-green-200',
      'Batal': 'bg-red-50 text-red-500 border-red-200',
      'Pending': 'bg-yellow-50 text-yellow-600 border-yellow-200',
      'Retur': 'bg-amber-50 text-amber-600 border-amber-200',
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
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 border-2 border-primary-200 dark:border-primary-800/50 shadow-sm rounded-xl p-4 hover:border-primary-300 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Transaksi Aktif</span>
            <FiCheckCircle size={14} className="text-primary-500" />
          </div>
          <span className="text-xl font-extrabold text-gray-900 dark:text-white">{summary.total_active_records || 0}</span>
        </div>
        <div className="bg-white dark:bg-gray-900 border-2 border-primary-200 dark:border-primary-800/50 shadow-sm rounded-xl p-4 hover:border-primary-300 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Transaksi</span>
            <FiFileText size={14} className="text-primary-500" />
          </div>
          <span className="text-xl font-extrabold text-gray-900 dark:text-white">{summary.total_records || 0}</span>
        </div>
        <div className="bg-white dark:bg-gray-900 border-2 border-primary-200 dark:border-primary-800/50 shadow-sm rounded-xl p-4 hover:border-primary-300 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Nilai</span>
            <FiDollarSign size={14} className="text-primary-500" />
          </div>
          <span className="text-xl font-extrabold text-gray-900 dark:text-white">{fmt(summary.total_nilai)}</span>
        </div>
        <div className="bg-white dark:bg-gray-900 border-2 border-primary-200 dark:border-primary-800/50 shadow-sm rounded-xl p-4 hover:border-primary-300 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rata-Rata</span>
            <FiDollarSign size={14} className="text-primary-500" />
          </div>
          <span className="text-xl font-extrabold text-gray-900 dark:text-white">{fmt(summary.total_active_records > 0 ? summary.total_nilai / summary.total_active_records : 0)}</span>
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
            <select 
              value={filterTanggal} 
              onChange={e => setFilterTanggal(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold text-gray-600 outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
            >
              <option value="Semua">Semua Waktu</option>
              <option value="Hari ini">Hari ini</option>
              <option value="Minggu ini">Minggu ini</option>
              <option value="Bulan ini">Bulan ini</option>
              <option value="Tahun ini">Tahun ini</option>
              <option value="Rentang">Pilih Rentang Tanggal</option>
            </select>
            {filterTanggal === 'Rentang' && (
              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  value={selectedDateFrom}
                  onChange={e => setSelectedDateFrom(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold text-gray-600 outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
                />
                <span className="text-gray-400 font-bold">-</span>
                <input
                  type="date"
                  value={selectedDateTo}
                  onChange={e => setSelectedDateTo(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-bold text-gray-600 outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300"
                />
              </div>
            )}
            <button onClick={() => fetchData(search, filterTanggal, selectedDateFrom, selectedDateTo)} className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg border border-gray-200 dark:border-gray-800 transition-all" title="Refresh">
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
              ) : data.map((row, i) => {
                const isVoided = row.status_penjualan === 'Batal';
                return (
                  <tr key={row.id} className={`border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-all ${isVoided ? 'opacity-60 grayscale-[0.3] bg-gray-50/30' : ''}`}>
                    <td className="py-2.5 px-3 text-xs font-bold text-gray-400">{i + 1}</td>
                    <td className="py-2.5 px-3 text-xs text-gray-500 whitespace-nowrap">{fmtDate(row.tanggal_penjualan)}</td>
                    <td className={`py-2.5 px-3 text-xs font-bold font-mono ${isVoided ? 'text-gray-400 line-through' : 'text-primary-600'}`}>{row.no_invoice}</td>
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
                          <button
                            onClick={() => {
                              setDetailLoading(true);
                              fetch(`${API_BASE}/master/penjualan/${row.id}`)
                                .then(r => r.json())
                                .then(result => {
                                  if (result.status) {
                                    setSaleToReturn(result.data);
                                    setIsReturModalOpen(true);
                                  }
                                })
                                .finally(() => setDetailLoading(false));
                            }}
                            className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all"
                            title="Retur / Tukar Obat"
                          >
                            <FiRefreshCcw size={14} />
                          </button>
                        )}
                        {!isVoided && (
                          <button onClick={() => handleVoid(row.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Batalkan">
                            <FiXCircle size={14} />
                          </button>
                        )}
                        {isVoided && (
                          <button onClick={() => handleRestore(row.id)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Pulihkan / Restore">
                            <FiRefreshCw size={14} className="rotate-180" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
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
            {/* VOID BANNER */}
            {selectedSale.status_penjualan === 'Batal' && (
              <div className="bg-red-500 text-white px-6 py-3 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-3">
                  <FiAlertTriangle className="animate-bounce" />
                  <span className="text-xs font-black uppercase tracking-[3px]">TRANSAKSI INI TELAH DIBATALKAN</span>
                </div>
                <div className="text-[10px] font-bold opacity-80 italic">Status: VOID</div>
              </div>
            )}
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

      <ModalTukarObat
        isOpen={isReturModalOpen}
        onClose={() => { setIsReturModalOpen(false); setSaleToReturn(null); }}
        saleData={saleToReturn}
        onComplete={() => fetchData(search)}
      />
    </div>
  );
}
