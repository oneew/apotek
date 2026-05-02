import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiEdit2, FiPlus, FiChevronLeft, FiChevronRight, FiSave } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Button from '../../../../components/ui/Button';

const API_BASE = 'http://localhost:8080/api';

export default function FormPemeriksaanAwal() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const kunjunganId = searchParams.get('id');

  const [loading, setLoading] = useState(false);
  const [kunjungan, setKunjungan] = useState(null);
  
  // Form State
  const [form, setForm] = useState({
    keluhan: '',
    riwayatSekarang: '',
    riwayatDahulu: '',
    riwayatSosial: '',
    riwayatKelahiran: '',
    riwayatTumbuhKembang: '',
    konsumsiObat: '',
    riwayatAlergi: '',
    tensiSistolik: '',
    tensiDiastolik: '',
    nafas: '',
    nadi: '',
    suhu: '',
    spo2: '',
    skalaNyeri: '',
    lokasiNyeri: ''
  });

  useEffect(() => {
    if (kunjunganId) {
      fetchKunjungan();
    }
  }, [kunjunganId]);

  const fetchKunjungan = async () => {
    setLoading(true);
    try {
      // Fetch all and find the matching ID
      const response = await fetch(`${API_BASE}/master/kunjungan`);
      const res = await response.json();
      if (res.status) {
        const found = res.data.find(d => d.id == kunjunganId);
        if (found) {
          setKunjungan(found);
          
          // Parse catatan if it's JSON
          let parsedCatatan = {};
          try {
            if (found.catatan) {
              parsedCatatan = JSON.parse(found.catatan);
            }
          } catch(e) {
            // It might be plain text
          }

          setForm(prev => ({
            ...prev,
            keluhan: found.keluhan || '',
            ...parsedCatatan
          }));
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!kunjunganId) {
      Swal.fire('Error', 'Pilih pasien dari antrian terlebih dahulu', 'error');
      return;
    }

    setLoading(true);
    try {
      // We store all the extra fields in catatan as JSON
      const { keluhan, ...catatanData } = form;
      
      const payload = {
        keluhan: keluhan,
        catatan: JSON.stringify(catatanData),
        status: 'In Progress' // Update status to reflect it has been triaged
      };

      const response = await fetch(`${API_BASE}/master/kunjungan/${kunjunganId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const res = await response.json();
      if (res.status) {
        Swal.fire({
          title: 'Tersimpan!',
          text: 'Data pemeriksaan awal berhasil disimpan.',
          icon: 'success',
          confirmButtonColor: '#7F56D9'
        }).then(() => {
          navigate('/pelayanan/pemeriksaan-awal');
        });
      } else {
        Swal.fire('Gagal', res.message || 'Gagal menyimpan data', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Terjadi kesalahan sistem', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium";
  const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";
  const sectionTitleClass = "font-bold text-gray-900 dark:text-white text-base mb-4 tracking-tight";
  const sectionSubtitleClass = "font-extrabold text-primary-700 dark:text-primary-400 text-xs mb-3 uppercase tracking-widest";
  const cardClass = "bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm";

  return (
    <div className="animate-unt-fade">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/pelayanan/pemeriksaan-awal')} 
            className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Pemeriksaan Awal (Triase)</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Formulir isian data subjektif dan objektif pasien.</p>
          </div>
        </div>
        <Button 
          onClick={handleSave}
          disabled={loading}
          variant="primary"
          iconLeft={FiSave}
          className="rounded-lg shadow-sm"
        >
          {loading ? 'Menyimpan...' : 'Simpan Data'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column (SOAP Notes & Data) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Top Control Bar */}
          <div className={cardClass}>
            <h3 className={sectionTitleClass}>Identitas Pasien & Antrian</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Nama Pasien</label>
                <input type="text" readOnly value={kunjungan?.nama_pelanggan || 'Umum'} className={`${inputClass} bg-gray-50 text-gray-500`} />
              </div>
              <div>
                <label className={labelClass}>Dokter Tujuan</label>
                <input type="text" readOnly value={kunjungan?.nama_dokter || '-'} className={`${inputClass} bg-gray-50 text-gray-500`} />
              </div>
              <div>
                <label className={labelClass}>Kode Antrian</label>
                <input type="text" readOnly value={kunjungan?.nomor_antrian || '-'} className={`${inputClass} bg-gray-50 font-bold text-primary-600`} />
              </div>
              <div>
                 <label className={labelClass}>Waktu Kunjungan</label>
                 <input type="text" readOnly value={kunjungan ? new Date(kunjungan.tanggal_kunjungan).toLocaleString('id-ID') : '-'} className={`${inputClass} bg-gray-50 text-gray-500`} />
              </div>
            </div>
          </div>

          <div className={cardClass}>
             {/* SUBJECTIVE */}
             <div className="mb-8">
               <h3 className={sectionSubtitleClass}>SUBJECTIVE (SUBJEKTIF)</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 {[
                   { label: 'Keluhan Utama', name: 'keluhan' },
                   { label: 'Riwayat Penyakit Sekarang', name: 'riwayatSekarang' },
                   { label: 'Riwayat Penyakit Dahulu', name: 'riwayatDahulu' },
                   { label: 'Riwayat Sosial', name: 'riwayatSosial' },
                   { label: 'Riwayat Kelahiran', name: 'riwayatKelahiran' },
                   { label: 'Riwayat Tumbuh Kembang', name: 'riwayatTumbuhKembang' },
                   { label: 'Konsumsi Obat Saat Ini', name: 'konsumsiObat' },
                   { label: 'Riwayat Alergi Obat', name: 'riwayatAlergi' }
                 ].map(item => (
                   <div key={item.name}>
                     <label className={labelClass}>{item.label}</label>
                     <textarea 
                       name={item.name}
                       value={form[item.name]}
                       onChange={handleChange}
                       className={`${inputClass} h-20 resize-none`}
                       placeholder={`Masukkan ${item.label.toLowerCase()}...`}
                     ></textarea>
                   </div>
                 ))}
               </div>
             </div>

             {/* OBJECTIVE: Tanda Vital */}
             <div>
               <h3 className={sectionSubtitleClass}>OBJECTIVE (OBJEKTIF)</h3>
               <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-4">Tanda Vital</h4>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                 {[
                   { label: 'Tekanan Darah (Sistolik)', name: 'tensiSistolik', suffix: 'mmHg' },
                   { label: 'Tekanan Darah (Diastolik)', name: 'tensiDiastolik', suffix: 'mmHg' },
                   { label: 'Nafas', name: 'nafas', suffix: 'x/menit' },
                   { label: 'Denyut Nadi', name: 'nadi', suffix: 'x/menit' },
                   { label: 'Suhu Tubuh', name: 'suhu', suffix: '°C' },
                   { label: 'Kadar Oksigen (SpO2)', name: 'spo2', suffix: '%' },
                 ].map((item) => (
                   <div key={item.name}>
                     <label className={labelClass}>{item.label}</label>
                     <div className="flex items-center gap-2">
                       <input 
                         type="number" 
                         name={item.name}
                         value={form[item.name]}
                         onChange={handleChange}
                         className={inputClass} 
                       />
                       <span className="text-sm font-medium text-gray-500 w-12">{item.suffix}</span>
                     </div>
                   </div>
                 ))}
               </div>

               <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-4 mt-8">Penilaian Nyeri</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div>
                   <label className={labelClass}>Skala Nyeri (1 s.d. 10)</label>
                   <input 
                     type="number" min="1" max="10" 
                     name="skalaNyeri"
                     value={form.skalaNyeri}
                     onChange={handleChange}
                     className={inputClass} 
                   />
                 </div>
                 <div>
                   <label className={labelClass}>Lokasi Nyeri</label>
                   <input 
                     type="text" 
                     name="lokasiNyeri"
                     value={form.lokasiNyeri}
                     onChange={handleChange}
                     className={inputClass} 
                   />
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Right Column (Riwayat & Surat Keterangan) */}
        <div className="space-y-6">
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={sectionTitleClass}>Riwayat Pemeriksaan</h3>
              <div className="flex gap-2">
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 transition-colors"><FiChevronLeft /></button>
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 transition-colors"><FiChevronRight /></button>
              </div>
            </div>
            <div className="p-6 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Belum ada riwayat sebelumnya</p>
            </div>
          </div>

          <div className={cardClass}>
             <h3 className={sectionTitleClass}>Aksi Cepat</h3>
             <div className="space-y-3">
               <button className="w-full py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold rounded-lg text-sm transition-colors shadow-sm">
                 Cetak Surat Keterangan Sehat
               </button>
               <button className="w-full py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold rounded-lg text-sm transition-colors shadow-sm">
                 Cetak Surat Keterangan Sakit
               </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

