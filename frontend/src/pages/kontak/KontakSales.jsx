import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiUsers, FiPhone, FiBriefcase } from 'react-icons/fi';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:8080/api';

export default function KontakSales() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    kode_sales: '',
    nama_sales: '',
    telepon: '',
    email: '',
    perusahaan: '',
    wilayah: '',
    status: 'Aktif'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/master/sales`);
      const result = await res.json();
      if (result.status) setData(result.data || []);
    } catch (e) {
      console.error('Gagal memuat data sales:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    if (!form.nama_sales.trim()) {
      Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Nama sales wajib diisi!', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/master/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const result = await res.json();
      if (result.status) {
        Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Data sales berhasil disimpan.', timer: 1500, showConfirmButton: false });
        setShowModal(false);
        setForm({ kode_sales: '', nama_sales: '', telepon: '', email: '', perusahaan: '', wilayah: '', status: 'Aktif' });
        loadData();
      } else {
        Swal.fire({ icon: 'error', title: 'Gagal', text: result.message || 'Terjadi kesalahan.' });
      }
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error Koneksi', text: 'Tidak dapat menghubungi server.' });
    }
  };

  const filtered = data.filter(d =>
    d.nama_sales?.toLowerCase().includes(search.toLowerCase()) ||
    d.kode_sales?.toLowerCase().includes(search.toLowerCase()) ||
    d.perusahaan?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <FiUsers size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Daftar Sales / Pelayan</h1>
            <p className="text-xs text-gray-400">Kelola data sales dan perwakilan distributor</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-all shadow-md active:scale-95"
        >
          <FiPlus size={14} />
          Sales Baru
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
            placeholder="Cari nama, kode, atau perusahaan..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Sales</p>
          <h3 className="text-2xl font-extrabold text-indigo-600">{data.length}</h3>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
            <tr>
              {['No.', 'Nama Sales', 'Perusahaan', 'Wilayah', 'Telepon', 'Status', 'Aksi'].map((h, i) => (
                <th key={i} className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
            {loading ? (
              <tr><td colSpan="7" className="px-4 py-16 text-center text-gray-400 text-sm">Memuat data...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="7" className="px-4 py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <FiUsers size={40} className="text-gray-200" />
                  <p className="text-sm font-medium text-gray-400">Belum ada data sales</p>
                  <button onClick={() => setShowModal(true)} className="text-indigo-600 text-xs font-bold hover:underline">+ Tambah Sales</button>
                </div>
              </td></tr>
            ) : filtered.map((s, i) => (
              <tr key={s.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-950/50 transition-all">
                <td className="px-4 py-3 text-xs text-gray-400 font-bold">{i + 1}</td>
                <td className="px-4 py-3">
                  <div>
                    <p className="font-semibold text-sm text-gray-800 dark:text-white">{s.nama_sales}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{s.kode_sales}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1"><FiBriefcase size={11} className="text-gray-400" /><span>{s.perusahaan || '-'}</span></div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">{s.wilayah || '-'}</td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1"><FiPhone size={11} className="text-gray-400" /><span>{s.telepon || '-'}</span></div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${s.status === 'Aktif' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {s.status || 'Aktif'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><FiEdit2 size={13} /></button>
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
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 animate-unt-fade">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-5">Tambah Sales Baru</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Kode Sales</label>
                  <input type="text" value={form.kode_sales} onChange={e => setForm({...form, kode_sales: e.target.value})} placeholder="SLS-001" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500">
                    <option>Aktif</option><option>Non-Aktif</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Nama Lengkap *</label>
                <input type="text" value={form.nama_sales} onChange={e => setForm({...form, nama_sales: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Telepon</label>
                  <input type="tel" value={form.telepon} onChange={e => setForm({...form, telepon: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Wilayah</label>
                  <input type="text" value={form.wilayah} onChange={e => setForm({...form, wilayah: e.target.value})} placeholder="Jakarta Selatan" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Perusahaan / Distributor</label>
                <input type="text" value={form.perusahaan} onChange={e => setForm({...form, perusahaan: e.target.value})} placeholder="PT. Kimia Farma Trading" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-500 font-medium">Batal</button>
              <button onClick={handleSave} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg transition-all">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
