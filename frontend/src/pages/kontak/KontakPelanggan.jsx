import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import ModalDialog from '../../components/ui/ModalDialog';
import { FiSearch, FiPlus, FiStar } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function KontakPelanggan() {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nama_pelanggan: '', no_telepon: '', jenis_kelamin: 'L', alamat: '' });

  const loadData = async () => {
    setLoading(true);
    const res = await fetch('http://localhost:8080/api/master/pelanggan').then(r => r.json());
    if (res.status) setData(res.data);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    const res = await fetch('http://localhost:8080/api/master/pelanggan', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
    }).then(r => r.json());
    
    if (res.status) {
      Swal.fire({ icon: 'success', title: 'Berhasil', text: res.message, timer: 1500, showConfirmButton: false });
      setShowModal(false);
      loadData();
    }
  };

  const columns = [
    { key: 'no', label: 'No.', width: '60px', render: (_, __, i) => i + 1 },
    { key: 'kode_pelanggan', label: 'Kode', width: '120px' },
    { key: 'nama_pelanggan', label: 'Nama Pelanggan', render: (val, row) => (
      <div>
        <p className="font-bold text-gray-800 dark:text-gray-100">{val}</p>
        <p className="text-[10px] text-gray-500">{row.jenis_kelamin}</p>
      </div>
    )},
    { key: 'no_telepon', label: 'No. Telepon / WA' },
    { key: 'alamat', label: 'Alamat' },
    { key: 'loyalty_points', label: 'Points CRM', render: (val) => (
      <div className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded w-fit text-xs">
        <FiStar className="fill-amber-400" /> {val || 0} Poin
      </div>
    )},
    { key: 'total_belanja', label: 'Total Belanja', render: (val) => (
       <span className="font-mono text-gray-600 text-xs">Rp {Number(val || 0).toLocaleString('id-ID')}</span>
    )}
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      <SectionHeader 
        title="Daftar Pelanggan & CRM" 
        subtitle="Manajemen data pelanggan dan pantau Loyalty Points."
        rightContent={
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-bold shadow-sm shadow-primary-600/20 transition-all active:scale-95">
             <FiPlus size={18} /> Pelanggan Baru
          </button>
        }
      />

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden p-6 mb-4 flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input type="text" placeholder="Cari nama atau telepon..." className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="text-right">
           <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">Total Pelanggan</p>
           <h3 className="text-2xl font-extrabold text-primary-600">{data.length}</h3>
        </div>
      </div>

      <DataTable columns={columns} data={data} isLoading={loading} />

      <ModalDialog isOpen={showModal} onClose={() => setShowModal(false)} title="Tambah Pelanggan Baru">
        <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Nama Lengkap *</label>
              <input type="text" value={formData.nama_pelanggan} onChange={e => setFormData({...formData, nama_pelanggan: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">No. Telepon / WA</label>
                  <input type="tel" value={formData.no_telepon} onChange={e => setFormData({...formData, no_telepon: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500" />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Jenis Kelamin</label>
                  <select value={formData.jenis_kelamin} onChange={e => setFormData({...formData, jenis_kelamin: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500">
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
               </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Alamat</label>
              <textarea value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})} className="w-full h-24 resize-none bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary-500"></textarea>
            </div>
            
            <div className="pt-4 flex justify-end gap-2">
               <button onClick={() => setShowModal(false)} className="px-4 py-2 font-medium text-gray-500 text-sm">Batal</button>
               <button onClick={handleSave} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-6 rounded-lg text-sm">Simpan</button>
            </div>
        </div>
      </ModalDialog>
    </div>
  );
}
