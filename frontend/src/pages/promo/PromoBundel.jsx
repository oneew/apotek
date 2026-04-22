import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import ModalDialog from '../../components/ui/ModalDialog';
import { FiFilter, FiSearch, FiPlus, FiTrash2, FiEdit2, FiPackage } from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function PromoBundel() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama_promo: '',
    jenis_promo: 'Bundel',
    tanggal_mulai: '',
    tanggal_selesai: '',
    nilai_diskon: 0,
    tipe_nilai: 'Nominal',
    status: 'Aktif',
    keterangan: ''
  });
  const [editingId, setEditingId] = useState(null);

  const columns = [
    { key: 'no', label: 'No.', width: '60px', render: (_, index) => index + 1 },
    { 
      key: 'nama_promo', 
      label: 'Nama Bundel',
      render: (val) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
            <FiPackage size={16} />
          </div>
          <span className="font-medium text-gray-900">{val}</span>
        </div>
      )
    },
    { 
        key: 'nilai_diskon', 
        label: 'Harga Bundel',
        render: (val) => <span className="font-bold">Rp {new Intl.NumberFormat('id-ID').format(val)}</span>
    },
    { 
      key: 'tanggal_mulai', 
      label: 'Masa Berlaku',
      render: (_, row) => (
        <div className="text-xs text-gray-500">
           {new Date(row.tanggal_mulai).toLocaleDateString('id-ID')} - {new Date(row.tanggal_selesai).toLocaleDateString('id-ID')}
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          val === 'Aktif' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-50 text-gray-600 border border-gray-200'
        }`}>
          {val}
        </span>
      )
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      align: 'right',
      render: (_, row) => (
        <div className="flex gap-2 justify-end">
            <button onClick={() => handleEdit(row)} className="p-2 text-gray-400 hover:text-primary-600 rounded-lg transition-all"><FiEdit2 size={16} /></button>
            <button onClick={() => handleDelete(row.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-all"><FiTrash2 size={16} /></button>
        </div>
      )
    }
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8080/api/master/promo');
      setData(res.data.data.filter(d => d.jenis_promo === 'Bundel'));
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal mengambil data bundel', confirmButtonColor: '#7F56D9' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (promo) => {
    setFormData(promo);
    setEditingId(promo.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
        title: 'Hapus Bundel?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!'
    });

    if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/master/promo/${id}`);
          Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Bundel berhasil dihapus', timer: 1500, showConfirmButton: false });
          fetchData();
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal menghapus bundel', confirmButtonColor: '#7F56D9' });
        }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/master/promo/${editingId}`, formData);
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Bundel berhasil diupdate', timer: 1500, showConfirmButton: false });
      } else {
        await axios.post('http://localhost:8080/api/master/promo', formData);
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Bundel berhasil ditambahkan', timer: 1500, showConfirmButton: false });
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({
        nama_promo: '',
        jenis_promo: 'Bundel',
        tanggal_mulai: '',
        tanggal_selesai: '',
        nilai_diskon: 0,
        tipe_nilai: 'Nominal',
        status: 'Aktif',
        keterangan: ''
      });
      fetchData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal menyimpan bundel', confirmButtonColor: '#7F56D9' });
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 p-6">
      <SectionHeader 
        title="Promo Bundel" 
        subtitle="Paket produk dengan harga spesial"
      >
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95"
          >
             <FiPlus size={18} /> Bundel Baru
          </button>
      </SectionHeader>

      <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-gray-100 p-4 shadow-sm">
        <DataTable columns={columns} data={data} loading={loading} />
      </div>

      <ModalDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Promo Bundel' : 'Tambah Promo Bundel'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Nama Bundel</label>
              <input 
                type="text" required
                placeholder="Contoh: Paket Sehat"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                value={formData.nama_promo}
                onChange={(e) => setFormData({...formData, nama_promo: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Harga Paket (Rp)</label>
                  <input 
                    type="number" required
                    placeholder="0"
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    value={formData.nilai_diskon}
                    onChange={(e) => setFormData({...formData, nilai_diskon: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <select 
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Non-aktif">Non-aktif</option>
                  </select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Tanggal Mulai</label>
                  <input 
                    type="date" required
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    value={formData.tanggal_mulai ? formData.tanggal_mulai.split(' ')[0] : ''}
                    onChange={(e) => setFormData({...formData, tanggal_mulai: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Tanggal Selesai</label>
                  <input 
                    type="date" required
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    value={formData.tanggal_selesai ? formData.tanggal_selesai.split(' ')[0] : ''}
                    onChange={(e) => setFormData({...formData, tanggal_selesai: e.target.value})}
                  />
                </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50/50">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            >
              Batal
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-semibold text-white bg-primary-600 rounded-lg hover:bg-primary-700 shadow-sm transition-all"
            >
              Simpan Bundel
            </button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
}
