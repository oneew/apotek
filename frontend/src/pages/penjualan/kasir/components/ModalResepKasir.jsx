import React, { useState, useEffect } from 'react';
import ModalDialog from '../../../../components/ui/ModalDialog';
import { FiFileText, FiRefreshCcw, FiSearch, FiCheck, FiUser, FiActivity } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function ModalResepKasir({ isOpen, onClose, onSelectResep }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock static pending prescriptions for UI demonstrating
  const fetchPendingResep = () => {
    setIsLoading(true);
    // In real app, this fetches from /api/master/resep?status=Pending
    setTimeout(() => {
      setPrescriptions([
        {
          id: 'RSP-TEBUS-001',
          no_resep: 'RSP-TEBUS-001',
          tanggal: new Date().toISOString(),
          nama_pasien: 'Budi Santoso',
          pelanggan_id: 1,
          nama_dokter: 'Dr. Andi Hermawan',
          dokter_id: 1,
          status: 'Menunggu',
          items: [
            { produk_id: 1, nama_produk: 'Paracetamol 500mg', jumlah: 10, nama_satuan: 'Strip', harga_beli_referensi: 3500 },
            { produk_id: 2, nama_produk: 'Amoxicillin 500mg', jumlah: 15, nama_satuan: 'Tab', harga_beli_referensi: 4200 }
          ]
        },
        {
          id: 'RSP-TEBUS-002',
          no_resep: 'RSP-TEBUS-002',
          tanggal: new Date().toISOString(),
          nama_pasien: 'Siti Aminah',
          pelanggan_id: 2,
          nama_dokter: 'Dr. Linda Kumalasari',
          dokter_id: 2,
          status: 'Menunggu',
          items: [
            { produk_id: 3, nama_produk: 'Omeprazole 20mg', jumlah: 5, nama_satuan: 'Strip', harga_beli_referensi: 8000 }
          ]
        }
      ]);
      setIsLoading(false);
    }, 600);
  };

  useEffect(() => {
    if (isOpen) fetchPendingResep();
  }, [isOpen]);

  const handleSelect = (resep) => {
    Swal.fire({
      title: 'Tarik Data Resep?',
      text: `Menarik data resep ${resep.no_resep} atas nama ${resep.nama_pasien}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Tarik Data',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#7c3aed'
    }).then((result) => {
      if (result.isConfirmed) {
        onSelectResep(resep);
        onClose();
      }
    });
  };

  const filtered = prescriptions.filter(p => 
    p.no_resep.toLowerCase().includes(search.toLowerCase()) || 
    p.nama_pasien.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ModalDialog
      isOpen={isOpen} onClose={onClose}
      title="Tebus E-Resep"
      subtitle="Tarik data resep digital dari poli klinik ke kasir apotek."
      icon={<FiFileText />}
      maxWidth="max-w-4xl"
    >
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
             <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input type="text" placeholder="Cari No. Resep atau Nama Pasien..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-semibold outline-none focus:border-primary-500" />
          </div>
          <button onClick={fetchPendingResep} className="px-4 py-2 flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-primary-600 hover:border-primary-500 transition-all">
             <FiRefreshCcw className={isLoading ? 'animate-spin' : ''} /><span>Refresh Antrian</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {isLoading ? (
             <div className="col-span-2 py-20 text-center text-gray-400 text-xs">Menyinkronkan data E-Resep...</div>
          ) : filtered.length === 0 ? (
             <div className="col-span-2 py-20 text-center text-gray-400 text-xs italic">Tidak ada antrian resep yang menunggu.</div>
          ) : filtered.map(resep => (
             <div key={resep.id} className="flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:border-primary-500 hover:shadow-md transition-all group">
                <div className="p-4 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50 flex justify-between items-start">
                   <div>
                     <span className="text-[10px] font-bold text-gray-400 uppercase">{new Date(resep.tanggal).toLocaleDateString('id-ID')}</span>
                     <h4 className="text-sm font-bold text-primary-600 mt-0.5">{resep.no_resep}</h4>
                   </div>
                   <span className="text-[10px] font-bold px-2 py-1 bg-amber-50 text-amber-600 rounded-md border border-amber-200/50">Menunggu</span>
                </div>
                <div className="p-4 flex flex-col gap-3">
                   <div className="grid grid-cols-2 gap-3">
                     <div className="flex gap-2 items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0"><FiUser size={14}/></div>
                        <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Pasien</span><span className="text-xs font-semibold text-gray-900 dark:text-gray-200 truncate">{resep.nama_pasien}</span></div>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0"><FiActivity size={14}/></div>
                        <div className="flex flex-col"><span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Poli/Dokter</span><span className="text-xs font-semibold text-gray-900 dark:text-gray-200 truncate">{resep.nama_dokter}</span></div>
                     </div>
                   </div>
                   
                   <div className="p-3 bg-gray-50 dark:bg-gray-950 rounded-lg border border-gray-100 dark:border-gray-800 mt-2">
                     <span className="text-[10px] font-bold text-gray-500 uppercase flex justify-between">
                       Rincian Obat <span className="bg-gray-200 dark:bg-gray-800 text-gray-600 px-1.5 rounded">{resep.items.length} item</span>
                     </span>
                     <ul className="mt-2 space-y-1.5">
                       {resep.items.map((it, idx) => (
                           <li key={idx} className="text-[11px] flex justify-between font-medium text-gray-700 dark:text-gray-300">
                             <span className="truncate pr-2">• {it.nama_produk}</span>
                             <span className="tabular-nums font-bold shrink-0">{it.jumlah} {it.nama_satuan}</span>
                           </li>
                       ))}
                     </ul>
                   </div>
                   <button onClick={() => handleSelect(resep)} className="mt-1 w-full flex items-center justify-center gap-2 py-2 bg-primary-600 text-white rounded-lg text-xs font-bold hover:bg-primary-700 active:scale-95 transition-all outline-none">
                     <FiCheck size={14} /> Proses Tebus Resep
                   </button>
                </div>
             </div>
          ))}
        </div>
      </div>
    </ModalDialog>
  );
}
