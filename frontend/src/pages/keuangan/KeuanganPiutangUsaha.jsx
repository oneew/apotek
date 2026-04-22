import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import ModalDialog from '../../components/ui/ModalDialog';
import { FiSearch, FiDollarSign, FiUsers, FiAlertCircle, FiEye, FiCheckCircle, FiUser, FiCalendar, FiFileText } from 'react-icons/fi';

const API_BASE = 'http://localhost:8080/api';

export default function KeuanganPiutangUsaha() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSale, setSelectedSale] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    // Piutang = sales with Kredit payment type (credit sales)
    fetch(`${API_BASE}/master/penjualan?jenis_pembayaran=Kredit`)
      .then(r => r.json())
      .then(result => { if (result.status) setSales(result.data || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fmt = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0);
  const fmtDate = (d) => { try { return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return d; } };

  const openDetail = (id) => {
    setDetailLoading(true);
    fetch(`${API_BASE}/master/penjualan/${id}`)
      .then(r => r.json())
      .then(result => { if (result.status) setSelectedSale(result.data); })
      .catch(err => console.error(err))
      .finally(() => setDetailLoading(false));
  };

  const handleReceivePayment = (id) => {
    if (!confirm('Tandai sebagai sudah dibayar (Lunas)?')) return;
    // Assuming backend endpoint for updating status exists or we use put to update payment
    fetch(`${API_BASE}/master/penjualan/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status_penjualan: 'Selesai', jenis_pembayaran: 'Tunai' }) // Convert Credit to Tunai
    })
      .then(r => r.json())
      .then(result => {
        if (result.status) {
          alert('Pembayaran berhasil diterima!');
          // Refresh data
          fetch(`${API_BASE}/master/penjualan?jenis_pembayaran=Kredit`)
            .then(r => r.json())
            .then(res => { if (res.status) setSales(res.data || []); });
        }
      });
  };

  const filtered = search ? sales.filter(s => (s.nama_pelanggan || '').toLowerCase().includes(search.toLowerCase()) || s.no_invoice.toLowerCase().includes(search.toLowerCase())) : sales;
  const totalPiutang = filtered.reduce((s, r) => s + parseFloat(r.total_bayar || 0), 0);

  return (
    <div className="animate-unt-fade">
      <PageHeader title="Piutang Usaha" subtitle="Daftar piutang dari penjualan kredit kepada pelanggan."
        breadcrumbs={[{ label: 'Keuangan', path: '/keuangan' }, { label: 'Piutang Usaha' }]} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Total Piutang</span>
          <p className="text-xl font-extrabold text-orange-600">{fmt(totalPiutang)}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Jumlah Invoice</span>
          <p className="text-xl font-extrabold text-blue-600">{filtered.length}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Pelanggan</span>
          <p className="text-xl font-extrabold text-gray-600">{new Set(filtered.map(s => s.pelanggan_id).filter(Boolean)).size}</p>
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari pelanggan, invoice..."
              className="pl-9 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 dark:border-gray-800">
              {['No.', 'Tanggal', 'No. Invoice', 'Pelanggan', 'Total Piutang', 'Status', 'Aksi'].map((h, i) => (
                <th key={i} className="py-2.5 px-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">Memuat data...</td></tr>
              : filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                  <FiAlertCircle className="mx-auto mb-2 text-gray-300" size={24} />
                  Tidak ada piutang usaha
                </td></tr>
              ) : filtered.map((s, i) => (
                <tr key={s.id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 text-xs font-bold text-gray-400">{i+1}</td>
                  <td className="py-2.5 px-3 text-xs text-gray-500 whitespace-nowrap">{fmtDate(s.tanggal_penjualan).split(',')[0]}</td>
                  <td className="py-2.5 px-3 text-xs font-bold text-primary-600 font-mono">{s.no_invoice}</td>
                  <td className="py-2.5 px-3 text-xs font-medium text-gray-700 dark:text-gray-300">{s.nama_pelanggan || 'Umum'}</td>
                  <td className="py-2.5 px-3 text-xs font-bold text-orange-600 tabular-nums">{fmt(s.total_bayar)}</td>
                  <td className="py-2.5 px-3"><span className="text-[10px] font-bold px-2 py-0.5 rounded bg-yellow-50 text-yellow-600 border border-yellow-200">Terhutang</span></td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openDetail(s.id)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="Lihat Detail">
                        <FiEye size={14} />
                      </button>
                      <button onClick={() => handleReceivePayment(s.id)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Terima Pembayaran">
                        <FiCheckCircle size={14} />
                      </button>
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
        title="Rincian Invoice Piutang"
        maxWidth="max-w-[700px]"
      >
        {selectedSale && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
               <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Invoice</span>
                  <p className="text-sm font-bold text-primary-600 font-mono italic">{selectedSale.no_invoice}</p>
               </div>
               <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pelanggan</span>
                  <p className="text-sm font-semibold">{selectedSale.nama_pelanggan || 'Umum'}</p>
               </div>
               <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tanggal Transaksi</span>
                  <p className="text-sm font-semibold">{fmtDate(selectedSale.tanggal_penjualan)}</p>
               </div>
               <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Piutang</span>
                  <p className="text-lg font-black text-orange-600 tabular-nums">{fmt(selectedSale.total_bayar)}</p>
               </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Item Produk</h4>
              <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-950">
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="py-2 px-3 text-left text-[10px] font-bold text-gray-400 uppercase">Produk</th>
                      <th className="py-2 px-3 text-center text-[10px] font-bold text-gray-400 uppercase">Qty</th>
                      <th className="py-2 px-3 text-right text-[10px] font-bold text-gray-400 uppercase">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-900">
                    {(selectedSale.items || []).map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="py-2.5 px-3 text-xs font-medium">{item.nama_produk}</td>
                        <td className="py-2.5 px-3 text-xs text-center font-bold">{item.jumlah_jual}</td>
                        <td className="py-2.5 px-3 text-xs text-right font-bold tabular-nums">{fmt(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
               <button onClick={() => setSelectedSale(null)} className="px-5 py-2 text-gray-500 hover:text-gray-700 text-xs font-bold">Tutup</button>
               <button onClick={() => handleReceivePayment(selectedSale.id)} className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-green-600/20 transition-all">Terima Pembayaran</button>
            </div>
          </div>
        )}
      </ModalDialog>
    </div>
  );
}
