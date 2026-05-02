import React, { useState, useEffect } from 'react';
import { FiPrinter, FiUser, FiActivity, FiClock, FiFileText } from 'react-icons/fi';
import ModalDialog from '../../../components/ui/ModalDialog';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:8080/api';

export default function DetailResepModal({ isOpen, onClose, resepId, onStatusUpdated }) {
  const [resep, setResep] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && resepId) {
      fetchDetail();
    }
  }, [isOpen, resepId]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const resp = await axios.get(`${API_BASE}/master/resep/${resepId}`);
      if (resp.data.status) setResep(resp.data.data);
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Gagal memuat detail resep', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const resp = await axios.put(`${API_BASE}/master/resep/${resepId}/status`, { status: newStatus });
      if (resp.data.status) {
        Swal.fire({
          title: 'Berhasil!',
          text: `Status resep diperbarui menjadi ${newStatus}.`,
          icon: 'success',
          toast: true,
          position: 'top-end',
          timer: 2000,
          showConfirmButton: false
        });
        fetchDetail();
        if (onStatusUpdated) onStatusUpdated();
      }
    } catch (err) {
      Swal.fire('Gagal', 'Gagal memperbarui status resep', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      title={resep ? `Detail Resep: ${resep.no_resep}` : 'Memuat Detail...'}
      subtitle="Informasi lengkap resep dan daftar obat pasien."
      icon={<FiFileText />}
      maxWidth="max-w-4xl"
    >
      <div className="p-6">
        {loading ? (
          <div className="py-12 text-center text-gray-400">Memuat data resep...</div>
        ) : resep ? (
          <div className="space-y-6">
            {/* Top Grid: Info & QR */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                       <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Pasien</p>
                       <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                         <FiUser className="text-primary-500" /> {resep.nama_pelanggan || 'Umum'}
                       </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                       <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Dokter</p>
                       <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                         <FiActivity className="text-primary-500" /> {resep.nama_dokter || '-'}
                       </p>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                       <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Tanggal Input</p>
                       <p className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                         <FiClock /> {new Date(resep.tanggal_resep).toLocaleString('id-ID')}
                       </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                       <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Status</p>
                       <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                         (resep.status === 'Selesai' || resep.status === 'Siap Diambil') ? 'bg-emerald-100 text-emerald-700' :
                         resep.status === 'Diproses' ? 'bg-blue-100 text-blue-700' :
                         'bg-amber-100 text-amber-700'
                       }`}>
                         {resep.status}
                       </span>
                    </div>
                 </div>
                 {resep.catatan && (
                   <div className="bg-primary-50/30 border border-primary-100 p-3 rounded-xl">
                      <p className="text-[10px] font-bold text-primary-500 uppercase mb-1">Catatan</p>
                      <p className="text-xs text-primary-900 italic">"{resep.catatan}"</p>
                   </div>
                 )}
              </div>
              <div className="flex flex-col items-center justify-center p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 shadow-inner">
                 <img src={resep.qr_code_path} alt="QR" className="w-32 h-32" />
                 <p className="text-[9px] font-bold text-gray-400 mt-2 font-mono">{resep.no_resep}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="py-2.5 px-4 text-[10px] font-bold text-gray-400 uppercase">Obat</th>
                      <th className="py-2.5 px-4 text-[10px] font-bold text-gray-400 uppercase">Jumlah</th>
                      <th className="py-2.5 px-4 text-[10px] font-bold text-gray-400 uppercase">Aturan Pakai (Signa)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
                    {resep.items?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="py-3 px-4">
                          <div className="text-xs font-bold text-gray-900 dark:text-white">{item.nama_produk}</div>
                          <div className="text-[9px] text-gray-400 font-mono">{item.sku}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs font-black text-primary-600">{item.jumlah}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.dosis_aturan || '-'}</div>
                          <div className="text-[10px] italic text-gray-400">{item.keterangan || '-'}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-red-500 font-bold">Resep tidak ditemukan.</div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center rounded-b-xl">
        <Button variant="secondary" iconLeft={FiPrinter}>Cetak Etiket</Button>
        <div className="flex gap-3">
          {resep?.status === 'Baru' && (
            <Button variant="primary" onClick={() => handleUpdateStatus('Diproses')}>Mulai Proses</Button>
          )}
          {resep?.status === 'Diproses' && (
            <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600" onClick={() => handleUpdateStatus('Siap Diambil')}>Siap Diambil</Button>
          )}
          <Button variant="secondary" onClick={onClose}>Tutup</Button>
        </div>
      </div>
    </ModalDialog>
  );
}
