import React, { useState, useEffect } from 'react';
import PageHeader from '../../../components/ui/PageHeader';
import Card from '../../../components/ui/Card';
import { FiSearch, FiRefreshCw, FiFileText, FiDollarSign, FiAlertTriangle, FiEye } from 'react-icons/fi';
import ModalDialog from '../../../components/ui/ModalDialog';

const API_BASE = 'http://localhost:8080/api';

export default function PenjualanRetur() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSale, setSelectedSale] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchData = (searchQ = '') => {
    setLoading(true);
    const params = new URLSearchParams({ status: 'Retur' });
    if (searchQ) params.set('search', searchQ);
    fetch(`${API_BASE}/master/penjualan?${params}`)
      .then(r => r.json())
      .then(result => { if (result.status) setData(result.data || []); })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const openDetail = (id) => {
    setDetailLoading(true);
    fetch(`${API_BASE}/master/penjualan/${id}`)
      .then(r => r.json())
      .then(result => { if (result.status) setSelectedSale(result.data); })
      .catch(err => console.error(err))
      .finally(() => setDetailLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSearch = (e) => { e.preventDefault(); fetchData(search); };

  const fmt = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);
  const fmtDate = (d) => { try { return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return d; } };

  const totalNilai = data.reduce((s, r) => s + parseFloat(r.total_bayar || 0), 0);

  return (
    <div className="animate-unt-fade">
      <PageHeader
        title="Retur Penjualan"
        subtitle="Daftar transaksi yang telah diretur atau dibatalkan."
        breadcrumbs={[{ label: 'Penjualan', path: '/penjualan' }, { label: 'Retur Penjualan' }]}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-900 border-2 border-primary-200 dark:border-primary-800/50 shadow-sm rounded-xl p-4 hover:border-primary-300 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Retur</span>
            <FiFileText size={14} className="text-purple-500" />
          </div>
          <span className="text-xl font-extrabold text-gray-900 dark:text-white">{data.length}</span>
        </div>
        <div className="bg-white dark:bg-gray-900 border-2 border-primary-200 dark:border-primary-800/50 shadow-sm rounded-xl p-4 hover:border-primary-300 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nilai Retur</span>
            <FiDollarSign size={14} className="text-purple-500" />
          </div>
          <span className="text-xl font-extrabold text-gray-900 dark:text-white">{fmt(totalNilai)}</span>
        </div>
        <div className="bg-white dark:bg-gray-900 border-2 border-primary-200 dark:border-primary-800/50 shadow-sm rounded-xl p-4 hover:border-primary-300 transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</span>
            <FiAlertTriangle size={14} className="text-purple-500" />
          </div>
          <span className="text-xl font-extrabold text-gray-900 dark:text-white">{data.length > 0 ? 'Ada Retur' : 'Tidak Ada'}</span>
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari invoice, pelanggan..."
              className="pl-9 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all" />
          </form>
          <button onClick={() => fetchData(search)} className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg border border-gray-200 dark:border-gray-800 transition-all">
            <FiRefreshCw size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                {['No.', 'Tanggal', 'No. Invoice', 'Pelanggan', 'Pembayaran', 'Total', 'Status', 'Aksi'].map((h, i) => (
                  <th key={i} className="py-2.5 px-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="py-12 text-center text-gray-400 text-sm">Memuat data...</td></tr>
              ) : data.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-gray-400 text-sm">Tidak ada retur penjualan</td></tr>
              ) : data.map((row, i) => (
                <tr key={row.id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50 transition-all">
                  <td className="py-2.5 px-3 text-xs font-bold text-gray-400">{i + 1}</td>
                  <td className="py-2.5 px-3 text-xs text-gray-500 whitespace-nowrap">{fmtDate(row.tanggal_penjualan)}</td>
                  <td className="py-2.5 px-3 text-xs font-bold text-primary-600 font-mono">{row.no_invoice}</td>
                  <td className="py-2.5 px-3 text-xs font-medium text-gray-700 dark:text-gray-300">{row.nama_pelanggan || 'Umum'}</td>
                  <td className="py-2.5 px-3 text-xs text-gray-500">{row.jenis_pembayaran}</td>
                  <td className="py-2.5 px-3 text-xs font-bold text-red-500 tabular-nums text-right">{fmt(row.total_bayar)}</td>
                  <td className="py-2.5 px-3"><span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200">Retur</span></td>
                  <td className="py-2.5 px-3">
                    <button onClick={() => openDetail(row.id)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="Lihat Detail">
                      <FiEye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Modal */}
      <ModalDialog
        isOpen={!!selectedSale} onClose={() => setSelectedSale(null)}
        title="Detail Retur Penjualan" maxWidth="max-w-[700px]"
      >
        {selectedSale && (
          <div className="p-6 space-y-5 border-t border-gray-100 dark:border-gray-800">
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-[10px] font-bold text-gray-400 uppercase">No. Invoice</span><p className="text-sm font-bold text-primary-600 font-mono">{selectedSale.no_invoice}</p></div>
              <div><span className="text-[10px] font-bold text-gray-400 uppercase">Status</span><p className="text-xs font-bold text-orange-500 uppercase tracking-widest">TRANSAKSI RETUR</p></div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">Item Terlibat Retur</h4>
              <div className="overflow-x-auto bg-gray-50 dark:bg-gray-950 rounded-xl border border-gray-100 dark:border-gray-800">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-gray-200 dark:border-gray-800">{['Produk', 'Qty', 'Total'].map((h, i) => (<th key={i} className="py-2 px-3 text-left text-[10px] font-bold text-gray-400 uppercase">{h}</th>))}</tr></thead>
                  <tbody>{selectedSale.items?.map((item, i) => (<tr key={i} className="border-b border-gray-100 dark:border-gray-900"><td className="py-2 px-3 text-xs font-semibold">{item.nama_produk}</td><td className="py-2 px-3 text-xs font-bold">{item.jumlah_jual}</td><td className="py-2 px-3 text-xs font-bold">{fmt(item.subtotal)}</td></tr>))}</tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-end pt-2"><button onClick={() => setSelectedSale(null)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">Tutup</button></div>
          </div>
        )}
      </ModalDialog>
    </div>
  );
}
