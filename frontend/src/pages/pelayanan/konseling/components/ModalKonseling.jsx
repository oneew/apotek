import React, { useState, useEffect } from 'react';
import ModalDialog from '../../../../components/ui/ModalDialog';
import { FiSave, FiX, FiUser, FiActivity, FiMessageSquare, FiCalendar, FiClock, FiPlusCircle } from 'react-icons/fi';
import Swal from 'sweetalert2';

export default function ModalKonseling({ isOpen, onClose, id, onSaveSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patients, setPatients] = useState([]);
  const [pharmacists, setPharmacists] = useState([]);
  const [formData, setFormData] = useState({
    tanggal_konseling: new Date().toISOString().slice(0, 16),
    pelanggan_id: '',
    apoteker_id: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    catatan: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchPatients();
      fetchPharmacists();
      if (id) {
        fetchDetail();
      } else {
        setFormData({
          tanggal_konseling: new Date().toISOString().slice(0, 16),
          pelanggan_id: '',
          apoteker_id: '',
          subjective: '',
          objective: '',
          assessment: '',
          plan: '',
          catatan: ''
        });
      }
    }
  }, [isOpen, id]);

  const fetchPatients = async () => {
    try {
      const resp = await fetch('/api/master/pelanggan');
      const res = await resp.json();
      if (res.status) setPatients(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchPharmacists = async () => {
    try {
      const resp = await fetch('/api/master/apoteker');
      const res = await resp.json();
      if (res.status) setPharmacists(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchDetail = async () => {
    try {
      const resp = await fetch(`/api/master/konseling/${id}`);
      const res = await resp.json();
      if (res.status) {
        setFormData({
          ...res.data,
          tanggal_konseling: res.data.tanggal_konseling.replace(' ', 'T').slice(0, 16)
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
    if (!formData.pelanggan_id || !formData.apoteker_id) {
        Swal.fire({ title: 'Validasi', text: 'Pasien dan Apoteker wajib dipilih', icon: 'warning' });
        return;
    }

    setIsSubmitting(true);
    try {
      const url = id ? `/api/master/konseling/${id}` : '/api/master/konseling';
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
      text: "Data konseling akan dihapus secara permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const resp = await fetch(`/api/master/konseling/${id}`, { method: 'DELETE' });
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
      title={id ? "Edit Sesi Konseling (SOAP)" : "Registrasi Sesi Konseling (SOAP)"} 
      subtitle="Pendokumentasian intervensi klinis menggunakan format SOAP."
      icon={<FiMessageSquare />}
      maxWidth="max-w-[900px]"
    >
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5 border-l-4 border-primary-500 pl-4">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Tanggal & Waktu</label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="datetime-local" 
                  name="tanggal_konseling" 
                  value={formData.tanggal_konseling} 
                  onChange={handleChange} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-xs font-semibold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all" 
                />
              </div>
          </div>

          <div className="space-y-1.5 border-l-4 border-success-500 pl-4">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Pasien / Pelanggan</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select 
                  name="pelanggan_id" 
                  value={formData.pelanggan_id} 
                  onChange={handleChange} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-xs font-semibold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all appearance-none"
                >
                  <option value="">-- Pilih Pasien --</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.nama_pelanggan} ({p.no_telepon})</option>)}
                </select>
              </div>
          </div>

          <div className="space-y-1.5 border-l-4 border-warning-500 pl-4">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Apoteker Pemeriksa</label>
              <div className="relative">
                <FiActivity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select 
                  name="apoteker_id" 
                  value={formData.apoteker_id} 
                  onChange={handleChange} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-xs font-semibold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all appearance-none"
                >
                  <option value="">-- Pilih Apoteker --</option>
                  {pharmacists.map(p => <option key={p.id} value={p.id}>{p.nama_apoteker}</option>)}
                </select>
              </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 mb-1">
               <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-black">S</span>
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Subjective (Keluhan Pasien)</label>
            </div>
            <textarea 
              name="subjective" 
              value={formData.subjective} 
              onChange={handleChange} 
              placeholder="Riwayat penyakit, keluhan utama, alergi obat..." 
              className="w-full h-32 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
            ></textarea>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 mb-1">
               <span className="w-6 h-6 bg-success-100 text-success-600 rounded-full flex items-center justify-center text-[10px] font-black">O</span>
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Objective (Hasil Pemeriksaan)</label>
            </div>
            <textarea 
              name="objective" 
              value={formData.objective} 
              onChange={handleChange} 
              placeholder="Tanda vital (TD, HR, RR, T), hasil laboratorium, fisik..." 
              className="w-full h-32 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
            ></textarea>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 mb-1">
               <span className="w-6 h-6 bg-warning-100 text-warning-600 rounded-full flex items-center justify-center text-[10px] font-black">A</span>
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Assessment (Analisa/Kesimpulan)</label>
            </div>
            <textarea 
              name="assessment" 
              value={formData.assessment} 
              onChange={handleChange} 
              placeholder="Drug Related Problems (DRP), diagnosa apoteker..." 
              className="w-full h-32 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
            ></textarea>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 mb-1">
               <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-[10px] font-black">P</span>
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Plan (Rencana Terapi)</label>
            </div>
            <textarea 
              name="plan" 
              value={formData.plan} 
              onChange={handleChange} 
              placeholder="Rekomendasi obat, dosis, cara pakai, edukasi..." 
              className="w-full h-32 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all"
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
                Hapus Sesi
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
              <FiSave /> {isSubmitting ? 'Menyimpan...' : 'Simpan SOAP'}
            </button>
          </div>
        </div>
      </form>
    </ModalDialog>
  );
}
