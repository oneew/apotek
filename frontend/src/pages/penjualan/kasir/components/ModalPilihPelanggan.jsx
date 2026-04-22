import React, { useState, useEffect } from 'react';
import ModalDialog from '../../../../components/ui/ModalDialog';
import { FiSearch, FiPlus, FiUserPlus, FiArrowLeft, FiCheck, FiUser, FiLoader } from 'react-icons/fi';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:8080/api/master';

export default function ModalPilihPelanggan({ isOpen, onClose, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [pelangganList, setPelangganList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newPelanggan, setNewPelanggan] = useState({ nama_pelanggan: '', no_telepon: '', alamat: '' });

  const fetchPelanggan = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/pelanggan`);
      const result = await res.json();
      if (result.status) setPelangganList(result.data || []);
    } catch (err) {
      console.error('Gagal fetch pelanggan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPelanggan();
      setSearchTerm('');
      setIsAddingNew(false);
    }
  }, [isOpen]);

  const filtered = pelangganList.filter(p =>
    p.nama_pelanggan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.kode_pelanggan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.no_telepon?.includes(searchTerm)
  );

  const handleAddNew = async () => {
    if (!newPelanggan.nama_pelanggan.trim()) {
      Swal.fire({ icon: 'warning', title: 'Nama wajib diisi', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/pelanggan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPelanggan)
      });
      const result = await res.json();
      if (result.status) {
        Swal.fire({ icon: 'success', title: 'Pelanggan ditambahkan', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
        setNewPelanggan({ nama_pelanggan: '', no_telepon: '', alamat: '' });
        setIsAddingNew(false);
        fetchPelanggan();
      }
    } catch (err) {
      Swal.fire('Gagal', 'Tidak dapat menyimpan pelanggan', 'error');
    }
  };

  const handleSelect = (p) => {
    onSelect({ id: p.id, nama: p.nama_pelanggan, kode: p.kode_pelanggan });
    onClose();
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title={isAddingNew ? "Tambah Pelanggan Baru" : "Pilih Pelanggan"}
      subtitle={isAddingNew ? "Isi data pelanggan baru untuk transaksi ini." : "Pilih pelanggan yang sudah terdaftar atau tambah baru."}
      icon={<FiUser />}
      maxWidth="max-w-[650px]"
    >
      <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-6">

        {!isAddingNew ? (
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1 group">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama, kode, atau no. telepon..."
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 py-2.5 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm dark:text-white transition-all"
                  autoFocus
                />
              </div>
              <button onClick={() => setIsAddingNew(true)} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shrink-0">
                <FiUserPlus size={16} /> Tambah Baru
              </button>
            </div>

            <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-950 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Nama Pelanggan</th>
                    <th className="px-4 py-3">Kode</th>
                    <th className="px-4 py-3">Telepon</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
                  {isLoading ? (
                    <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-400 text-sm"><FiLoader className="animate-spin inline mr-2" />Memuat data...</td></tr>
                  ) : filtered.length > 0 ? filtered.map(p => (
                    <tr key={p.id} className="group hover:bg-primary-50/30 dark:hover:bg-primary-950/20 transition-all">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{p.nama_pelanggan}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 font-mono">{p.kode_pelanggan}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{p.no_telepon || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleSelect(p)}
                          className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-4 py-1.5 rounded-lg transition-all text-xs active:scale-95"
                        >
                          Pilih
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-400 text-sm italic">Tidak ada pelanggan ditemukan</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
             <button className="flex items-center gap-2 text-primary-600 font-bold text-xs hover:underline group" onClick={() => setIsAddingNew(false)}>
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                <span>Kembali ke Daftar</span>
             </button>

             <div className="grid grid-cols-1 gap-4 bg-gray-50 dark:bg-gray-950 p-5 rounded-xl border border-gray-100 dark:border-gray-800">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Nama Pelanggan *</label>
                    <input type="text" value={newPelanggan.nama_pelanggan} onChange={(e) => setNewPelanggan({...newPelanggan, nama_pelanggan: e.target.value})} placeholder="Masukkan nama lengkap..." className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm dark:text-white transition-all" autoFocus />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">No. Telepon</label>
                    <input type="text" value={newPelanggan.no_telepon} onChange={(e) => setNewPelanggan({...newPelanggan, no_telepon: e.target.value})} placeholder="08xxxxxxxxxx" className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm dark:text-white transition-all" />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Alamat</label>
                    <textarea value={newPelanggan.alamat} onChange={(e) => setNewPelanggan({...newPelanggan, alamat: e.target.value})} placeholder="Alamat lengkap..." className="w-full h-20 resize-none bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm dark:text-white transition-all"></textarea>
                </div>
             </div>

             <div className="flex justify-end pt-2">
                <button onClick={handleAddNew} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 active:scale-95">
                  <FiCheck />
                  Simpan Pelanggan
                </button>
             </div>
          </div>
        )}

      </div>
    </ModalDialog>
  );
}
