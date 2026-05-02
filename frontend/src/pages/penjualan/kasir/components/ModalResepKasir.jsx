import React, { useState, useEffect } from 'react';
import ModalDialog from '../../../../components/ui/ModalDialog';
import { FiFileText, FiRefreshCcw, FiSearch, FiCheck, FiUser, FiActivity, FiClock, FiFilter } from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:8080/api';

export default function ModalResepKasir({ isOpen, onClose, onSelectResep }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filterMode, setFilterMode] = useState('Siap'); // 'Siap' or 'Semua' (Repeat)

  const fetchResep = async () => {
    setIsLoading(true);
    try {
      let url = `${API_BASE}/master/resep?`;
      if (filterMode === 'Siap') {
        url += 'status=Siap Diambil';
      }
      const resp = await axios.get(url);
      if (resp.data.status) {
        setPrescriptions(resp.data.data);
      }
    } catch (err) {
      console.error(err);
      // Fallback or empty
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchResep();
  }, [isOpen, filterMode]);

  const handleSelect = async (resepShort) => {
    // Fetch full detail with items
    try {
      const resp = await axios.get(`${API_BASE}/master/resep/${resepShort.id}`);
      if (resp.data.status) {
        const resepDetail = resp.data.data;
        Swal.fire({
          title: 'Tarik Data Resep?',
          text: `Menarik data resep ${resepDetail.no_resep} ke keranjang kasir.`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Ya, Tarik Data',
          cancelButtonText: 'Batal',
          confirmButtonColor: '#7c3aed'
        }).then((result) => {
          if (result.isConfirmed) {
            onSelectResep(resepDetail);
            onClose();
          }
        });
      }
    } catch (err) {
      Swal.fire('Error', 'Gagal memuat detail resep', 'error');
    }
  };

  const filtered = prescriptions.filter(p => 
    p.no_resep.toLowerCase().includes(search.toLowerCase()) || 
    (p.nama_pelanggan && p.nama_pelanggan.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <ModalDialog
      isOpen={isOpen} onClose={onClose}
      title="Daftar Resep Digital"
      subtitle="Tarik data resep dari pelayanan atau riwayat resep untuk penebusan ulang (Repeat)."
      icon={<FiFileText />}
      maxWidth="max-w-4xl"
    >
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
             <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input type="text" placeholder="Cari No. Resep atau Nama Pasien..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-semibold outline-none focus:border-primary-500" />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
               <button 
                 onClick={() => setFilterMode('Siap')}
                 className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filterMode === 'Siap' ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
               >
                 Siap Ditebus
               </button>
               <button 
                 onClick={() => setFilterMode('Semua')}
                 className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${filterMode === 'Semua' ? 'bg-white dark:bg-gray-700 text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
               >
                 Riwayat (Repeat)
               </button>
            </div>
            <button onClick={fetchResep} className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-600 dark:text-gray-300 hover:text-primary-600 hover:border-primary-500 transition-all">
               <FiRefreshCcw className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
          {isLoading ? (
             <div className="col-span-2 py-20 text-center text-gray-400 text-xs">Menyinkronkan data Resep...</div>
          ) : filtered.length === 0 ? (
             <div className="col-span-2 py-20 text-center text-gray-400 text-xs italic">Tidak ada resep yang ditemukan dalam kategori ini.</div>
          ) : filtered.map(resep => (
             <div key={resep.id} className="flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:border-primary-500 hover:shadow-md transition-all group cursor-pointer" onClick={() => handleSelect(resep)}>
                <div className="p-4 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50 flex justify-between items-start">
                   <div>
                     <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(resep.tanggal_resep).toLocaleDateString('id-ID')}</span>
                     <h4 className="text-sm font-bold text-primary-600 mt-0.5">{resep.no_resep}</h4>
                   </div>
                   <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${
                     resep.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                     resep.status === 'Siap Diambil' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                     'bg-amber-50 text-amber-600 border-amber-200'
                   }`}>
                     {resep.status}
                   </span>
                </div>
                <div className="p-4 flex flex-col gap-3">
                   <div className="grid grid-cols-2 gap-3">
                     <div className="flex gap-2 items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center shrink-0"><FiUser size={14}/></div>
                        <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Pasien</span><span className="text-xs font-semibold text-gray-900 dark:text-gray-200 truncate">{resep.nama_pelanggan || 'Umum'}</span></div>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center shrink-0"><FiActivity size={14}/></div>
                        <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Dokter</span><span className="text-xs font-semibold text-gray-900 dark:text-gray-200 truncate">{resep.nama_dokter || '-'}</span></div>
                     </div>
                   </div>
                   
                   <div className="p-3 bg-gray-50 dark:bg-gray-950 rounded-lg border border-gray-100 dark:border-gray-800 mt-1">
                     <div className="text-[10px] font-bold text-gray-500 uppercase flex justify-between">
                        Informasi <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 px-1.5 rounded">{resep.sumber}</span>
                     </div>
                     <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1 italic">
                       {resep.catatan || 'Tidak ada catatan tambahan.'}
                     </p>
                   </div>
                   <div className="mt-1 flex items-center justify-center gap-2 py-2 bg-gray-50 dark:bg-gray-800 text-primary-600 group-hover:bg-primary-600 group-hover:text-white rounded-lg text-xs font-bold transition-all">
                     <FiCheck size={14} /> Klik untuk Pilih Resep
                   </div>
                </div>
             </div>
          ))}
        </div>
      </div>
    </ModalDialog>
  );
}
