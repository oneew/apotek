import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiUser } from 'react-icons/fi';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:8080/api';

export default function KontakDokter() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nama_dokter: '', spesialisasi: 'Umum', no_izin_praktek: '', no_telepon: '' });

  const spesialisasiOptions = [
    'Umum', 'Spesialis Penyakit Dalam', 'Spesialis Anak', 'Spesialis Bedah',
    'Spesialis Kandungan', 'Spesialis Jantung', 'Spesialis Tulang', 'Spesialis Kulit',
    'Spesialis Mata', 'Spesialis THT', 'Spesialis Jiwa', 'Spesialis Gizi',
    'Dokter Gigi', 'Dokter Gigi Spesialis'
  ];

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/master/dokter`);
      const result = await res.json();
      if (result.status) setData(result.data || []);
    } catch (e) { console.error('Gagal memuat dokter:', e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    if (!form.nama_dokter.trim()) {
      Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Nama dokter wajib diisi!', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/master/dokter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const result = await res.json();
      if (result.status) {
        Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Data dokter berhasil disimpan.', timer: 1500, showConfirmButton: false });
        setShowModal(false);
        setForm({ nama_dokter: '', spesialisasi: 'Umum', no_izin_praktek: '', no_telepon: '' });
        loadData();
      } else {
        Swal.fire({ icon: 'error', title: 'Gagal', text: result.message || 'Terjadi kesalahan.' });
      }
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error Koneksi', text: 'Tidak dapat menghubungi server.' });
    }
  };

  const filtered = data.filter(d =>
    d.nama_dokter?.toLowerCase().includes(search.toLowerCase()) ||
    d.spesialisasi?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
            <FiUser size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Daftar Dokter</h1>
            <p className="text-xs text-gray-400">Kelola data dokter penulis resep</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-lg transition-all shadow-md shadow-teal-500/20 active:scale-95"
        >
          <FiPlus size={14} />
          Dokter Baru
        </button>
      </div>

      {/* Search & Stats */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau spesialisasi..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Dokter</p>
          <h3 className="text-2xl font-extrabold text-teal-600">{data.length}</h3>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
            <tr>
              {['No.', 'Nama Dokter', 'Spesialisasi', 'No. Izin Praktek', 'Telepon', 'Aksi'].map((h, i) => (
                <th key={i} className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
            {loading ? (
              <tr><td colSpan="6" className="px-4 py-16 text-center text-gray-400 text-sm">Memuat data...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="6" className="px-4 py-16 text-center">
                <div className="flex flex-col items-center gap-3 text-gray-300">
                  <FiUser size={40} className="opacity-30" />
                  <p className="text-sm font-medium text-gray-400">Belum ada data dokter</p>
                  <button onClick={() => setShowModal(true)} className="text-teal-600 text-xs font-bold hover:underline">+ Tambah Dokter</button>
                </div>
              </td></tr>
            ) : filtered.map((d, i) => (
              <tr key={d.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-950/50 transition-all">
                <td className="px-4 py-3 text-xs text-gray-400 font-bold">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-teal-50 dark:bg-teal-900/30 rounded-lg flex items-center justify-center shrink-0">
                      <FiUser size={13} className="text-teal-600" />
                    </div>
                    <span className="font-semibold text-sm text-gray-800 dark:text-white">{d.nama_dokter}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs font-medium px-2 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-md">{d.spesialisasi}</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600 font-mono">{d.no_izin_praktek || '-'}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{d.no_telepon || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"><FiEdit2 size={13} /></button>
                    <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><FiTrash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-unt-fade">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-5">Tambah Dokter Baru</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Nama Dokter *</label>
                <input
                  type="text"
                  value={form.nama_dokter}
                  onChange={(e) => setForm({ ...form, nama_dokter: e.target.value })}
                  placeholder="dr. Nama Lengkap, Sp.XX"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Spesialisasi</label>
                <select
                  value={form.spesialisasi}
                  onChange={(e) => setForm({ ...form, spesialisasi: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500"
                >
                  {spesialisasiOptions.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">No. Izin Praktek (SIP)</label>
                  <input
                    type="text"
                    value={form.no_izin_praktek}
                    onChange={(e) => setForm({ ...form, no_izin_praktek: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">No. Telepon</label>
                  <input
                    type="tel"
                    value={form.no_telepon}
                    onChange={(e) => setForm({ ...form, no_telepon: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-500 font-medium hover:text-gray-700">Batal</button>
              <button onClick={handleSave} className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-lg transition-all">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
