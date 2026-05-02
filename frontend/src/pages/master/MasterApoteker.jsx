import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiUser, FiActivity, FiMapPin, FiPhone } from 'react-icons/fi';
import Swal from 'sweetalert2';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const API_BASE = 'http://localhost:8080/api';

export default function MasterApoteker() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ 
    nama_apoteker: '', 
    no_sipa: '', 
    no_stra: '', 
    no_hp: '', 
    alamat: '', 
    status: 'Aktif' 
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/master/apoteker`);
      const result = await res.json();
      if (result.status) setData(result.data || []);
    } catch (e) { console.error('Gagal memuat apoteker:', e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditId(item.id);
      setForm({ ...item });
    } else {
      setEditId(null);
      setForm({ nama_apoteker: '', no_sipa: '', no_stra: '', no_hp: '', alamat: '', status: 'Aktif' });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.nama_apoteker.trim()) {
      Swal.fire({ icon: 'warning', title: 'Peringatan', text: 'Nama apoteker wajib diisi!' });
      return;
    }
    try {
      const method = editId ? 'PUT' : 'POST';
      const url = editId ? `${API_BASE}/master/apoteker/${editId}` : `${API_BASE}/master/apoteker`;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const result = await res.json();
      if (result.status) {
        Swal.fire({ icon: 'success', title: 'Berhasil!', text: result.message, timer: 1500, showConfirmButton: false });
        setShowModal(false);
        loadData();
      } else {
        Swal.fire({ icon: 'error', title: 'Gagal', text: result.message || 'Terjadi kesalahan.' });
      }
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Tidak dapat menghubungi server.' });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Apoteker?',
      text: "Data ini akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus!'
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_BASE}/master/apoteker/${id}`, { method: 'DELETE' });
        const resData = await res.json();
        if (resData.status) {
          Swal.fire('Terhapus!', resData.message, 'success');
          loadData();
        }
      } catch (e) { Swal.fire('Error', 'Gagal menghapus data', 'error'); }
    }
  };

  const filtered = data.filter(d =>
    d.nama_apoteker?.toLowerCase().includes(search.toLowerCase()) ||
    d.no_sipa?.toLowerCase().includes(search.toLowerCase()) ||
    d.no_stra?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-12 px-4 animate-unt-fade">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-inner">
            <FiUser size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Master Apoteker</h1>
            <p className="text-sm text-gray-500 font-medium">Kelola data apoteker penanggung jawab & pendamping</p>
          </div>
        </div>
        <Button variant="primary" onClick={() => handleOpenModal()} iconLeft={FiPlus} className="sm:w-auto w-full py-3">
          Tambah Apoteker
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4 border-none shadow-sm">
           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><FiActivity size={20}/></div>
           <div>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Total Aktif</p>
             <p className="text-2xl font-black text-gray-900 mt-1">{data.filter(x => x.status === 'Aktif').length}</p>
           </div>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border-none shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, SIPA, atau STRA..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-950/50 border-b border-gray-100">
                {['No.', 'Apoteker', 'Legalitas (SIPA/STRA)', 'Kontak & Alamat', 'Status', 'Aksi'].map((h, i) => (
                  <th key={i} className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-16 text-center text-gray-400 text-sm">Memuat data apoteker...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-gray-300">
                    <FiUser size={48} className="opacity-20" />
                    <p className="text-sm font-semibold text-gray-400 italic">Belum ada data apoteker</p>
                  </div>
                </td></tr>
              ) : filtered.map((d, i) => (
                <tr key={d.id} className="hover:bg-primary-50/30 dark:hover:bg-primary-900/10 transition-all group">
                  <td className="px-6 py-4 text-xs text-gray-400 font-bold">{i + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                        {d.nama_apoteker.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{d.nama_apoteker}</p>
                        <p className="text-[10px] text-gray-400 font-medium mt-0.5 uppercase tracking-tighter">Pharmacist</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                         <span className="text-[9px] font-black bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded uppercase">SIPA</span>
                         <span className="text-xs font-mono text-gray-600">{d.no_sipa || '-'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="text-[9px] font-black bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded uppercase">STRA</span>
                         <span className="text-xs font-mono text-gray-600">{d.no_stra || '-'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2 text-gray-600">
                        <FiPhone className="text-gray-400" size={12} />
                        <span>{d.no_hp || '-'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 italic max-w-[200px] truncate">
                        <FiMapPin className="text-gray-400 shrink-0" size={12} />
                        <span>{d.alamat || '-'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      d.status === 'Aktif' ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(d)} className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all shadow-sm bg-white border border-gray-100">
                        <FiEdit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(d.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shadow-sm bg-white border border-gray-100">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-unt-fade">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
            <div className="bg-primary-600 p-6 text-white relative">
               <h3 className="text-lg font-black tracking-tight">{editId ? 'Edit Data Apoteker' : 'Tambah Apoteker Baru'}</h3>
               <p className="text-primary-100 text-xs mt-1">Lengkapi informasi legalitas dan kontak apoteker.</p>
               <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
                  <FiPlus size={24} className="rotate-45" />
               </button>
            </div>
            
            <div className="p-8 space-y-5">
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Nama Lengkap & Gelar *</label>
                  <input
                    type="text"
                    value={form.nama_apoteker}
                    onChange={(e) => setForm({ ...form, nama_apoteker: e.target.value })}
                    placeholder="Contoh: Apt. Budi Santoso, S.Farm"
                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">No. SIPA</label>
                    <input
                      type="text"
                      value={form.no_sipa}
                      onChange={(e) => setForm({ ...form, no_sipa: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">No. STRA</label>
                    <input
                      type="text"
                      value={form.no_stra}
                      onChange={(e) => setForm({ ...form, no_stra: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">No. WhatsApp/HP</label>
                    <input
                      type="tel"
                      value={form.no_hp}
                      onChange={(e) => setForm({ ...form, no_hp: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all appearance-none"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Nonaktif">Nonaktif</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Alamat Domisili</label>
                  <textarea
                    value={form.alamat}
                    onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                    rows={2}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                <button onClick={() => setShowModal(false)} className="px-6 py-3 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-all">Batal</button>
                <Button onClick={handleSave} className="px-10 py-3 shadow-lg shadow-primary-500/30">Simpan Data</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
