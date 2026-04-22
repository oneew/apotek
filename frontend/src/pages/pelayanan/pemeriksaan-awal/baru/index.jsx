import React from 'react';
import { FiArrowLeft, FiEdit2, FiPlus, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function FormPemeriksaanAwal() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1e1e24] pb-12 -m-6">
      {/* Top Blue Header */}
      <div className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Form Pemeriksaan Awal</h1>
        </div>
        <button className="bg-teal-500 hover:bg-teal-400 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition-colors cursor-pointer">
          Simpan
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto pt-6 px-6">
        {/* Top Control Bar */}
        <div className="bg-white dark:bg-[#232329] border border-gray-200 dark:border-[#2a2a30] rounded-xl p-4 flex flex-wrap gap-4 shadow-sm mb-6 items-end">
          <div className="flex-1 min-w-[250px]">
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Pasien *</label>
            <div className="flex items-center gap-2">
              <select className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium outline-none">
                <option>andi | 6282279727571</option>
              </select>
            </div>
          </div>
          <div className="flex-1 min-w-[250px]">
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Dokter *</label>
            <div className="flex items-center gap-2">
              <select className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium outline-none">
                <option>Aqeela Nayyira Afwa</option>
              </select>
              <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"><FiEdit2 size={16} /></button>
              <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"><FiPlus size={16} /></button>
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Kode Pemeriksaan *</label>
            <input type="text" value="ERB260418-1-1-1" readOnly className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium outline-none" />
          </div>
          <div className="flex-1 min-w-[200px]">
             <label className="block text-xs font-bold text-gray-500 mb-1.5">Tanggal Periksa</label>
             <input type="datetime-local" defaultValue="2026-04-18T13:58" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium outline-none" />
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column (SOAP Notes & Data) */}
          <div className="lg:col-span-2 space-y-8 bg-white dark:bg-[#1e1e24] rounded-2xl border border-gray-100 dark:border-[#2a2a30] p-6 shadow-sm">
             {/* Data Pasien & Dokter Info Headers */}
             <div className="flex flex-col sm:flex-row gap-8 pb-6 border-b border-gray-100 dark:border-[#2a2a30]">
               <div className="flex-1 text-sm">
                 <h3 className="font-extrabold text-blue-800 dark:text-blue-400 text-base mb-3">Data Pasien</h3>
                 <div className="grid grid-cols-[130px_auto] gap-y-1 text-gray-700 dark:text-gray-300 font-medium">
                   <span>Nama Pasien</span><span>: andi</span>
                   <span>Nomor Rekam Medis</span><span>: EMR000001</span>
                   <span>Nomor Telfon</span><span>: 6282279727571</span>
                   <span>Email</span><span>: Aqela@gmail.com</span>
                   <span>Jenis Kelamin</span><span>: L</span>
                   <span>Tgl. Lahir</span><span>: 1 Apr 2026</span>
                   <span>Umur</span><span>: 0 thn 0 bln</span>
                   <span>Alamat</span><span>: pbm</span>
                 </div>
               </div>
               <div className="flex-1 text-sm border-l border-transparent sm:border-gray-100 dark:sm:border-[#2a2a30] pl-0 sm:pl-8">
                 <h3 className="font-extrabold text-blue-800 dark:text-blue-400 text-base mb-3">Data Dokter</h3>
                 <div className="grid grid-cols-[100px_auto] gap-y-1 text-gray-700 dark:text-gray-300 font-medium">
                   <span>Nama Dokter</span><span>: Aqeela Nayyira Afwa</span>
                   <span>No. SIP</span><span>: 123456789</span>
                 </div>
               </div>
             </div>

             {/* SUBJECTIVE */}
             <div>
               <h3 className="font-extrabold text-blue-800 dark:text-blue-400 text-base mb-4 uppercase tracking-widest">SUBJECTIVE</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   'Keluhan', 'Riwayat Penyakit Sekarang', 'Riwayat Penyakit Dahulu', 'Riwayat Sosial',
                   'Riwayat Kelahiran', 'Riwayat Tumbuh Kembang', 'Konsumsi Obat Saat Ini', 'Riwayat Alergi Obat'
                 ].map(label => (
                   <div key={label}>
                     <label className="block text-xs font-bold text-gray-500 mb-1">{label}</label>
                     <textarea className="w-full h-20 resize-none bg-gray-50 dark:bg-[#232329] border border-gray-200 dark:border-[#2a2a30] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"></textarea>
                   </div>
                 ))}
               </div>
             </div>

             {/* OBJECTIVE: Tanda Vital */}
             <div>
               <h3 className="font-extrabold text-blue-800 dark:text-blue-400 text-base mb-2 uppercase tracking-widest">OBJECTIVE</h3>
               <h4 className="font-bold text-blue-800 dark:text-blue-400 text-sm mb-4">Tanda Vital</h4>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                 {[
                   { label: 'Tekanan Darah (Sistolik)', suffix: 'mmHg' },
                   { label: 'Tekanan Darah (Diastolik)', suffix: 'mmHg' },
                   { label: 'Nafas', suffix: 'x/menit' },
                   { label: 'Denyut Nadi', suffix: 'x/menit' },
                   { label: 'Suhu Tubuh', suffix: '°C' },
                   { label: 'Kadar Oksigen (SpO2)', suffix: '%' },
                 ].map((item, i) => (
                   <div key={i}>
                     <label className="block text-xs font-bold text-gray-500 mb-1">{item.label}</label>
                     <div className="flex items-center gap-2">
                       <input type="text" className="flex-1 bg-gray-50 dark:bg-[#232329] border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm outline-none w-0" />
                       <span className="text-xs text-gray-400">{item.suffix}</span>
                     </div>
                   </div>
                 ))}
               </div>

               <h4 className="font-bold text-blue-800 dark:text-blue-400 text-sm mb-4 mt-6">Nyeri</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">Skala Nyeri (1 s.d. 10)</label>
                   <input type="number" min="1" max="10" className="w-full bg-gray-50 dark:bg-[#232329] border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm outline-none" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1">Lokasi Nyeri</label>
                   <input type="text" className="w-full bg-gray-50 dark:bg-[#232329] border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm outline-none" />
                 </div>
               </div>
             </div>

             <div className="h-8"></div>
          </div>

          {/* Right Column (Riwayat & Surat Keterangan) */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-gray-100 dark:border-[#2a2a30] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-blue-800 dark:text-blue-400 text-base">Riwayat Pemeriksaan</h3>
                <div className="flex gap-2">
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"><FiChevronLeft /></button>
                  <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"><FiChevronRight /></button>
                </div>
              </div>
              <div className="p-4 border border-gray-100 dark:border-gray-800 rounded-xl text-center text-gray-400 text-sm py-8 font-medium">
                Belum ada riwayat
              </div>
            </div>

            <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-gray-100 dark:border-[#2a2a30] p-6 shadow-sm">
               <h3 className="font-extrabold text-blue-800 dark:text-blue-400 text-base mb-4">Surat Keterangan</h3>
               <div className="space-y-3">
                 <button className="w-full py-2.5 border border-blue-200 text-blue-600 hover:bg-blue-50 font-bold rounded-xl text-sm transition-colors">
                   Surat Keterangan Sehat
                 </button>
                 <button className="w-full py-2.5 border border-blue-200 text-blue-600 hover:bg-blue-50 font-bold rounded-xl text-sm transition-colors">
                   Surat Keterangan Sakit
                 </button>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
