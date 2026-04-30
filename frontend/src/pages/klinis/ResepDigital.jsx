import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import ModalDialog from '../../components/ui/ModalDialog';
import { FiPlus, FiPenTool, FiSearch, FiPrinter, FiEye } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function ResepDigital() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [dokter, setDokter] = useState([]);
  const [pelanggan, setPelanggan] = useState([]);
  const [produk, setProduk] = useState([]);
  
  const [formData, setFormData] = useState({ dokter_id: '', pelanggan_id: '', catatan: '', items: [] });
  const [itemInput, setItemInput] = useState({ produk_id: '', jumlah: 1, dosis_aturan: '', keterangan: '' });

  const loadData = async () => {
    setLoading(true);
    const res = await fetch('http://localhost:8080/api/master/resep').then(r => r.json());
    if (res.status) setData(res.data);
    setLoading(false);
  };

  const loadDependencies = async () => {
    try {
        const [d, p, pr] = await Promise.all([
          fetch('http://localhost:8080/api/master/dokter').then(r => r.json()),
          fetch('http://localhost:8080/api/master/pelanggan').then(r => r.json()),
          fetch('http://localhost:8080/api/produk').then(r => r.json())
        ]);
        if (d.status) setDokter(d.data);
        if (p.status) setPelanggan(p.data);
        if (pr.status) setProduk(pr.data);
    } catch(e) {}
  };

  useEffect(() => { loadData(); loadDependencies(); }, []);

  const handleAddItem = () => {
    if (!itemInput.produk_id || itemInput.jumlah < 1) return;
    const prod = produk.find(p => p.id === itemInput.produk_id);
    setFormData(prev => ({
        ...prev, 
        items: [...prev.items, { ...itemInput, nama_produk: prod.nama_produk }]
    }));
    setItemInput({ produk_id: '', jumlah: 1, dosis_aturan: '', keterangan: '' });
  };

  const handleSave = async () => {
    if (formData.items.length === 0) return Swal.fire('Error', 'Minimal 1 obat diresepkan', 'error');
    
    const res = await fetch('http://localhost:8080/api/master/resep', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
    }).then(r => r.json());
    
    if (res.status) {
        Swal.fire({
            title: 'Resep Berhasil', 
            html: `NO: <b>${res.data.no_resep}</b><br><br><img src="${res.data.qr_url}" align="center" style="margin:auto" />`, 
            icon: 'success'
        });
        setIsModalOpen(false);
        setFormData({ dokter_id: '', pelanggan_id: '', catatan: '', items: [] });
        loadData();
    }
  };

  const columns = [
    { key: 'no_resep', label: 'Nomor Resep', render: (val) => <span className="font-bold text-primary-700">{val}</span> },
    { key: 'tanggal_resep', label: 'Tanggal' },
    { key: 'nama_pelanggan', label: 'Pasien' },
    { key: 'nama_dokter', label: 'Penulis Resep' },
    { key: 'status', label: 'Status' }
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12">
      <SectionHeader 
        title="Resep Digital (e-Prescription)" 
        subtitle="Buat resep digital dengan QR code yang bisa langsung di-scan di Kasir."
        rightContent={
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg shadow-sm font-bold text-sm">
             <FiPenTool size={16} /> Buat Resep Baru
          </button>
        }
      />

      <DataTable data={data} columns={columns} isLoading={loading} searchQuery={searchQuery} onSearchChange={setSearchQuery} searchPlaceholder="Cari nomor resep..." />

      <ModalDialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Buat Resep Elektronik" maxWidth="max-w-3xl">
         <div className="p-6 space-y-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200">
             <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Pasien</label>
                    <select className="w-full bg-white px-3 py-2 border rounded-lg text-sm" value={formData.pelanggan_id} onChange={e => setFormData({...formData, pelanggan_id: e.target.value})}>
                        <option value="">- Pilih Pasien -</option>
                        {pelanggan.map(p => <option key={p.id} value={p.id}>{p.nama_pelanggan} ({p.kode_pelanggan})</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Dokter (Penulis)</label>
                    <select className="w-full bg-white px-3 py-2 border rounded-lg text-sm" value={formData.dokter_id} onChange={e => setFormData({...formData, dokter_id: e.target.value})}>
                        <option value="">- Mandiri / Non-Dokter -</option>
                        {dokter.map(d => <option key={d.id} value={d.id}>{d.nama_dokter}</option>)}
                    </select>
                 </div>
             </div>
             
             <div className="bg-white p-4 border rounded-xl shadow-sm">
                 <h4 className="text-sm font-bold text-gray-800 mb-3 border-b pb-2">R/ Daftar Obat</h4>
                 <div className="flex gap-2 items-end mb-4">
                     <div className="flex-1">
                        <label className="block text-xs font-bold text-gray-500">Obat</label>
                        <select className="w-full bg-gray-50 px-2 py-1.5 border rounded-lg text-xs" value={itemInput.produk_id} onChange={e => setItemInput({...itemInput, produk_id: e.target.value})}>
                            <option value="">Pilih Obat...</option>
                            {produk.map(p => <option key={p.id} value={p.id}>{p.nama_produk}</option>)}
                        </select>
                     </div>
                     <div className="w-16">
                         <label className="block text-xs font-bold text-gray-500">Jml</label>
                         <input type="number" className="w-full bg-gray-50 px-2 py-1.5 border rounded-lg text-xs text-center px-1" value={itemInput.jumlah} onChange={e => setItemInput({...itemInput, jumlah: e.target.value})} />
                     </div>
                     <div className="flex-1">
                         <label className="block text-xs font-bold text-gray-500">Aturan Pakai / Dosis</label>
                         <input type="text" placeholder="3 x 1 P.C" className="w-full bg-gray-50 px-2 py-1.5 border rounded-lg text-xs" value={itemInput.dosis_aturan} onChange={e => setItemInput({...itemInput, dosis_aturan: e.target.value})} />
                     </div>
                     <button onClick={handleAddItem} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1.5 text-xs font-bold">
                         Tambah
                     </button>
                 </div>
                 
                 {formData.items.length > 0 && (
                     <table className="w-full text-left text-sm border">
                         <thead className="bg-gray-50 text-xs text-gray-500"><tr><th className="p-2 border-b">Nama Obat</th><th className="p-2 border-b">Jumlah</th><th className="p-2 border-b">Signa (Aturan Pakai)</th></tr></thead>
                         <tbody>
                             {formData.items.map((item, idx) => (
                                 <tr key={idx} className="border-b text-xs"><td className="p-2 font-bold">{item.nama_produk}</td><td className="p-2">{item.jumlah}</td><td className="p-2 italic">{item.dosis_aturan}</td></tr>
                             ))}
                         </tbody>
                     </table>
                 )}
             </div>

             <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Catatan Tambahan</label>
                <textarea className="w-full bg-white px-3 py-2 border rounded-lg text-sm h-16" value={formData.catatan} onChange={e => setFormData({...formData, catatan: e.target.value})} placeholder="Catatan resep untuk apoteker..." />
             </div>

             <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-bold bg-white text-gray-500 border rounded-lg text-sm">Batal</button>
                <button onClick={handleSave} className="px-5 py-2 font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-sm rounded-lg text-sm">Generate QR Resep</button>
             </div>
         </div>
      </ModalDialog>
    </div>
  );
}
