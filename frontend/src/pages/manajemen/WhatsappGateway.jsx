import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import { FiMessageCircle, FiSettings, FiSend, FiCheck, FiX, FiList, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import Swal from 'sweetalert2';

const API = 'http://localhost:8080/api/master';

const statusBadge = (status) => {
  const map = { sent: ['bg-success-50 text-success-700', 'Terkirim'], failed: ['bg-error-50 text-error-700', 'Gagal'], pending: ['bg-warning-50 text-warning-700', 'Pending'] };
  const [cls, label] = map[status] ?? ['bg-gray-100 text-gray-600', status];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${cls}`}>{label}</span>;
};

export default function WhatsappGateway() {
  const [config, setConfig] = useState({ fonnte_token: '', nomor_manajer: '', notif_stok_aktif: '1', notif_struk_aktif: '1' });
  const [logs, setLogs] = useState([]);
  const [testNomor, setTestNomor] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');

  useEffect(() => {
    fetch(`${API}/whatsapp/settings`).then(r => r.json()).then(r => { if (r.status) setConfig(r.data); });
    fetch(`${API}/whatsapp/log`).then(r => r.json()).then(r => { if (r.status) setLogs(r.data); });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const r = await fetch(`${API}/whatsapp/settings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });
    const res = await r.json();
    setIsSaving(false);
    Swal.fire({ icon: res.status ? 'success' : 'error', title: res.status ? 'Tersimpan!' : 'Gagal', text: res.message, timer: 2000, showConfirmButton: false });
  };

  const handleTest = async () => {
    if (!testNomor) return;
    setIsTesting(true);
    const res = await fetch(`${API}/whatsapp/test`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nomor: testNomor }) }).then(r => r.json());
    setIsTesting(false);
    Swal.fire({ icon: res.status ? 'success' : 'warning', title: res.status ? '✅ Pesan Terkirim!' : '⚠️ Gagal Kirim', text: res.message });
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-20">
      <SectionHeader
        title="WhatsApp Gateway"
        subtitle="Otomatiskan notifikasi bisnis: struk digital, alert stok kritis, dan broadcast promo."
        icon={<FiMessageCircle size={24} className="text-gray-500" />}
        badges={[{ label: 'Powered by Fonnte', color: 'bg-success-50 text-success-700 border border-success-200' }]}
      />

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl w-fit">
        {[['settings', FiSettings, 'Konfigurasi'], ['log', FiList, 'Riwayat Pesan']].map(([id, Icon, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === id ? 'bg-white shadow text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}>
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Config Card */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight flex items-center gap-2">
              <FiSettings className="text-primary-600" /> Konfigurasi API Fonnte
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase">API Token Fonnte</label>
                <input type="password" value={config.fonnte_token || ''} onChange={e => setConfig({ ...config, fonnte_token: e.target.value })} placeholder="Masukkan token dari fonnte.com..." className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500 font-mono" />
                <p className="text-[10px] text-gray-400">Dapatkan token dari <a href="https://fonnte.com" target="_blank" rel="noreferrer" className="text-primary-600 font-bold hover:underline">fonnte.com</a> dengan akun yang sudah terhubung ke nomor WhatsApp bisnis.</p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 uppercase">Nomor Manajer / Admin</label>
                <input type="text" value={config.nomor_manajer || ''} onChange={e => setConfig({ ...config, nomor_manajer: e.target.value })} placeholder="628xxxxxxxxxx" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[['notif_struk_aktif', 'Struk Digital Otomatis'], ['notif_stok_aktif', 'Alert Stok Kritis']].map(([key, label]) => (
                  <label key={key} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:border-primary-300 transition-all">
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                    <div onClick={() => setConfig({ ...config, [key]: config[key] === '1' ? '0' : '1' })} className={`w-10 h-5 rounded-full transition-all cursor-pointer relative ${config[key] === '1' ? 'bg-primary-600' : 'bg-gray-300'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${config[key] === '1' ? 'left-5' : 'left-0.5'}`} />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button onClick={handleSave} disabled={isSaving} className="px-8 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs uppercase rounded-lg transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2">
                {isSaving ? <FiRefreshCw className="animate-spin" size={13} /> : <FiCheck size={13} />} Simpan Konfigurasi
              </button>
            </div>
          </div>

          {/* Test Panel */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-tight flex items-center gap-2">
              <FiSend className="text-primary-600" /> Uji Koneksi
            </h3>
            <div className="p-4 bg-warning-50 border border-warning-200 rounded-xl">
              <p className="text-[11px] text-warning-700 font-semibold flex items-start gap-2"><FiAlertCircle size={12} className="mt-0.5 shrink-0" />Pastikan token Fonnte sudah disimpan sebelum melakukan uji pengiriman.</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase">Nomor Tujuan Uji</label>
              <input type="text" value={testNomor} onChange={e => setTestNomor(e.target.value)} placeholder="628xxxxxxxxxx" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500" />
            </div>
            <button onClick={handleTest} disabled={isTesting || !testNomor} className="w-full py-2.5 bg-success-600 hover:bg-success-700 text-white font-bold text-xs uppercase rounded-lg transition-all active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
              {isTesting ? <FiRefreshCw className="animate-spin" size={13} /> : <FiSend size={13} />} Kirim Pesan Uji
            </button>
          </div>
        </div>
      )}

      {activeTab === 'log' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
              <tr>{['Tujuan', 'Tipe', 'Pesan', 'Status', 'Waktu'].map(h => <th key={h} className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-wider">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {logs.length === 0 ? (
                <tr><td colSpan={5} className="py-16 text-center text-gray-400 italic">Belum ada riwayat pengiriman.</td></tr>
              ) : logs.map((log, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-gray-800 dark:text-gray-100">{log.nomor_tujuan}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full text-[9px] font-bold uppercase">{log.tipe}</span></td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 max-w-xs truncate">{log.pesan}</td>
                  <td className="px-4 py-3">{statusBadge(log.status)}</td>
                  <td className="px-4 py-3 text-gray-400">{log.created_at ? new Date(log.created_at).toLocaleString('id-ID') : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
