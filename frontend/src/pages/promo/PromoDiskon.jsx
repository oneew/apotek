import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/ui/SectionHeader';
import DataTable from '../../components/ui/DataTable';
import ModalDialog from '../../components/ui/ModalDialog';
import { FiFilter, FiSearch, FiPlus, FiTrash2, FiEdit2, FiTag } from 'react-icons/fi';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function PromoDiskon() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nama_promo: '',
    jenis_promo: 'Diskon',
    tanggal_mulai: '',
    tanggal_selesai: '',
    nilai_diskon: 0,
    tipe_nilai: 'Persen',
    status: 'Aktif',
    keterangan: ''
  });
  const [editingId, setEditingId] = useState(null);

  const columns = [
    { key: 'no', label: 'No.', width: '60px', render: (_, index) => index + 1 },
    { 
      key: 'nama_promo', 
      label: 'Nama Program Promo',
      render: (val) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
            <FiTag size={16} />
          </div>
          <span className="font-medium text-gray-900">{val}</span>
        </div>
      )
    },
    { 
      key: 'jenis_promo', 
      label: 'Jenis',
      render: (val) => (
        <span className={`px-2 py-1 rounded-md text-xs font-bold ${
          val === 'Diskon' ? 'bg-blue-50 text-blue-700' : 
          val === 'Bundel' ? 'bg-primary-50 text-primary-700' : 'bg-primary-50 text-primary-700'
        }`}>
          {val}
        </span>
      )
    },
    { 
        key: 'nilai_diskon', 
        label: 'Nilai',
        render: (val, row) => (
            <span className="font-bold text-gray-700">
                {row.tipe_nilai === 'Persen' ? `${val}%` : `Rp ${new Intl.NumberFormat('id-ID').format(val)}`}
            </span>
        )
    },
    { 
      key: 'tanggal_mulai', 
      label: 'Periode',
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
        <div className="flex gap-2 justify-end items-center">
            <button 
                onClick={() => handleEdit(row)}
                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            >
                <FiEdit2 size={16} />
            </button>
            <button 
                onClick={() => handleDelete(row.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
                <FiTrash2 size={16} />
            </button>
        </div>
      )
    }
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8080/api/master/promo');
      setData(res.data.data);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal mengambil data promo', confirmButtonColor: '#7F56D9' });
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
        title: 'Yakin hapus promo?',
        text: "Data yang dihapus tidak dapat dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/master/promo/${id}`);
          Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Promo berhasil dihapus', timer: 1500, showConfirmButton: false });
          fetchData();
        } catch (err) {
          Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal menghapus promo', confirmButtonColor: '#7F56D9' });
        }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/master/promo/${editingId}`, formData);
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Promo berhasil diupdate', timer: 1500, showConfirmButton: false });
      } else {
        await axios.post('http://localhost:8080/api/master/promo', formData);
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Promo berhasil ditambahkan', timer: 1500, showConfirmButton: false });
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({
        nama_promo: '',
        jenis_promo: 'Diskon',
        tanggal_mulai: '',
        tanggal_selesai: '',
        nilai_diskon: 0,
        tipe_nilai: 'Persen',
        status: 'Aktif',
        keterangan: ''
      });
      fetchData();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal menyimpan promo', confirmButtonColor: '#7F56D9' });
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-12 p-6">
      <SectionHeader 
        title="Program Promo" 
        subtitle="Kelola program diskon, bundel, dan voucher belanja"
      >
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-md transition-all active:scale-95"
          >
             <FiPlus size={18} /> Program Baru
          </button>
      </SectionHeader>

      <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-gray-100 dark:border-[#2a2a30] p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-50 dark:border-[#2a2a30] mb-4">
          <div className="relative w-full sm:w-80">
            <input 
              type="text" 
              placeholder="Cari program promo..."
              className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-[#1a1a20] border border-gray-100 dark:border-[#2a2a30] rounded-xl text-sm focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
          
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-[#1a1a20] border border-gray-100 dark:border-[#2a2a30] rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 transition-all">
            <FiFilter size={16} /> Filter
          </button>
        </div>

        <DataTable 
          columns={columns} 
          data={data} 
          loading={loading}
        />
      </div>

      <ModalDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Program Promo' : 'Tambah Program Promo'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Nama Program</label>
                <input 
                  type="text"
                  required
                  placeholder="Contoh: Promo Ramadhan"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  value={formData.nama_promo}
                  onChange={(e) => setFormData({...formData, nama_promo: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Jenis Promo</label>
                <select 
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  value={formData.jenis_promo}
                  onChange={(e) => setFormData({...formData, jenis_promo: e.target.value})}
                >
                  <option value="Diskon">Diskon</option>
                  <option value="Bundel">Bundel</option>
                  <option value="Voucher">Voucher</option>
                </select>
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

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Nilai Promo</label>
                <input 
                  type="number"
                  placeholder="0"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  value={formData.nilai_diskon}
                  onChange={(e) => setFormData({...formData, nilai_diskon: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Tipe Nilai</label>
                <select 
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  value={formData.tipe_nilai}
                  onChange={(e) => setFormData({...formData, tipe_nilai: e.target.value})}
                >
                  <option value="Persen">Persen (%)</option>
                  <option value="Nominal">Nominal (Rp)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Tanggal Mulai</label>
                <input 
                  type="date"
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  value={formData.tanggal_mulai ? formData.tanggal_mulai.split(' ')[0] : ''}
                  onChange={(e) => setFormData({...formData, tanggal_mulai: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Tanggal Selesai</label>
                <input 
                  type="date"
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  value={formData.tanggal_selesai ? formData.tanggal_selesai.split(' ')[0] : ''}
                  onChange={(e) => setFormData({...formData, tanggal_selesai: e.target.value})}
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Keterangan</label>
                <textarea 
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none h-20 resize-none transition-all"
                  placeholder="Keterangan tambahan..."
                  value={formData.keterangan || ''}
                  onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
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
              Simpan Program
            </button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
}
