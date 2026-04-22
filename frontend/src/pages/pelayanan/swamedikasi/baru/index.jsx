import React, { useState } from 'react';
import { FiArrowLeft, FiEdit2, FiPlus, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function AccordionItem({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-100 dark:border-[#2a2a30] rounded-xl overflow-hidden mb-3">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-[#2a2a30]"
      >
        <span className="font-bold text-sm text-gray-700 dark:text-gray-300">{title}</span>
        {isOpen ? <FiChevronDown className="text-gray-400" /> : <FiChevronRight className="text-gray-400" />}
      </button>
      {isOpen && (
        <div className="p-4 bg-white dark:bg-[#1e1e24] text-sm text-gray-600 dark:text-gray-400 font-medium">
          {children}
        </div>
      )}
    </div>
  );
}

export default function FormSwamedikasi() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1e1e24] pb-12 -m-6">
      {/* Top Blue Header */}
      <div className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Swamedikasi</h1>
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
              <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"><FiEdit2 size={16} /></button>
              <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"><FiPlus size={16} /></button>
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
             <label className="block text-xs font-bold text-gray-500 mb-1.5">Tgl Input</label>
             <input type="datetime-local" defaultValue="2026-04-18T14:26" readOnly className="w-full bg-gray-100 dark:bg-gray-800 border-transparent rounded-lg px-3 py-2 text-sm font-medium outline-none text-gray-400" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Kode Swamedikasi *</label>
            <input type="text" value="SMB260418-1-1-2" readOnly className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium outline-none" />
          </div>
          <div className="flex-1 min-w-[250px]">
            <label className="block text-xs font-bold text-gray-500 mb-1.5">Apoteker *</label>
            <div className="flex items-center gap-2">
              <select className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-[#2a2a30] rounded-lg px-3 py-2 text-sm font-medium outline-none">
                <option>Pilih Apoteker</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column (SOAP Notes) */}
          <div className="lg:col-span-2 space-y-8 bg-white dark:bg-[#1e1e24] rounded-2xl border border-gray-100 dark:border-[#2a2a30] p-6 shadow-sm">
             
             {/* SUBJECTIVE */}
             <div>
               <h3 className="font-extrabold text-blue-800 dark:text-blue-400 text-base mb-4 uppercase tracking-widest border-b border-gray-50 pb-2">SUBJECTIVE</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   'Keluhan Utama/Gejala', 'Riwayat Penyakit Sekarang', 'Riwayat Penyakit Keluarga', 
                   'Konsumsi Obat Saat Ini', 'Riwayat Alergi Obat/Makanan', 'Gaya Hidup/Pola Makan'
                 ].map(label => (
                   <div key={label}>
                     <label className="block text-xs font-bold text-gray-500 mb-1">{label}</label>
                     <textarea className="w-full h-20 resize-none bg-gray-50 dark:bg-[#232329] border border-gray-200 dark:border-[#2a2a30] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"></textarea>
                   </div>
                 ))}
               </div>
             </div>

             {/* OBJECTIVE */}
             <div>
               <h3 className="font-extrabold text-blue-800 dark:text-blue-400 text-base mb-4 uppercase tracking-widest border-b border-gray-50 pb-2">OBJECTIVE</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   'Identifikasi Masalah Utama', 'Tingkat Keparahan / Skala Nyeri', 'Kondisi Fisik Pasien (Pucat, Lemas, dll)'
                 ].map(label => (
                   <div key={label}>
                     <label className="block text-xs font-bold text-gray-500 mb-1">{label}</label>
                     <textarea className="w-full h-20 resize-none bg-gray-50 dark:bg-[#232329] border border-gray-200 dark:border-[#2a2a30] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"></textarea>
                   </div>
                 ))}
               </div>
             </div>
             
             {/* ASSESSMENT */}
             <div>
               <h3 className="font-extrabold text-blue-800 dark:text-blue-400 text-base mb-4 uppercase tracking-widest border-b border-gray-50 pb-2">ASSESSMENT</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   'Keputusan Apoteker', 'Rekomendasi/Terapi'
                 ].map(label => (
                   <div key={label}>
                     <label className="block text-xs font-bold text-gray-500 mb-1">{label}</label>
                     <textarea className="w-full h-20 resize-none bg-gray-50 dark:bg-[#232329] border border-gray-200 dark:border-[#2a2a30] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"></textarea>
                   </div>
                 ))}
               </div>
             </div>

             {/* PLANNING */}
             <div>
               <h3 className="font-extrabold text-blue-800 dark:text-blue-400 text-base mb-4 uppercase tracking-widest border-b border-gray-50 pb-2">PLANNING</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   'Plan/Tindak Lanjut', 'Edukasi'
                 ].map(label => (
                   <div key={label}>
                     <label className="block text-xs font-bold text-gray-500 mb-1">{label}</label>
                     <textarea className="w-full h-20 resize-none bg-gray-50 dark:bg-[#232329] border border-gray-200 dark:border-[#2a2a30] rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"></textarea>
                   </div>
                 ))}
               </div>
             </div>
             
             <div className="h-4"></div>
          </div>

          {/* Right Column (Riwayat Pengobatan Accordions) */}
          <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-gray-100 dark:border-[#2a2a30] p-6 shadow-sm">
             <h3 className="font-extrabold text-blue-800 dark:text-blue-400 text-base mb-4">Riwayat Pengobatan</h3>
             
             <AccordionItem title="Informasi Dasar" defaultOpen={true}>
               <div className="space-y-2">
                 <div className="flex justify-between"><span>Nomor RM:</span> <span className="font-bold text-gray-900 dark:text-white">EMR000001</span></div>
                 <div className="flex justify-between"><span>Tgl Daftar:</span> <span className="font-bold text-gray-900 dark:text-white">1 Apr 2026</span></div>
                 <div className="flex justify-between"><span>Total Kunjungan:</span> <span className="font-bold text-gray-900 dark:text-white">1</span></div>
               </div>
             </AccordionItem>
             
             <AccordionItem title="Data Pasien">
               <div className="space-y-2 text-xs">
                 <p className="font-bold text-gray-900 dark:text-white py-2 text-center bg-gray-50 dark:bg-gray-800 rounded">Gunakan data KTP untuk sinkronisasi Satu Sehat</p>
                 <div className="flex flex-col gap-1 mt-2">
                   <div className="flex justify-between border-b border-gray-100 pb-1"><span>Nama:</span> <span className="text-gray-900 dark:text-white font-bold">andi</span></div>
                   <div className="flex justify-between border-b border-gray-100 pb-1"><span>NIK:</span> <span>-</span></div>
                   <div className="flex justify-between border-b border-gray-100 pb-1"><span>No. HP:</span> <span className="text-gray-900 dark:text-white font-bold">6282279727571</span></div>
                 </div>
               </div>
             </AccordionItem>

             <AccordionItem title="Pemeriksaan Oleh Dokter">
               <p className="text-center italic py-4">Belum ada data pemeriksaan</p>
             </AccordionItem>

             <AccordionItem title="Pemberian Obat Resep Tertentu">
               <p className="text-center italic py-4">Belum ada riwayat obat resep</p>
             </AccordionItem>
          </div>

        </div>
      </div>
    </div>
  );
}
