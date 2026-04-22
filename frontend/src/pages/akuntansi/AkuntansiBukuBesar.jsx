import React, { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Card from '../../components/ui/Card';
import ModalDialog from '../../components/ui/ModalDialog';
import { FiDollarSign, FiArrowUpRight, FiArrowDownRight, FiBook, FiEye, FiUser, FiTruck } from 'react-icons/fi';

const API_BASE = 'http://localhost:8080/api';

export default function AkuntansiBukuBesar() {
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [manualArus, setManualArus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAkun, setSelectedAkun] = useState('Kas');
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [activeType, setActiveType] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/master/penjualan?status=Selesai`).then(r => r.json()),
      fetch(`${API_BASE}/master/pembelian`).then(r => r.json()),
      fetch(`${API_BASE}/master/arus-kas`).then(r => r.json()),
    ]).then(([sRes, pRes, mRes]) => {
      if (sRes.status) setSales(sRes.data || []);
      if (pRes.status) setPurchases(pRes.data || []);
      if (mRes.status) setManualArus(mRes.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const openDetail = (id, type) => {
    if (type === 'M') return;
    setDetailLoading(true);
    setActiveType(type);
    const endpoint = type === 'S' ? `master/penjualan/${id}` : `master/pembelian/${id}`;
    fetch(`${API_BASE}/${endpoint}`)
      .then(r => r.json())
      .then(result => { if (result.status) setSelectedDetail(result.data); })
      .catch(err => console.error(err))
      .finally(() => setDetailLoading(false));
  };

  const fmt = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v || 0);
  const fmtDate = (d) => { try { return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return d; } };

  // Build general ledger entries for Kas account
  const entries = [
    ...sales.map(s => ({ rawId: s.id, type: 'S', tanggal: s.tanggal_penjualan, uraian: `Penjualan ${s.no_invoice}`, ref: s.no_invoice, debit: parseFloat(s.total_bayar) || 0, kredit: 0 })),
    ...purchases.map(p => ({ rawId: p.id, type: 'P', tanggal: p.tanggal_faktur || p.created_at, uraian: `Pembelian ${p.no_faktur}`, ref: p.no_faktur, debit: 0, kredit: parseFloat(p.total) || 0 })),
    ...manualArus.map(m => ({ rawId: m.id, type: 'M', tanggal: m.tanggal, uraian: `[${m.kategori}] ${m.keterangan}`, ref: '-', debit: m.jenis === 'Masuk' ? parseFloat(m.jumlah) : 0, kredit: m.jenis === 'Keluar' ? parseFloat(m.jumlah) : 0 })),
  ].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

  let saldoBerjalan = 0;
  const ledger = entries.map(e => {
    saldoBerjalan += e.debit - e.kredit;
    return { ...e, saldo: saldoBerjalan };
  });

  const totalDebit = entries.reduce((s, e) => s + e.debit, 0);
  const totalKredit = entries.reduce((s, e) => s + e.kredit, 0);

  const akunOptions = ['Kas', 'Pendapatan Penjualan', 'Beban Pembelian'];

  return (
    <div className="animate-unt-fade">
      <PageHeader title="Buku Besar" subtitle="General Ledger - Catatan per akun akuntansi."
        breadcrumbs={[{ label: 'Akuntansi', path: '/akuntansi' }, { label: 'Buku Besar' }]}
        badge={{ text: 'PRO', variant: 'primary' }} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-gray-400 uppercase">Total Debit</span><FiArrowUpRight size={14} className="text-green-500" /></div>
          <span className="text-xl font-extrabold text-green-600">{fmt(totalDebit)}</span>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-gray-400 uppercase">Total Kredit</span><FiArrowDownRight size={14} className="text-red-500" /></div>
          <span className="text-xl font-extrabold text-red-500">{fmt(totalKredit)}</span>
        </div>
        <div className={`${saldoBerjalan >= 0 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'} border rounded-xl p-4`}>
          <div className="flex items-center justify-between mb-1"><span className="text-[10px] font-bold text-gray-400 uppercase">Saldo Akhir</span><FiBook size={14} /></div>
          <span className={`text-xl font-extrabold ${saldoBerjalan >= 0 ? 'text-blue-600' : 'text-red-500'}`}>{fmt(saldoBerjalan)}</span>
        </div>
      </div>

      <Card>
        <div className="mb-4">
          <span className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Pilih Akun</span>
          <select value={selectedAkun} onChange={e => setSelectedAkun(e.target.value)}
            className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-100">
            {akunOptions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 dark:border-gray-800">
              {['Tanggal', 'Uraian', 'Ref', 'Debit', 'Kredit', 'Saldo', 'Aksi'].map((h, i) => (
                <th key={i} className="py-2.5 px-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">Memuat data...</td></tr>
              : ledger.length === 0 ? <tr><td colSpan={6} className="py-12 text-center text-gray-400 text-sm">Tidak ada entri</td></tr>
              : ledger.map((e, i) => (
                <tr key={i} className="border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 text-xs text-gray-500 whitespace-nowrap">{fmtDate(e.tanggal)}</td>
                  <td className="py-2.5 px-3 text-xs font-medium text-gray-700 dark:text-gray-300">{e.uraian}</td>
                  <td className="py-2.5 px-3 text-xs text-gray-400 font-mono">{e.ref}</td>
                  <td className="py-2.5 px-3 text-xs font-bold text-green-600 tabular-nums">{e.debit > 0 ? fmt(e.debit) : '-'}</td>
                  <td className="py-2.5 px-3 text-xs font-bold text-red-500 tabular-nums">{e.kredit > 0 ? fmt(e.kredit) : '-'}</td>
                  <td className="py-2.5 px-3 text-xs font-bold tabular-nums text-right"><span className={e.saldo >= 0 ? 'text-blue-600' : 'text-red-500'}>{fmt(e.saldo)}</span></td>
                  <td className="py-2.5 px-3 text-xs">
                    {e.type !== 'M' && (
                      <button onClick={() => openDetail(e.rawId, e.type)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="Lihat Detail">
                        <FiEye size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {ledger.length > 0 && (
                <tr className="border-t-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950">
                  <td colSpan={3} className="py-2.5 px-3 text-xs font-bold text-gray-900 dark:text-white">TOTAL</td>
                  <td className="py-2.5 px-3 text-xs font-extrabold text-green-600 tabular-nums">{fmt(totalDebit)}</td>
                  <td className="py-2.5 px-3 text-xs font-extrabold text-red-500 tabular-nums">{fmt(totalKredit)}</td>
                  <td className="py-2.5 px-3 text-xs font-extrabold text-right tabular-nums"><span className={saldoBerjalan >= 0 ? 'text-blue-600' : 'text-red-500'}>{fmt(saldoBerjalan)}</span></td>
                  <td className="bg-gray-50 dark:bg-gray-950"></td>
                </tr>
              )}
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
                      <th className="py-2 px-3 text-right text-[10px] font-bold text-gray-400 uppercase">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-900">
                    {(selectedDetail.items || []).map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="py-2.5 px-3 text-xs font-semibold">{item.nama_produk}</td>
                        <td className="py-2.5 px-3 text-xs text-center font-bold">{activeType === 'S' ? item.jumlah_jual : item.jumlah_beli}</td>
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
    </div>
  );
}
