import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import ModalDialog from '../../components/ui/ModalDialog';
import { FiSearch, FiDollarSign, FiTruck, FiAlertCircle, FiEye, FiCheckCircle, FiFileText, FiCalendar } from 'react-icons/fi';

const API_BASE = 'http://localhost:8080/api';

export default function KeuanganUtangUsaha() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/master/pembelian`)
      .then(r => r.json())
      .then(result => {
        if (result.status) {
          // Show purchases with status != Lunas as outstanding debt
          const utang = (result.data || []).filter(p => p.status !== 'Lunas');
          setPurchases(utang);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const fmt = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0);
  const fmtDate = (d) => { try { return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return d; } };

  const openDetail = (id) => {
    setDetailLoading(true);
    fetch(`${API_BASE}/master/pembelian/${id}`)
      .then(r => r.json())
      .then(result => { if (result.status) setSelectedPurchase(result.data); })
      .catch(err => console.error(err))
      .finally(() => setDetailLoading(false));
  };

  const handlePayDebt = (id) => {
    if (!confirm('Tandai tagihan ini sebagai sudah dibayar (Lunas)?')) return;
    // Update status_pembayaran to Lunas
    fetch(`${API_BASE}/master/pembelian/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status_pembayaran: 'Lunas' })
    })
      .then(r => r.json())
      .then(result => {
        if (result.status) {
          alert('Pembayaran berhasil dicatat!');
          // Refresh list
          fetch(`${API_BASE}/master/pembelian`)
            .then(r => r.json())
            .then(res => {
              if (res.status) {
                const utang = (res.data || []).filter(p => p.status_pembayaran !== 'Lunas');
                setPurchases(utang);
              }
            });
        }
      });
  };

  const filtered = search ? purchases.filter(p => (p.nama_supplier || '').toLowerCase().includes(search.toLowerCase()) || (p.no_faktur || '').toLowerCase().includes(search.toLowerCase())) : purchases;
  const totalUtang = filtered.reduce((s, r) => s + parseFloat(r.total || 0), 0);

  return (
    <div className="animate-unt-fade">
      <PageHeader title="Utang Usaha" subtitle="Daftar utang kepada supplier dari pembelian."
        breadcrumbs={[{ label: 'Keuangan', path: '/keuangan' }, { label: 'Utang Usaha' }]} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Total Utang</span>
          <p className="text-xl font-extrabold text-red-500">{fmt(totalUtang)}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Jumlah Faktur</span>
          <p className="text-xl font-extrabold text-blue-600">{filtered.length}</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-xl p-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Supplier</span>
          <p className="text-xl font-extrabold text-purple-600">{new Set(filtered.map(p => p.supplier_id).filter(Boolean)).size}</p>
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari supplier, faktur..."
              className="pl-9 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 dark:border-gray-800">
              {['No.', 'Tanggal', 'No. Faktur', 'Supplier', 'Total Utang', 'Status', 'Aksi'].map((h, i) => (
                <th key={i} className="py-2.5 px-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">Memuat data...</td></tr>
              : filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">
                  <FiAlertCircle className="mx-auto mb-2 text-gray-300" size={24} />
                  Tidak ada utang usaha
                </td></tr>
              ) : filtered.map((p, i) => (
                <tr key={p.id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 text-xs font-bold text-gray-400">{i+1}</td>
                  <td className="py-2.5 px-3 text-xs text-gray-500 whitespace-nowrap">{fmtDate(p.tanggal_faktur || p.created_at).split(',')[0]}</td>
                  <td className="py-2.5 px-3 text-xs font-bold text-primary-600 font-mono">{p.no_faktur}</td>
                  <td className="py-2.5 px-3 text-xs font-medium text-gray-700 dark:text-gray-300">{p.nama_supplier || '-'}</td>
                  <td className="py-2.5 px-3 text-xs font-bold text-red-500 tabular-nums">{fmt(p.total)}</td>
                  <td className="py-2.5 px-3"><span className="text-[10px] font-bold px-2 py-0.5 rounded bg-yellow-50 text-yellow-600 border border-yellow-200">{p.status_pembayaran || 'Belum Lunas'}</span></td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openDetail(p.id)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="Lihat Detail">
                        <FiEye size={14} />
                      </button>
                      <button onClick={() => handlePayDebt(p.id)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Bayar Tagihan">
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
        isOpen={!!selectedPurchase}
        onClose={() => setSelectedPurchase(null)}
        title="Rincian Faktur Pembelian"
        maxWidth="max-w-[700px]"
      >
        {selectedPurchase && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
               <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">No. Faktur</span>
                  <p className="text-sm font-bold text-primary-600 font-mono italic">{selectedPurchase.no_faktur}</p>
               </div>
               <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Supplier</span>
                  <p className="text-sm font-semibold">{selectedPurchase.nama_supplier || '-'}</p>
               </div>
               <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tanggal Terima</span>
                  <p className="text-sm font-semibold">{fmtDate(selectedPurchase.tanggal_pembelian || selectedPurchase.created_at)}</p>
               </div>
               <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Tagihan</span>
                  <p className="text-lg font-black text-red-500 tabular-nums">{fmt(selectedPurchase.grand_total)}</p>
               </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Daftar Produk Diterima</h4>
              <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-950">
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="py-2 px-3 text-left text-[10px] font-bold text-gray-400 uppercase">Produk</th>
                      <th className="py-2 px-3 text-center text-[10px] font-bold text-gray-400 uppercase">Qty</th>
                      <th className="py-2 px-3 text-right text-[10px] font-bold text-gray-400 uppercase">Harga Beli</th>
                      <th className="py-2 px-3 text-right text-[10px] font-bold text-gray-400 uppercase">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-900">
                    {(selectedPurchase.items || []).map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="py-2.5 px-3 text-xs font-medium">{item.nama_produk}</td>
                        <td className="py-2.5 px-3 text-xs text-center font-bold">{item.jumlah_beli}</td>
                        <td className="py-2.5 px-3 text-xs text-right text-gray-500 tabular-nums">{fmt(item.harga_beli_per_satuan)}</td>
                        <td className="py-2.5 px-3 text-xs text-right font-bold tabular-nums">{fmt(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
               <button onClick={() => setSelectedPurchase(null)} className="px-5 py-2 text-gray-500 hover:text-gray-700 text-xs font-bold">Tutup</button>
               <button onClick={() => handlePayDebt(selectedPurchase.id)} className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 transition-all">Bayar Tagihan</button>
            </div>
          </div>
        )}
      </ModalDialog>
    </div>
  );
}
