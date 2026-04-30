import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiTruck, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:8080/api';

export default function KontakSupplier() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    kode_supplier: '',
    nama_supplier: '',
    badan_usaha: 'PT',
    telepon: '',
    email: '',
    alamat: '',
    batas_kredit: 0
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/master/supplier`);
      const result = await res.json();
      if (result.status) setData(result.data || []);
    } catch (e) { console.error('Gagal memuat supplier:', e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    if (!form.nama_supplier.trim()) {
      Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Nama supplier wajib diisi!', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/master/supplier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const result = await res.json();
      if (result.status) {
        Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Data supplier berhasil disimpan.', timer: 1500, showConfirmButton: false });
        setShowModal(false);
        setForm({ kode_supplier: '', nama_supplier: '', badan_usaha: 'PT', telepon: '', email: '', alamat: '', batas_kredit: 0 });
        loadData();
      } else {
        Swal.fire({ icon: 'error', title: 'Gagal', text: result.message || 'Terjadi kesalahan.' });
      }
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error Koneksi', text: 'Tidak dapat menghubungi server.' });
    }
  };

  const filtered = data.filter(d =>
    d.nama_supplier?.toLowerCase().includes(search.toLowerCase()) ||
    d.kode_supplier?.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <FiTruck size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Daftar Supplier</h1>
            <p className="text-xs text-gray-400">Kelola mitra supplier dan distributor apotek</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-lg transition-all shadow-md active:scale-95"
        >
          <FiPlus size={14} />
          Supplier Baru
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
            placeholder="Cari nama atau kode supplier..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Supplier</p>
          <h3 className="text-2xl font-extrabold text-orange-600">{data.length}</h3>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Memuat data supplier...</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-gray-300">
          <FiTruck size={48} className="opacity-30" />
          <p className="text-sm font-medium text-gray-400">Belum ada data supplier</p>
          <button onClick={() => setShowModal(true)} className="text-orange-600 text-xs font-bold hover:underline">+ Tambah Supplier</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <div key={s.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <FiTruck size={18} className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">{s.badan_usaha} {s.nama_supplier}</h3>
                    <span className="text-[10px] text-gray-400 font-mono">{s.kode_supplier}</span>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg"><FiEdit2 size={13} /></button>
                  <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><FiTrash2 size={13} /></button>
                </div>
              </div>
              <div className="space-y-1.5">
                {s.telepon && <div className="flex items-center gap-2 text-xs text-gray-500"><FiPhone size={11} /><span>{s.telepon}</span></div>}
                {s.email && <div className="flex items-center gap-2 text-xs text-gray-500"><FiMail size={11} /><span>{s.email}</span></div>}
                {s.alamat && <div className="flex items-start gap-2 text-xs text-gray-500"><FiMapPin size={11} className="mt-0.5 shrink-0" /><span className="line-clamp-2">{s.alamat}</span></div>}
                {s.batas_kredit > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs font-bold text-orange-600">{formatCurrency(s.batas_kredit)} batas kredit</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 animate-unt-fade">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-5">Tambah Supplier Baru</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Badan Usaha</label>
                  <select value={form.badan_usaha} onChange={e => setForm({ ...form, badan_usaha: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500">
                    <option>PT</option><option>CV</option><option>Perorangan</option><option>UD</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-600 mb-1">Nama Supplier *</label>
                  <input type="text" value={form.nama_supplier} onChange={e => setForm({...form, nama_supplier: e.target.value})} placeholder="Nama Perusahaan" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Telepon</label>
                  <input type="tel" value={form.telepon} onChange={e => setForm({...form, telepon: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Alamat</label>
                <textarea value={form.alamat} onChange={e => setForm({...form, alamat: e.target.value})} className="w-full h-20 resize-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Batas Kredit (Rp)</label>
                <input type="number" value={form.batas_kredit} onChange={e => setForm({...form, batas_kredit: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-500 font-medium">Batal</button>
              <button onClick={handleSave} className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold rounded-lg transition-all">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
