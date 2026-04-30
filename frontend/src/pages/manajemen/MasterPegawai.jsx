import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import { FiUsers, FiPlus, FiEdit2, FiTrash2, FiSearch, FiCheck, FiX, FiBriefcase } from 'react-icons/fi';
import Swal from 'sweetalert2';

const API = 'http://localhost:8080/api/master/hr';

export default function MasterPegawai() {
  const [pegawai, setPegawai] = useState([]);
  const [jabatan, setJabatan] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nama_lengkap: '', nik: '', sipa_stra: '', no_hp: '', email: '', 
    alamat: '', jabatan_id: '', user_id: '', status_pegawai: 'Aktif', tanggal_gabung: ''
  });

  const loadData = async () => {
    const [pRes, jRes, uRes] = await Promise.all([
      fetch(`${API}/pegawai`).then(r => r.json()),
      fetch(`${API}/jabatan`).then(r => r.json()),
      fetch('http://localhost:8080/api/master/users').then(r => r.json())
    ]);
    if(pRes.status) setPegawai(pRes.data);
    if(jRes.status) setJabatan(jRes.data);
    if(uRes.status) setUsers(uRes.data);
  };

  useEffect(() => { loadData(); }, []);

  const openForm = (data = null) => {
    if (data) {
      setIsEditing(true);
      setFormData({
        id: data.id,
        nama_lengkap: data.nama_lengkap || '',
        nik: data.nik || '',
        sipa_stra: data.sipa_stra || '',
        no_hp: data.no_hp || '',
        email: data.email || '',
        alamat: data.alamat || '',
        jabatan_id: data.jabatan_id || '',
        user_id: data.user_id || '',
        status_pegawai: data.status_pegawai || 'Aktif',
        tanggal_gabung: data.tanggal_gabung || ''
      });
    } else {
      setIsEditing(false);
      setFormData({
        nama_lengkap: '', nik: '', sipa_stra: '', no_hp: '', email: '', 
        alamat: '', jabatan_id: '', user_id: '', status_pegawai: 'Aktif', tanggal_gabung: ''
      });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = isEditing ? `${API}/pegawai/${formData.id}` : `${API}/pegawai`;
    const method = isEditing ? 'PUT' : 'POST';
    
    const res = await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
    }).then(r => r.json());
    
    if (res.status) {
      Swal.fire({ icon: 'success', title: 'Berhasil', text: res.message, timer: 1500, showConfirmButton: false });
      setShowModal(false);
      loadData();
    } else {
      Swal.fire('Gagal', res.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (await Swal.fire({ title: 'Hapus Pegawai?', text: "Data tidak dapat dikembalikan!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Ya, Hapus!' }).then(r => r.isConfirmed)) {
      const res = await fetch(`${API}/pegawai/${id}`, { method: 'DELETE' }).then(r => r.json());
      if (res.status) loadData();
    }
  };

  const filtered = pegawai.filter(p => p.nama_lengkap.toLowerCase().includes(search.toLowerCase()) || (p.nik && p.nik.includes(search)));

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 pb-20">
      <SectionHeader title="Master Data Pegawai" subtitle="Kelola profil, jabatan, dan akses sistem untuk staf apotek." icon={<FiBriefcase size={24} className="text-gray-500" />} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Cari nama atau NIK..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary-500 transition-colors" />
        </div>
        <button onClick={() => openForm()} className="w-full sm:w-auto px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors">
          <FiPlus size={16} /> Tambah Pegawai
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Nama Lengkap</th>
                <th className="px-4 py-3">NIK / Identitas</th>
                <th className="px-4 py-3">Jabatan</th>
                <th className="px-4 py-3">Kontak</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <p className="font-bold text-gray-800 dark:text-gray-100">{item.nama_lengkap}</p>
                    <p className="text-[10px] text-gray-400">Bergabung: {item.tanggal_gabung || '-'}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-600">{item.nik || '-'}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-primary-700">{item.nama_jabatan || '-'}</p>
                    {item.sipa_stra && <p className="text-[10px] text-gray-500">SIPA: {item.sipa_stra}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-600">{item.no_hp || '-'}</p>
                    <p className="text-xs text-gray-400">{item.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${item.status_pegawai === 'Aktif' ? 'bg-success-100 text-success-700' : 'bg-gray-100 text-gray-600'}`}>{item.status_pegawai}</span>
                  </td>
                  <td className="px-4 py-3 flex items-center justify-end gap-2">
                    <button onClick={() => openForm(item)} className="p-1.5 bg-primary-50 text-primary-600 rounded hover:bg-primary-100"><FiEdit2 size={14} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"><FiTrash2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="6" className="py-8 text-center text-gray-400">Tidak ada data pegawai.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-unt-fade">
          <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2"><FiUsers className="text-primary-600"/> {isEditing ? 'Edit Pegawai' : 'Tambah Pegawai Baru'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><FiX size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} className="overflow-y-auto p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Nama Lengkap *</label>
                  <input type="text" required value={formData.nama_lengkap} onChange={e => setFormData({...formData, nama_lengkap: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">NIK / Identitas</label>
                  <input type="text" value={formData.nik} onChange={e => setFormData({...formData, nik: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary-500" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Jabatan & Peran</label>
                  <select value={formData.jabatan_id} onChange={e => setFormData({...formData, jabatan_id: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary-500">
                    <option value="">-- Pilih Jabatan --</option>
                    {jabatan.map(j => <option key={j.id} value={j.id}>{j.nama_jabatan}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">No SIPA/STRA (Bila Apoteker/TTK)</label>
                  <input type="text" value={formData.sipa_stra} onChange={e => setFormData({...formData, sipa_stra: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary-500" />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Nomor HP</label>
                  <input type="text" value={formData.no_hp} onChange={e => setFormData({...formData, no_hp: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary-500" />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Alamat</label>
                  <textarea value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary-500" rows="2"></textarea>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Tautkan ke Akun Sistem</label>
                  <select value={formData.user_id} onChange={e => setFormData({...formData, user_id: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary-500">
                    <option value="">-- Tidak ditautkan --</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.nama_lengkap} ({u.username})</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Status</label>
                    <select value={formData.status_pegawai} onChange={e => setFormData({...formData, status_pegawai: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary-500">
                      <option>Aktif</option><option>Cuti</option><option>Resign</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-600">Tanggal Gabung</label>
                    <input type="date" value={formData.tanggal_gabung} onChange={e => setFormData({...formData, tanggal_gabung: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary-500" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100 gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 font-medium text-gray-500 hover:bg-gray-100 rounded-lg text-sm">Batal</button>
                <button type="submit" className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg text-sm flex items-center gap-2">
                  <FiCheck size={16} /> {isEditing ? 'Simpan' : 'Tambah'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
