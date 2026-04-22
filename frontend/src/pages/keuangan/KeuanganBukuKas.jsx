import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import ModalDialog from '../../components/ui/ModalDialog';
import { FiSearch, FiRefreshCw, FiDollarSign, FiArrowUpRight, FiArrowDownRight, FiEye, FiFileText, FiUser, FiTruck } from 'react-icons/fi';

const API_BASE = 'http://localhost:8080/api';

export default function KeuanganBukuKas() {
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [manualArus, setManualArus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isEntriOpen, setIsEntriOpen] = useState(false);
  const [entriData, setEntriData] = useState({ jenis: 'Keluar', kategori: '', keterangan: '', jumlah: '' });
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeType, setActiveType] = useState(null); // 'S', 'P', or 'M' (Manual)

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE}/master/penjualan?status=Selesai`).then(r => r.json()),
      fetch(`${API_BASE}/master/pembelian`).then(r => r.json()),
      fetch(`${API_BASE}/master/arus-kas`).then(r => r.json()),
    ]).then(([sRes, pRes, mRes]) => {
      if (sRes.status) setSales(sRes.data || []);
      if (pRes.status) setPurchases(pRes.data || []);
      if (mRes.status) setManualArus(mRes.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const fmt = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0);
  const fmtDate = (d) => { try { return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return d; } };

  // Combine all types of movements
  const entries = [
    ...sales.map(s => ({ id: s.id, rawId: s.id, type: 'S', tanggal: s.tanggal_penjualan, jenis: 'Pemasukan', keterangan: `Penjualan ${s.no_invoice}`, pihak: s.nama_pelanggan || 'Umum', masuk: parseFloat(s.total_bayar) || 0, keluar: 0 })),
    ...purchases.map(p => ({ id: p.id, rawId: p.id, type: 'P', tanggal: p.tanggal_faktur || p.created_at, jenis: 'Pengeluaran', keterangan: `Pembelian ${p.no_faktur}`, pihak: p.nama_supplier || '-', masuk: 0, keluar: parseFloat(p.total) || 0 })),
    ...manualArus.map(m => ({ id: `M-${m.id}`, rawId: m.id, type: 'M', tanggal: m.tanggal, jenis: m.jenis === 'Masuk' ? 'Pemasukan' : 'Pengeluaran', keterangan: `[${m.kategori}] ${m.keterangan}`, pihak: '-', masuk: m.jenis === 'Masuk' ? parseFloat(m.jumlah) : 0, keluar: m.jenis === 'Keluar' ? parseFloat(m.jumlah) : 0 })),
  ].sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

  const handleSaveEntri = (e) => {
    e.preventDefault();
    fetch(`${API_BASE}/master/arus-kas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...entriData, tanggal: new Date().toISOString() })
    })
      .then(r => r.json())
      .then(res => {
        if (res.status) {
          setIsEntriOpen(false);
          setEntriData({ jenis: 'Keluar', kategori: '', keterangan: '', jumlah: '' });
          fetchData();
        }
      });
  };

  const openDetail = (id, type) => {
    if (type === 'M') return; // Manual entries don't have separate item details yet
    setDetailLoading(true);
    setActiveType(type);
    const endpoint = type === 'S' ? `master/penjualan/${id}` : `master/pembelian/${id}`;
    fetch(`${API_BASE}/${endpoint}`)
      .then(r => r.json())
      .then(result => { if (result.status) setSelectedDetail(result.data); })
      .catch(err => console.error(err))
      .finally(() => setDetailLoading(false));
  };

  const filtered = search ? entries.filter(e => e.keterangan.toLowerCase().includes(search.toLowerCase()) || e.pihak.toLowerCase().includes(search.toLowerCase())) : entries;
  const totalMasuk = entries.reduce((s, e) => s + e.masuk, 0);
  const totalKeluar = entries.reduce((s, e) => s + e.keluar, 0);

  return (
    <div className="animate-unt-fade">
      <PageHeader title="Buku Kas" subtitle="Catatan arus kas masuk dan keluar apotek."
        breadcrumbs={[{ label: 'Keuangan', path: '/keuangan' }, { label: 'Buku Kas' }]} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-gray-400 uppercase">Uang Masuk</span><FiArrowUpRight size={14} className="text-green-500" /></div>
          <span className="text-xl font-extrabold text-green-600">{fmt(totalMasuk)}</span>
          <p className="text-[10px] text-gray-400 mt-1">{sales.length} transaksi penjualan</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-gray-400 uppercase">Uang Keluar</span><FiArrowDownRight size={14} className="text-red-500" /></div>
          <span className="text-xl font-extrabold text-red-500">{fmt(totalKeluar)}</span>
          <p className="text-[10px] text-gray-400 mt-1">{purchases.length} transaksi pembelian</p>
        </div>
        <div className={`${totalMasuk - totalKeluar >= 0 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'} border rounded-xl p-4`}>
          <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-gray-400 uppercase">Saldo Bersih</span><FiDollarSign size={14} className={totalMasuk - totalKeluar >= 0 ? 'text-blue-500' : 'text-red-500'} /></div>
          <span className={`text-xl font-extrabold ${totalMasuk - totalKeluar >= 0 ? 'text-blue-600' : 'text-red-500'}`}>{fmt(totalMasuk - totalKeluar)}</span>
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <form onSubmit={e => { e.preventDefault(); }} className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari transaksi..."
              className="pl-9 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all" />
          </form>
          <button onClick={() => setIsEntriOpen(true)} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-bold shadow-lg shadow-primary-600/20 transition-all flex items-center gap-2">
            <FiRefreshCw size={14} /> Entri Kas Baru
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 dark:border-gray-800">
              {['No.', 'Tanggal', 'Jenis', 'Keterangan', 'Pihak', 'Uang Masuk', 'Uang Keluar', 'Aksi'].map((h, i) => (
                <th key={i} className="py-2.5 px-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={7} className="py-12 text-center text-gray-400 text-sm">Memuat data...</td></tr>
              : filtered.length === 0 ? <tr><td colSpan={7} className="py-12 text-center text-gray-400 text-sm">Tidak ada data</td></tr>
              : filtered.map((e, i) => (
                <tr key={e.id} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 text-xs font-bold text-gray-400">{i+1}</td>
                  <td className="py-2.5 px-3 text-xs text-gray-500 whitespace-nowrap">{fmtDate(e.tanggal).split(',')[0]}</td>
                  <td className="py-2.5 px-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${e.jenis === 'Pemasukan' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{e.jenis}</span></td>
                  <td className="py-2.5 px-3 text-xs font-medium text-gray-700 dark:text-gray-300">{e.keterangan}</td>
                  <td className="py-2.5 px-3 text-xs text-gray-500">{e.pihak}</td>
                  <td className="py-2.5 px-3 text-xs font-bold text-green-600 tabular-nums">{e.masuk > 0 ? fmt(e.masuk) : '-'}</td>
                  <td className="py-2.5 px-3 text-xs font-bold text-red-500 tabular-nums">{e.keluar > 0 ? fmt(e.keluar) : '-'}</td>
                  <td className="py-2.5 px-3">
                    {e.type !== 'M' && (
                      <button onClick={() => openDetail(e.rawId, e.type)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="Lihat Detail">
                        <FiEye size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detail Modal */}
      <ModalDialog
        isOpen={!!selectedDetail}
        onClose={() => { setSelectedDetail(null); setActiveType(null); }}
        title={activeType === 'S' ? "Detail Penjualan" : "Detail Pembelian"}
        maxWidth="max-w-[700px]"
      >
        {selectedDetail && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Referensi</span>
                  <p className="text-sm font-bold text-primary-600 font-mono italic">{activeType === 'S' ? selectedDetail.no_invoice : selectedDetail.no_faktur}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tanggal</span>
                  <p className="text-sm font-semibold">{fmtDate(activeType === 'S' ? selectedDetail.tanggal_penjualan : (selectedDetail.tanggal_pembelian || selectedDetail.created_at))}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pihak Terkait</span>
                  <p className="text-sm font-semibold flex items-center gap-2">
                    {activeType === 'S' ? <FiUser className="text-gray-400" /> : <FiTruck className="text-gray-400" />}
                    {activeType === 'S' ? (selectedDetail.nama_pelanggan || 'Umum') : (selectedDetail.nama_supplier || '-')}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Metode Pembayaran</span>
                  <div className="mt-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600">
                      {activeType === 'S' ? selectedDetail.jenis_pembayaran : (selectedDetail.status_pembayaran || 'Credit')}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Nilai</span>
                  <p className="text-lg font-black text-gray-900 dark:text-white tabular-nums">{fmt(activeType === 'S' ? selectedDetail.total_bayar : selectedDetail.grand_total)}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Rincian Item</h4>
              <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-950">
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="py-2 px-3 text-left text-[10px] font-bold text-gray-400 uppercase">Produk</th>
                      <th className="py-2 px-3 text-center text-[10px] font-bold text-gray-400 uppercase">Qty</th>
                      <th className="py-2 px-3 text-right text-[10px] font-bold text-gray-400 uppercase">Harga</th>
                      <th className="py-2 px-3 text-right text-[10px] font-bold text-gray-400 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-900">
                    {(selectedDetail.items || []).map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="py-2.5 px-3">
                          <p className="text-xs font-semibold">{item.nama_produk}</p>
                          <p className="text-[10px] text-gray-400">{item.nama_satuan || '-'}</p>
                        </td>
                        <td className="py-2.5 px-3 text-xs text-center font-bold">{activeType === 'S' ? item.jumlah_jual : item.jumlah_beli}</td>
                        <td className="py-2.5 px-3 text-xs text-right text-gray-500 tabular-nums">{fmt(activeType === 'S' ? item.harga_jual_per_satuan : item.harga_beli_per_satuan)}</td>
                        <td className="py-2.5 px-3 text-xs text-right font-bold tabular-nums">{fmt(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button onClick={() => setSelectedDetail(null)} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all">Tutup</button>
            </div>
          </div>
        )}
      </ModalDialog>

      {/* Modal Entri Kas Baru */}
      <ModalDialog
        isOpen={isEntriOpen}
        onClose={() => setIsEntriOpen(false)}
        title="Entri Kas Baru"
        maxWidth="max-w-[400px]"
      >
        <form onSubmit={handleSaveEntri} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Jenis Transaksi</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setEntriData({...entriData, jenis: 'Keluar'})} className={`py-2 text-xs font-bold rounded-lg border transition-all ${entriData.jenis === 'Keluar' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>Pengeluaran</button>
              <button type="button" onClick={() => setEntriData({...entriData, jenis: 'Masuk'})} className={`py-2 text-xs font-bold rounded-lg border transition-all ${entriData.jenis === 'Masuk' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>Pemasukan</button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Kategori</label>
            <input type="text" value={entriData.kategori} onChange={e => setEntriData({...entriData, kategori: e.target.value})} placeholder="e.g. Operasional, Listrik, Donasi" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all" required />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Keterangan</label>
            <textarea value={entriData.keterangan} onChange={e => setEntriData({...entriData, keterangan: e.target.value})} placeholder="Deskripsi transaksi..." className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all h-20" required />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Jumlah (IDR)</label>
            <input type="number" value={entriData.jumlah} onChange={e => setEntriData({...entriData, jumlah: e.target.value})} placeholder="0" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-black focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 transition-all" required />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsEntriOpen(false)} className="px-5 py-2 text-gray-500 hover:text-gray-700 text-xs font-bold">Batal</button>
            <button type="submit" className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-primary-600/20 transition-all">Simpan Entri</button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
}
