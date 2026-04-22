import React, { useState, useEffect } from 'react';
import ModalDialog from '../../../../components/ui/ModalDialog';
import { FiSearch, FiUserPlus, FiArrowLeft, FiCheck, FiActivity, FiLoader } from 'react-icons/fi';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:8080/api/master';

export default function ModalPilihDokter({ isOpen, onClose, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [dokterList, setDokterList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newDokter, setNewDokter] = useState({ nama_dokter: '', no_izin_praktek: '', spesialisasi: 'Umum' });

  const fetchDokter = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/dokter`);
      const result = await res.json();
      if (result.status) setDokterList(result.data || []);
    } catch (err) {
      console.error('Gagal fetch dokter:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDokter();
      setSearchTerm('');
      setIsAddingNew(false);
    }
  }, [isOpen]);

  const filtered = dokterList.filter(d =>
    d.nama_dokter?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.no_izin_praktek?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.spesialisasi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = async () => {
    if (!newDokter.nama_dokter.trim()) {
      Swal.fire({ icon: 'warning', title: 'Nama dokter wajib diisi', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/dokter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDokter)
      });
      const result = await res.json();
      if (result.status) {
        Swal.fire({ icon: 'success', title: 'Dokter ditambahkan', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false });
        setNewDokter({ nama_dokter: '', no_izin_praktek: '', spesialisasi: 'Umum' });
        setIsAddingNew(false);
        fetchDokter();
      }
    } catch (err) {
      Swal.fire('Gagal', 'Tidak dapat menyimpan dokter', 'error');
    }
  };

  const handleSelect = (d) => {
    onSelect({ id: d.id, nama: d.nama_dokter, sip: d.no_izin_praktek });
    onClose();
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title={isAddingNew ? "Tambah Dokter Baru" : "Pilih Dokter"}
      subtitle={isAddingNew ? "Daftarkan dokter baru ke dalam sistem." : "Pilih dokter peresep untuk transaksi ini."}
      icon={<FiActivity />}
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
                  placeholder="Cari nama dokter atau No. SIP..."
                  className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 py-2.5 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm dark:text-white transition-all"
                  autoFocus
                />
              </div>
              <button onClick={() => setIsAddingNew(true)} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shrink-0">
                <FiUserPlus size={16} /> Tambah Dokter
              </button>
            </div>

            <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-950 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Nama Dokter</th>
                    <th className="px-4 py-3">No. SIP</th>
                    <th className="px-4 py-3">Spesialisasi</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
                  {isLoading ? (
                    <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-400 text-sm"><FiLoader className="animate-spin inline mr-2" />Memuat data...</td></tr>
                  ) : filtered.length > 0 ? filtered.map(d => (
                    <tr key={d.id} className="group hover:bg-primary-50/30 dark:hover:bg-primary-950/20 transition-all">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{d.nama_dokter}</div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 font-mono">{d.no_izin_praktek || '-'}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{d.spesialisasi || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleSelect(d)}
                          className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-4 py-1.5 rounded-lg transition-all text-xs active:scale-95"
                        >
                          Pilih
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-400 text-sm italic">Tidak ada dokter ditemukan</td></tr>
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
                    <label className="text-xs font-bold text-gray-500">Nama Dokter *</label>
                    <input type="text" value={newDokter.nama_dokter} onChange={(e) => setNewDokter({...newDokter, nama_dokter: e.target.value})} placeholder="dr. Nama Lengkap..." className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm dark:text-white transition-all" autoFocus />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">No. SIP</label>
                      <input type="text" value={newDokter.no_izin_praktek} onChange={(e) => setNewDokter({...newDokter, no_izin_praktek: e.target.value})} placeholder="SIP/xxxx/xxx" className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm dark:text-white transition-all" />
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">Spesialisasi</label>
                      <select value={newDokter.spesialisasi} onChange={(e) => setNewDokter({...newDokter, spesialisasi: e.target.value})} className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm dark:text-white transition-all">
                        <option>Umum</option>
                        <option>Anak</option>
                        <option>Penyakit Dalam</option>
                        <option>Kulit & Kelamin</option>
                        <option>THT</option>
                        <option>Mata</option>
                        <option>Gigi</option>
                      </select>
                  </div>
                </div>
             </div>

             <div className="flex justify-end pt-2">
                <button onClick={handleAddNew} className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 active:scale-95">
                  <FiCheck />
                  Simpan Dokter
                </button>
             </div>
          </div>
        )}

      </div>
    </ModalDialog>
  );
}
