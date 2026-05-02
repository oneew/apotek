import React, { useState, useEffect } from 'react';
import ModalDialog from '../../../../components/ui/ModalDialog';
import { FiSave, FiX, FiUser, FiActivity, FiInfo, FiCalendar, FiBookOpen } from 'react-icons/fi';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:8080/api';

export default function ModalPio({ isOpen, onClose, id, onSaveSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patients, setPatients] = useState([]);
  const [pharmacists, setPharmacists] = useState([]);
  const [formData, setFormData] = useState({
    tanggal_pio: new Date().toISOString().slice(0, 16),
    pelanggan_id: '',
    apoteker_id: '',
    nama_obat: '',
    aturan_pakai: '',
    efek_samping: '',
    catatan_khusus: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchPatients();
      fetchPharmacists();
      if (id) {
        fetchDetail();
      } else {
        setFormData({
          tanggal_pio: new Date().toISOString().slice(0, 16),
          pelanggan_id: '',
          apoteker_id: '',
          nama_obat: '',
          aturan_pakai: '',
          efek_samping: '',
          catatan_khusus: ''
        });
      }
    }
  }, [isOpen, id]);

  const fetchPatients = async () => {
    try {
      const resp = await fetch(`${API_BASE}/master/pelanggan`);
      const res = await resp.json();
      if (res.status) setPatients(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchPharmacists = async () => {
    try {
      const resp = await fetch(`${API_BASE}/master/apoteker`);
      const res = await resp.json();
      if (res.status) setPharmacists(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchDetail = async () => {
    try {
      const resp = await fetch(`${API_BASE}/master/pio/${id}`);
      const res = await resp.json();
      if (res.status) {
        setFormData({
          ...res.data,
          tanggal_pio: res.data.tanggal_pio.replace(' ', 'T').slice(0, 16)
        });
      }
    } catch (e) { console.error(e); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama_obat || !formData.apoteker_id) {
        Swal.fire({ title: 'Validasi', text: 'Nama Obat dan Apoteker wajib diisi', icon: 'warning' });
        return;
    }

    setIsSubmitting(true);
    try {
      const url = id ? `${API_BASE}/master/pio/${id}` : `${API_BASE}/master/pio`;
      const method = id ? 'PUT' : 'POST';
      
      const resp = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const res = await resp.json();
      if (res.status) {
        Swal.fire({ title: 'Berhasil', text: res.message, icon: 'success', timer: 1500 });
        onSaveSuccess();
        onClose();
      } else {
        Swal.fire({ title: 'Gagal', text: res.message, icon: 'error' });
      }
    } catch (e) {
      Swal.fire({ title: 'Error', text: 'Terjadi kesalahan sistem', icon: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Apakah anda yakin?',
      text: "Data PIO akan dihapus secara permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const resp = await fetch(`${API_BASE}/master/pio/${id}`, { method: 'DELETE' });
        const res = await resp.json();
        if (res.status) {
          Swal.fire('Terhapus!', res.message, 'success');
          onSaveSuccess();
          onClose();
        }
      } catch (e) {
        Swal.fire('Error', 'Gagal menghapus data', 'error');
      }
    }
  };

  return (
    <ModalDialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title={id ? "Edit Dokumentasi PIO" : "Registrasi Pemberian Informasi Obat (PIO)"} 
      subtitle="Pencatatan pemberian informasi obat secara lisan maupun tertulis kepada pasien."
      icon={<FiInfo />}
      maxWidth="max-w-[800px]"
    >
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5 border-l-4 border-primary-500 pl-4">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Tanggal & Waktu</label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="datetime-local" 
                  name="tanggal_pio" 
                  value={formData.tanggal_pio} 
                  onChange={handleChange} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-xs font-semibold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all" 
                />
              </div>
          </div>

          <div className="space-y-1.5 border-l-4 border-success-500 pl-4">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Pasien (Pelanggan)</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select 
                  name="pelanggan_id" 
                  value={formData.pelanggan_id} 
                  onChange={handleChange} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-xs font-semibold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none"
                >
                  <option value="">-- Umum / Pilih Pasien --</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.nama_pelanggan} ({p.no_telepon})</option>)}
                </select>
              </div>
          </div>

          <div className="space-y-1.5 border-l-4 border-warning-500 pl-4">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Apoteker Pemberi Info</label>
              <div className="relative">
                <FiActivity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select 
                  name="apoteker_id" 
                  value={formData.apoteker_id} 
                  onChange={handleChange} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-xs font-semibold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none"
                >
                  <option value="">-- Pilih Apoteker --</option>
                  {pharmacists.map(p => <option key={p.id} value={p.id}>{p.nama_apoteker}</option>)}
                </select>
              </div>
          </div>

          <div className="space-y-1.5 border-l-4 border-primary-500 pl-4">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Nama Obat *</label>
              <div className="relative">
                <FiBookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  name="nama_obat" 
                  value={formData.nama_obat} 
                  onChange={handleChange} 
                  placeholder="Nama obat yang diinformasikan..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-xs font-semibold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" 
                />
              </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Aturan Pakai & Cara Penggunaan</label>
            <textarea 
              name="aturan_pakai" 
              value={formData.aturan_pakai} 
              onChange={handleChange} 
              placeholder="Dosis, frekuensi, sebelum/sesudah makan, cara simpan..." 
              className="w-full h-24 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            ></textarea>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Efek Samping & Kontraindikasi</label>
            <textarea 
              name="efek_samping" 
              value={formData.efek_samping} 
              onChange={handleChange} 
              placeholder="Efek samping yang mungkin muncul..." 
              className="w-full h-24 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            ></textarea>
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Catatan Khusus (Lain-lain)</label>
            <textarea 
              name="catatan_khusus" 
              value={formData.catatan_khusus} 
              onChange={handleChange} 
              placeholder="Informasi tambahan lainnya..." 
              className="w-full h-20 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-between items-center bg-gray-50 -mx-8 -mb-8 px-8 py-5 border-t border-gray-200">
          <div>
            {id && (
              <button 
                type="button" 
                onClick={handleDelete}
                className="text-xs font-bold text-red-500 uppercase tracking-tight hover:underline"
              >
                Hapus Data
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-tight hover:bg-gray-100 rounded-lg transition-all"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-bold uppercase transition-all shadow-md shadow-primary-500/20 active:scale-95 disabled:opacity-50"
            >
              <FiSave /> {isSubmitting ? 'Menyimpan...' : 'Simpan Dokumentasi'}
            </button>
          </div>
        </div>
      </form>
    </ModalDialog>
  );
}
